export const reaisToCents = (reais: number): number => Math.round(reais * 100);

export const centsToReais = (cents: number): number => cents / 100;

export const formatBRL = (cents: number): string =>
  (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const formatPercent = (ratio: number, digits = 2): string =>
  `${(ratio * 100).toLocaleString('pt-BR', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}%`;

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);
