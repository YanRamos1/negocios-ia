export interface FaixaImportacao {
  slug: string;
  usdCents: number;
}

const valores = [3000, 5000, 10000, 20000, 50000, 100000];

export const faixasImportacao: FaixaImportacao[] = valores.map((usdCents) => ({
  slug: `dolares-${usdCents / 100}`,
  usdCents,
}));

export const rotuloFaixaImportacao = (usdCents: number): string =>
  `US$ ${(usdCents / 100).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`;

/** Cotação de referência usada nas páginas estáticas. */
export const COTACAO_REFERENCIA_CENTS = 500;
