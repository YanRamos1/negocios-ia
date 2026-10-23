import { describe, expect, it } from 'vitest';
import { calcularIrrf } from './irrf';
import { calcularInss } from './inss';

const inssDe = (rendimento: number) => calcularInss(rendimento);

describe('IRRF 2026 com o redutor da Lei 15.270/2025', () => {
  it('zera o imposto até R$ 5.000 de rendimento', () => {
    const resultado = calcularIrrf({ rendimentoCents: 500000, inssCents: 50151 });
    expect(resultado.impostoTabelaCents).toBeGreaterThan(0);
    expect(resultado.impostoCents).toBe(0);
  });

  it('reduz parcialmente entre R$ 5.000 e R$ 7.350', () => {
    expect(calcularIrrf({ rendimentoCents: 550000, inssCents: inssDe(550000) }).impostoCents).toBe(19047);
    expect(calcularIrrf({ rendimentoCents: 600000, inssCents: inssDe(600000) }).impostoCents).toBe(38510);
    expect(calcularIrrf({ rendimentoCents: 650000, inssCents: inssDe(650000) }).impostoCents).toBe(56992);
  });

  it('não reduz acima de R$ 7.350', () => {
    expect(calcularIrrf({ rendimentoCents: 735000, inssCents: inssDe(735000) }).impostoCents).toBe(88413);
    expect(calcularIrrf({ rendimentoCents: 800000, inssCents: inssDe(800000) }).impostoCents).toBe(103785);
  });

  it('escolhe a menor base entre dedução legal e simplificada', () => {
    const comInss = calcularIrrf({ rendimentoCents: 600000, inssCents: inssDe(600000) });
    expect(comInss.baseEscolhidaCents).toBe(comInss.baseLegalCents);

    const semInss = calcularIrrf({ rendimentoCents: 600000, inssCents: 0 });
    expect(semInss.baseEscolhidaCents).toBe(semInss.baseSimplificadaCents);
  });

  it('deduz dependente da base legal', () => {
    const semDependente = calcularIrrf({ rendimentoCents: 800000, inssCents: inssDe(800000) });
    const comDependente = calcularIrrf({
      rendimentoCents: 800000,
      inssCents: inssDe(800000),
      dependentes: 2,
    });
    expect(comDependente.baseLegalCents).toBe(semDependente.baseLegalCents - 2 * 18959);
    expect(comDependente.impostoCents).toBeLessThan(semDependente.impostoCents);
  });
});
