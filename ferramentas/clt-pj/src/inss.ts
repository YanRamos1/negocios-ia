import params from './params-2026.json';
import { clamp } from './money';

export type FaixaProgressiva = { ateCents: number; aliquota: number; deduzirCents: number };

export interface InssParams {
  tetoCents: number;
  contribuicaoMaximaCents: number;
  faixas: FaixaProgressiva[];
}

/**
 * Contribuição do empregado (CLT), pela tabela com parcela a deduzir.
 * A Receita publica os valores truncados na casa do centavo; arredondamos o
 * resultado final, o que pode divergir em R$ 0,01 em casos de borda.
 */
export function calcularInss(salarioCents: number, inss: InssParams = params.inss): number {
  if (!Number.isFinite(salarioCents) || salarioCents <= 0) return 0;

  const base = Math.min(salarioCents, inss.tetoCents);
  const faixa =
    inss.faixas.find((f) => base <= f.ateCents) ?? inss.faixas[inss.faixas.length - 1];

  const bruto = Math.round(base * faixa.aliquota) - faixa.deduzirCents;
  return clamp(bruto, 0, inss.contribuicaoMaximaCents);
}

export function contribuicaoProlabore(
  prolaboreCents: number,
  salarioMinimoCents: number = params.salarioMinimoCents,
  inss: InssParams = params.inss,
  aliquota: number = params.encargos.inssProlabore,
): number {
  if (prolaboreCents <= 0) return 0;
  const base = Math.min(Math.max(prolaboreCents, salarioMinimoCents), inss.tetoCents);
  return Math.round(base * aliquota);
}
