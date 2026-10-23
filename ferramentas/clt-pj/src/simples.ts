import params from './params-2026.json';

export type Anexo = 'III' | 'V';

export interface SimplesParams {
  fatorRLimite: number;
  anexoIII: { ateCents: number; aliquota: number; deduzirCents: number }[];
  anexoV: { ateCents: number; aliquota: number; deduzirCents: number }[];
}

export function fatorR(folha12MesesCents: number, receitaBruta12MesesCents: number): number {
  if (receitaBruta12MesesCents <= 0) return 0;
  return folha12MesesCents / receitaBruta12MesesCents;
}

export function anexoPorFatorR(
  folha12MesesCents: number,
  receitaBruta12MesesCents: number,
  simples: SimplesParams = params.simples,
): Anexo {
  return fatorR(folha12MesesCents, receitaBruta12MesesCents) >= simples.fatorRLimite ? 'III' : 'V';
}

export function aliquotaEfetiva(
  receitaBruta12MesesCents: number,
  anexo: Anexo,
  simples: SimplesParams = params.simples,
): number {
  if (receitaBruta12MesesCents <= 0) return 0;
  const tabela = anexo === 'III' ? simples.anexoIII : simples.anexoV;
  const faixa = tabela.find((f) => receitaBruta12MesesCents <= f.ateCents) ?? tabela[tabela.length - 1];
  const valor = (receitaBruta12MesesCents * faixa.aliquota - faixa.deduzirCents) / receitaBruta12MesesCents;
  return Math.max(0, valor);
}

export function dasDoMes(
  faturamentoMensalCents: number,
  receitaBruta12MesesCents: number,
  anexo: Anexo,
  simples: SimplesParams = params.simples,
): { aliquota: number; dasCents: number } {
  const aliquota = aliquotaEfetiva(receitaBruta12MesesCents, anexo, simples);
  return { aliquota, dasCents: Math.round(faturamentoMensalCents * aliquota) };
}
