import params from './params-2026.json';
import { clamp } from './money';

export interface IrrfParams {
  descontoSimplificadoCents: number;
  dependenteCents: number;
  faixas: { ateCents: number; aliquota: number; deduzirCents: number }[];
  redutor: {
    limiteIsentoCents: number;
    limiteFinalCents: number;
    baseCents: number;
    coeficiente: number;
  };
}

export interface IrrfInput {
  rendimentoCents: number;
  inssCents?: number;
  dependentes?: number;
  pensaoCents?: number;
}

export interface IrrfResultado {
  baseLegalCents: number;
  baseSimplificadaCents: number;
  baseEscolhidaCents: number;
  impostoTabelaCents: number;
  redutorCents: number;
  impostoCents: number;
}

export function impostoDeTabela(baseCents: number, irrf: IrrfParams = params.irrf): number {
  if (baseCents <= 0) return 0;
  const faixa =
    irrf.faixas.find((f) => baseCents <= f.ateCents) ?? irrf.faixas[irrf.faixas.length - 1];
  return clamp(Math.round(baseCents * faixa.aliquota) - faixa.deduzirCents, 0, Number.MAX_SAFE_INTEGER);
}

/**
 * Redutor mensal da Lei 15.270/2025: zera o IR até R$ 5.000 de rendimento e
 * cai linearmente até R$ 7.350, sempre limitado ao imposto apurado.
 */
export function redutorLei15270(rendimentoCents: number, irrf: IrrfParams = params.irrf): number {
  const { redutor } = irrf;
  if (rendimentoCents <= redutor.limiteIsentoCents) return Number.MAX_SAFE_INTEGER;
  if (rendimentoCents > redutor.limiteFinalCents) return 0;
  return Math.max(0, redutor.baseCents - redutor.coeficiente * rendimentoCents);
}

export function calcularIrrf(input: IrrfInput, irrf: IrrfParams = params.irrf): IrrfResultado {
  const rendimento = Math.max(0, input.rendimentoCents);
  const inss = input.inssCents ?? 0;
  const dependentes = input.dependentes ?? 0;
  const pensao = input.pensaoCents ?? 0;

  const baseLegal = Math.max(
    0,
    rendimento - inss - dependentes * irrf.dependenteCents - pensao,
  );
  const baseSimplificada = Math.max(0, rendimento - irrf.descontoSimplificadoCents);
  const baseEscolhida = Math.min(baseLegal, baseSimplificada);

  const impostoTabela = impostoDeTabela(baseEscolhida, irrf);
  const redutor = Math.round(Math.min(redutorLei15270(rendimento, irrf), impostoTabela));

  return {
    baseLegalCents: baseLegal,
    baseSimplificadaCents: baseSimplificada,
    baseEscolhidaCents: baseEscolhida,
    impostoTabelaCents: impostoTabela,
    redutorCents: redutor,
    impostoCents: Math.max(0, impostoTabela - redutor),
  };
}
