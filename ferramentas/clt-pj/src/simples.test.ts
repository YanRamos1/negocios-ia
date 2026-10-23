import { describe, expect, it } from 'vitest';
import { aliquotaEfetiva, anexoPorFatorR, fatorR } from './simples';

describe('Simples Nacional — alíquota efetiva', () => {
  it('usa 6% na primeira faixa do Anexo III', () => {
    expect(aliquotaEfetiva(12_000_000, 'III')).toBeCloseTo(0.06, 6);
  });

  it('calcula a alíquota efetiva da segunda faixa do Anexo III', () => {
    expect(aliquotaEfetiva(24_000_000, 'III')).toBeCloseTo(0.073, 6);
  });

  it('calcula a alíquota efetiva da segunda faixa do Anexo V', () => {
    expect(aliquotaEfetiva(24_000_000, 'V')).toBeCloseTo(0.16125, 6);
  });
});

describe('Fator R', () => {
  it('28% exatos enquadram no Anexo III', () => {
    expect(fatorR(3_360_000, 12_000_000)).toBeCloseTo(0.28, 6);
    expect(anexoPorFatorR(3_360_000, 12_000_000)).toBe('III');
  });

  it('abaixo de 28% cai no Anexo V', () => {
    expect(anexoPorFatorR(3_359_000, 12_000_000)).toBe('V');
  });

  it('receita zero não gera divisão por zero', () => {
    expect(fatorR(1_000, 0)).toBe(0);
  });
});
