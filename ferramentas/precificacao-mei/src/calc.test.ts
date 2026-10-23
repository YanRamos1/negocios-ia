import { describe, expect, it } from 'vitest';
import { calcularPreco } from './calc';

const base = {
  materialCents: 2000,
  horasPorPeca: 1.5,
  valorHoraCents: 3000,
  embalagemCents: 500,
  custosFixosCents: 50000,
  dasCents: 8200,
  pecasMes: 50,
  taxaVenda: 0.1,
  margemDesejada: 0.3,
} as const;

describe('precificação', () => {
  it('soma material, mão de obra, embalagem e rateio fixo', () => {
    const r = calcularPreco(base);
    expect(r.custoMaterialCents).toBe(2000);
    expect(r.custoMaoObraCents).toBe(4500);
    expect(r.custoEmbalagemCents).toBe(500);
    expect(r.custoFixoRateadoCents).toBe(1164);
    expect(r.custoTotalCents).toBe(8164);
  });

  it('chega ao preço que entrega a margem desejada depois da taxa', () => {
    const r = calcularPreco(base);
    expect(r.precoSugeridoCents).toBe(13607);
    expect(r.taxaVendaCents).toBe(1361);
    expect(r.lucroCents).toBe(4082);
    expect(r.margemEfetiva).toBeCloseTo(0.3, 3);
  });

  it('calcula markup sobre o custo', () => {
    const r = calcularPreco(base);
    expect(r.markup).toBeCloseTo(13607 / 8164, 3);
  });

  it('calcula quantas peças cobrem o custo fixo', () => {
    const r = calcularPreco(base);
    expect(r.pontoEquilibrioPecas).toBe(12);
  });

  it('não divide por zero quando margem e taxa somam 100%', () => {
    const r = calcularPreco({ ...base, margemDesejada: 0.7, taxaVenda: 0.3 });
    expect(r.precoSugeridoCents).toBe(0);
    expect(r.margemEfetiva).toBe(0);
  });

  it('trata produção mensal zero como uma peça', () => {
    const r = calcularPreco({ ...base, pecasMes: 0 });
    expect(r.custoFixoRateadoCents).toBe(58200);
  });

  it('sem custo fixo o ponto de equilíbrio é zero', () => {
    const r = calcularPreco({ ...base, custosFixosCents: 0, dasCents: 0 });
    expect(r.pontoEquilibrioPecas).toBe(0);
  });

  it('preço maior gera lucro maior', () => {
    const magro = calcularPreco({ ...base, margemDesejada: 0.1 });
    const gordo = calcularPreco({ ...base, margemDesejada: 0.4 });
    expect(gordo.lucroCents).toBeGreaterThan(magro.lucroCents);
  });
});
