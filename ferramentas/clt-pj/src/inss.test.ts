import { describe, expect, it } from 'vitest';
import { calcularInss, contribuicaoProlabore } from './inss';

describe('INSS empregado 2026', () => {
  it('aplica 7,5% no salário mínimo', () => {
    // A tabela oficial publica R$ 121,57 por truncar a casa do centavo;
    // arredondamos, então o resultado é R$ 121,58.
    expect(calcularInss(162100)).toBe(12158);
  });

  it('aplica a parcela a deduzir da 3ª faixa', () => {
    expect(calcularInss(300000)).toBe(24860);
  });

  it('respeita o teto de contribuição', () => {
    expect(calcularInss(847555)).toBe(98809);
    expect(calcularInss(900000)).toBe(98809);
  });

  it('não cobra de quem não tem renda', () => {
    expect(calcularInss(0)).toBe(0);
  });
});

describe('INSS do pró-labore', () => {
  it('usa 11% sobre o pró-labore', () => {
    expect(contribuicaoProlabore(200000)).toBe(22000);
  });

  it('usa o salário mínimo como base quando o pró-labore é menor', () => {
    expect(contribuicaoProlabore(50000)).toBe(Math.round(162100 * 0.11));
  });

  it('limita ao teto', () => {
    expect(contribuicaoProlabore(2000000)).toBe(Math.round(847555 * 0.11));
  });
});
