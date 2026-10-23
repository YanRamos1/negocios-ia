import { describe, expect, it } from 'vitest';
import { calcularCenario } from './calc';

const base = {
  precoCents: 10000,
  custoCents: 4000,
  freteCents: 1000,
  impostoPercentual: 0.04,
  margemAlvo: 0.2,
  canais: [
    { nome: 'Balcão', comissao: 0, taxaFixaCents: 0 },
    { nome: 'Cartão', comissao: 0.05, taxaFixaCents: 0 },
    { nome: 'Marketplace', comissao: 0.14, taxaFixaCents: 400 },
  ],
};

describe('sobra por canal', () => {
  it('calcula comissão, imposto e sobra no balcão', () => {
    const r = calcularCenario(base);
    const balcao = r.canais[0];
    expect(balcao.comissaoCents).toBe(0);
    expect(balcao.impostoCents).toBe(400);
    expect(balcao.custoTotalCents).toBe(4000 + 1000 + 400);
    expect(balcao.sobraCents).toBe(10000 - 5400);
    expect(balcao.margem).toBeCloseTo(0.46, 3);
  });

  it('desconta comissão e taxa fixa do marketplace', () => {
    const r = calcularCenario(base);
    const mp = r.canais[2];
    expect(mp.comissaoCents).toBe(1400);
    expect(mp.custoTotalCents).toBe(4000 + 1000 + 1400 + 400 + 400);
    expect(mp.sobraCents).toBe(2800);
    expect(mp.margem).toBeCloseTo(0.28, 3);
  });

  it('aponta o canal com maior sobra', () => {
    expect(calcularCenario(base).melhor).toBe('Balcão');
  });
});

describe('preço mínimo para a margem alvo', () => {
  it('resolve o preço considerando comissão e imposto', () => {
    const r = calcularCenario(base);
    const mp = r.canais[2];
    // (custo + frete + taxa fixa) / (1 - comissão - imposto - margem)
    expect(mp.precoMinimoCents).toBe(Math.ceil(5400 / (1 - 0.14 - 0.04 - 0.2)));
  });

  it('marca como inviável quando o preço fica abaixo do mínimo', () => {
    const r = calcularCenario({ ...base, precoCents: 5000 });
    expect(r.canais[2].viavel).toBe(false);
  });

  it('não escolhe melhor canal quando nenhum é viável', () => {
    const r = calcularCenario({ ...base, precoCents: 1000 });
    expect(r.melhor).toBeNull();
  });

  it('zera o preço mínimo quando comissão, imposto e margem passam de 100%', () => {
    const r = calcularCenario({
      precoCents: 10000,
      custoCents: 4000,
      margemAlvo: 0.8,
      impostoPercentual: 0.1,
      canais: [{ nome: 'Caro', comissao: 0.2, taxaFixaCents: 0 }],
    });
    expect(r.canais[0].precoMinimoCents).toBe(0);
  });
});
