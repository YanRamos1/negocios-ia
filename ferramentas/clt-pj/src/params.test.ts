import { describe, expect, it } from 'vitest';
import params from './params-2026.json';

const crescente = (valores: number[]) =>
  valores.every((valor, i) => i === 0 || valor > valores[i - 1]);

describe('integridade dos parâmetros', () => {
  it('declara vigência 2026', () => {
    expect(params.vigencia).toBe('2026-01');
  });

  it('mantém as faixas do INSS em ordem e fechando no teto', () => {
    const limites = params.inss.faixas.map((f) => f.ateCents);
    expect(crescente(limites)).toBe(true);
    expect(limites[limites.length - 1]).toBe(params.inss.tetoCents);
  });

  it('mantém as faixas de IRRF e Simples em ordem crescente', () => {
    expect(crescente(params.irrf.faixas.map((f) => f.ateCents))).toBe(true);
    expect(crescente(params.simples.anexoIII.map((f) => f.ateCents))).toBe(true);
    expect(crescente(params.simples.anexoV.map((f) => f.ateCents))).toBe(true);
  });

  it('mantém alíquotas dentro de 0 e 1', () => {
    const aliquotas = [
      ...params.inss.faixas,
      ...params.irrf.faixas,
      ...params.simples.anexoIII,
      ...params.simples.anexoV,
    ].map((f) => f.aliquota);
    expect(aliquotas.every((a) => a >= 0 && a < 1)).toBe(true);
  });
});
