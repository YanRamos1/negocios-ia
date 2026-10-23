import params from './params-2026.json';
import { calcularIrrf } from './irrf';
import { contribuicaoProlabore } from './inss';
import { aliquotaEfetiva, anexoPorFatorR, fatorR, type Anexo } from './simples';

export interface PjInput {
  faturamentoMensalCents: number;
  prolaboreCents?: number;
  prolaborePercentualFaturamento?: number;
  despesasMensaisCents?: number;
  dependentes?: number;
  anexo?: 'auto' | Anexo;
}

export interface PjResultado {
  faturamentoMensalCents: number;
  prolaboreCents: number;
  rbt12Cents: number;
  folha12Cents: number;
  fatorR: number;
  anexo: Anexo;
  aliquotaEfetiva: number;
  dasCents: number;
  inssProlaboreCents: number;
  irrfProlaboreCents: number;
  despesasMensaisCents: number;
  liquidoMensalCents: number;
  liquidoAnualCents: number;
}

export function resolverProlabore(input: PjInput): number {
  if (input.prolaborePercentualFaturamento !== undefined) {
    return Math.round(input.faturamentoMensalCents * input.prolaborePercentualFaturamento);
  }
  return Math.max(0, Math.round(input.prolaboreCents ?? 0));
}

export function calcularPj(input: PjInput): PjResultado {
  const faturamento = Math.max(0, Math.round(input.faturamentoMensalCents));
  const prolabore = resolverProlabore(input);
  const despesas = Math.max(0, Math.round(input.despesasMensaisCents ?? 0));
  const dependentes = input.dependentes ?? 0;

  const rbt12 = faturamento * 12;
  const folha12 = prolabore * 12;
  const fator = fatorR(folha12, rbt12);
  const anexo =
    input.anexo && input.anexo !== 'auto'
      ? input.anexo
      : anexoPorFatorR(folha12, rbt12);

  const aliquota = aliquotaEfetiva(rbt12, anexo);
  const das = Math.round(faturamento * aliquota);

  const inssProlabore = contribuicaoProlabore(prolabore);
  const irrfProlabore =
    prolabore > 0
      ? calcularIrrf({
          rendimentoCents: prolabore,
          inssCents: inssProlabore,
          dependentes,
        }).impostoCents
      : 0;

  const liquido = faturamento - das - inssProlabore - irrfProlabore - despesas;

  return {
    faturamentoMensalCents: faturamento,
    prolaboreCents: prolabore,
    rbt12Cents: rbt12,
    folha12Cents: folha12,
    fatorR: fator,
    anexo,
    aliquotaEfetiva: aliquota,
    dasCents: das,
    inssProlaboreCents: inssProlabore,
    irrfProlaboreCents: irrfProlabore,
    despesasMensaisCents: despesas,
    liquidoMensalCents: liquido,
    liquidoAnualCents: liquido * 12,
  };
}
