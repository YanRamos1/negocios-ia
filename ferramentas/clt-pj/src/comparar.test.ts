import { describe, expect, it } from 'vitest';
import { comparar, faturamentoEquivalente } from './comparar';

describe('comparação CLT x PJ', () => {
  const clt = { salarioBrutoCents: 500000 };
  const pj = {
    faturamentoMensalCents: 650000,
    prolaborePercentualFaturamento: 0.28,
    despesasMensaisCents: 30000,
  };

  it('enquadra no Anexo III quando o pró-labore é 28% do faturamento', () => {
    const resultado = comparar(clt, pj);
    expect(resultado.pj.anexo).toBe('III');
    expect(resultado.pj.aliquotaEfetiva).toBeCloseTo(0.06, 6);
  });

  it('desconta DAS, INSS do pró-labore e despesas', () => {
    const resultado = comparar(clt, pj);
    const esperado =
      pj.faturamentoMensalCents -
      resultado.pj.dasCents -
      resultado.pj.inssProlaboreCents -
      resultado.pj.irrfProlaboreCents -
      pj.despesasMensaisCents;
    expect(resultado.pj.liquidoMensalCents).toBe(esperado);
  });

  it('aponta PJ como melhor no cenário base', () => {
    expect(comparar(clt, pj).veredito).toBe('PJ');
  });

  it('calcula o faturamento que empata com o líquido CLT', () => {
    const alvo = comparar(clt, pj).clt.liquidoMensalCents;
    const equivalente = faturamentoEquivalente(alvo, {
      faturamentoMensalCents: 0,
      prolaboreCents: 162100,
      despesasMensaisCents: 30000,
    });
    expect(equivalente).not.toBeNull();
    expect(equivalente!).toBeGreaterThan(0);
  });

  it('mantém CLT melhor quando o faturamento PJ é baixo', () => {
    const resultado = comparar(clt, { faturamentoMensalCents: 450000, prolaboreCents: 162100 });
    expect(resultado.veredito).toBe('CLT');
  });
});
