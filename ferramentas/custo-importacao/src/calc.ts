import params from './params-2026.json';

export type Faixa = 'isento' | 'sessenta' | 'fora-do-regime';

export interface ImportacaoInput {
  produtoUsdCents: number;
  freteUsdCents?: number;
  seguroUsdCents?: number;
  /** Cotação do dólar em centavos de real (R$ 5,00 = 500). */
  cotacaoCents: number;
  uf: string;
  remessaConforme: boolean;
  iofPercentual?: number;
  outrasTaxasCents?: number;
}

export interface ImportacaoResultado {
  valorAduaneiroUsdCents: number;
  valorAduaneiroCents: number;
  faixa: Faixa;
  aliquotaII: number;
  descontoUsdCents: number;
  iiUsdCents: number;
  iiCents: number;
  aliquotaIcms: number;
  baseIcmsCents: number;
  icmsCents: number;
  iofCents: number;
  outrasTaxasCents: number;
  totalImpostosCents: number;
  custoFinalCents: number;
  percentualEfetivo: number;
  acimaDoLimite: boolean;
}

const positivo = (valor: number | undefined): number =>
  Number.isFinite(valor) && (valor ?? 0) > 0 ? Math.round(valor as number) : 0;

export function converterParaReais(usdCents: number, cotacaoCents: number): number {
  return Math.round((usdCents * cotacaoCents) / 100);
}

export function aliquotaIcmsDaUf(uf: string): number {
  const tabela = params.icmsPorUf as Record<string, number>;
  return tabela[uf.toUpperCase()] ?? tabela.SP;
}

export function calcularImportacao(input: ImportacaoInput): ImportacaoResultado {
  const produto = positivo(input.produtoUsdCents);
  const frete = positivo(input.freteUsdCents);
  const seguro = positivo(input.seguroUsdCents);
  const cotacao = positivo(input.cotacaoCents) || 500;
  const outras = positivo(input.outrasTaxasCents);
  const iofPercentual = Math.max(0, input.iofPercentual ?? 0);

  const valorAduaneiroUsd = produto + frete + seguro;
  const valorAduaneiro = converterParaReais(valorAduaneiroUsd, cotacao);

  const acimaDoLimite = valorAduaneiroUsd > params.limiteRegimeUsdCents;
  const isento =
    input.remessaConforme && valorAduaneiroUsd <= params.limiteIsencaoUsdCents;

  let faixa: Faixa;
  let aliquotaII = 0;
  let descontoUsd = 0;

  if (acimaDoLimite) {
    faixa = 'fora-do-regime';
    aliquotaII = params.foraRemessaConforme.aliquota;
    descontoUsd = params.foraRemessaConforme.descontoUsdCents;
  } else if (input.remessaConforme) {
    faixa = isento ? 'isento' : 'sessenta';
    aliquotaII = isento ? 0 : params.remessaConforme.aliquotaAcimaDoLimite;
    descontoUsd = isento ? 0 : params.remessaConforme.descontoAcimaDoLimiteUsdCents;
  } else {
    faixa = 'sessenta';
    aliquotaII = params.foraRemessaConforme.aliquota;
    descontoUsd = params.foraRemessaConforme.descontoUsdCents;
  }

  const iiUsd = Math.max(0, Math.round(valorAduaneiroUsd * aliquotaII) - descontoUsd);
  const ii = converterParaReais(iiUsd, cotacao);

  const aliquotaIcms = aliquotaIcmsDaUf(input.uf);
  const baseIcms = Math.round((valorAduaneiro + ii) / (1 - aliquotaIcms));
  const icms = Math.round(baseIcms * aliquotaIcms);

  const iof = Math.round(valorAduaneiro * iofPercentual);
  const totalImpostos = ii + icms + iof + outras;

  return {
    valorAduaneiroUsdCents: valorAduaneiroUsd,
    valorAduaneiroCents: valorAduaneiro,
    faixa,
    aliquotaII,
    descontoUsdCents: descontoUsd,
    iiUsdCents: iiUsd,
    iiCents: ii,
    aliquotaIcms,
    baseIcmsCents: baseIcms,
    icmsCents: icms,
    iofCents: iof,
    outrasTaxasCents: outras,
    totalImpostosCents: totalImpostos,
    custoFinalCents: valorAduaneiro + totalImpostos,
    percentualEfetivo: valorAduaneiro > 0 ? totalImpostos / valorAduaneiro : 0,
    acimaDoLimite,
  };
}
