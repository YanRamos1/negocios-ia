export interface Faixa {
  slug: string;
  salarioCents: number;
}

const valores = [300000, 500000, 800000, 1200000, 2000000];

export const faixas: Faixa[] = valores.map((salarioCents) => ({
  slug: `salario-${salarioCents / 100}`,
  salarioCents,
}));

const moeda = (cents: number): string =>
  (cents / 100).toLocaleString('pt-BR', { maximumFractionDigits: 0 });

export const rotuloFaixa = (salarioCents: number): string => `R$ ${moeda(salarioCents)}`;
