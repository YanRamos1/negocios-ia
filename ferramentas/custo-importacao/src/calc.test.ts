import { describe, expect, it } from 'vitest';
import { aliquotaIcmsDaUf, calcularImportacao, converterParaReais } from './calc';

const cotacao500 = 500; // R$ 5,00

// Conversões dos exemplos oficiais da Receita Federal.
const usdDe = (reais: number): number => Math.round(reais / 5) * 100;

describe('conversão e ICMS por UF', () => {
  it('converte dólar para real mantendo centavos', () => {
    expect(converterParaReais(2000, cotacao500)).toBe(10000);
    expect(converterParaReais(6600, cotacao500)).toBe(33000);
  });

  it('usa a alíquota do Convênio 81/2023', () => {
    expect(aliquotaIcmsDaUf('SP')).toBe(0.17);
    expect(aliquotaIcmsDaUf('ba')).toBe(0.2);
    expect(aliquotaIcmsDaUf('PA')).toBe(0.19);
  });

  it('cai em SP quando a UF é desconhecida', () => {
    expect(aliquotaIcmsDaUf('XX')).toBe(0.17);
  });
});

describe('Regra de 12/05/2026 — Remessa Conforme', () => {
  it('exemplo 1.1: R$ 100 no PRC, UF 17%, sem imposto de importação', () => {
    const r = calcularImportacao({
      produtoUsdCents: usdDe(100),
      cotacaoCents: cotacao500,
      uf: 'SP',
      remessaConforme: true,
    });
    expect(r.faixa).toBe('isento');
    expect(r.iiCents).toBe(0);
    expect(r.icmsCents).toBe(2048);
    expect(r.totalImpostosCents).toBe(2048);
  });

  it('exemplo 1.2: R$ 330 no PRC, UF 17%, II de R$ 48 e ICMS de R$ 77,42', () => {
    const r = calcularImportacao({
      produtoUsdCents: usdDe(330),
      cotacaoCents: cotacao500,
      uf: 'SP',
      remessaConforme: true,
    });
    expect(r.iiCents).toBe(4800);
    expect(r.icmsCents).toBe(7742);
    expect(r.totalImpostosCents).toBe(12542);
  });

  it('trata o limite de US$ 50 como isento e o centavo seguinte como tributado', () => {
    const limite = calcularImportacao({
      produtoUsdCents: 5000,
      cotacaoCents: cotacao500,
      uf: 'SP',
      remessaConforme: true,
    });
    const acima = calcularImportacao({
      produtoUsdCents: 5001,
      cotacaoCents: cotacao500,
      uf: 'SP',
      remessaConforme: true,
    });
    expect(limite.iiCents).toBe(0);
    expect(acima.iiCents).toBeGreaterThan(0);
    expect(acima.faixa).toBe('sessenta');
  });

  it('aplica a alíquota de 20% em estado com ICMS maior', () => {
    const r = calcularImportacao({
      produtoUsdCents: usdDe(330),
      cotacaoCents: cotacao500,
      uf: 'BA',
      remessaConforme: true,
    });
    expect(r.aliquotaIcms).toBe(0.2);
    expect(r.icmsCents).toBe(9450);
  });
});

describe('Regra de 12/05/2026 — fora do Remessa Conforme', () => {
  it('exemplo 2.1: R$ 100 sem PRC, UF 17%', () => {
    const r = calcularImportacao({
      produtoUsdCents: usdDe(100),
      cotacaoCents: cotacao500,
      uf: 'SP',
      remessaConforme: false,
    });
    expect(r.iiCents).toBe(6000);
    expect(r.icmsCents).toBe(3277);
    expect(r.totalImpostosCents).toBe(9277);
  });

  it('exemplo 2.2: R$ 330 sem PRC, UF 17%', () => {
    const r = calcularImportacao({
      produtoUsdCents: usdDe(330),
      cotacaoCents: cotacao500,
      uf: 'SP',
      remessaConforme: false,
    });
    expect(r.iiCents).toBe(19800);
    expect(r.icmsCents).toBe(10814);
    expect(r.totalImpostosCents).toBe(30614);
  });

  it('não dá desconto de US$ 30 fora do programa', () => {
    const r = calcularImportacao({
      produtoUsdCents: usdDe(330),
      cotacaoCents: cotacao500,
      uf: 'SP',
      remessaConforme: false,
    });
    expect(r.descontoUsdCents).toBe(0);
  });
});

describe('limites e composição', () => {
  it('sinaliza compra acima de US$ 3.000', () => {
    const r = calcularImportacao({
      produtoUsdCents: 400000,
      cotacaoCents: cotacao500,
      uf: 'SP',
      remessaConforme: true,
    });
    expect(r.acimaDoLimite).toBe(true);
    expect(r.faixa).toBe('fora-do-regime');
  });

  it('soma frete e seguro no valor aduaneiro', () => {
    const r = calcularImportacao({
      produtoUsdCents: 4000,
      freteUsdCents: 800,
      seguroUsdCents: 200,
      cotacaoCents: cotacao500,
      uf: 'SP',
      remessaConforme: true,
    });
    expect(r.valorAduaneiroUsdCents).toBe(5000);
    expect(r.valorAduaneiroCents).toBe(25000);
    expect(r.faixa).toBe('isento');
  });

  it('inclui IOF e outras taxas no total', () => {
    const r = calcularImportacao({
      produtoUsdCents: usdDe(100),
      cotacaoCents: cotacao500,
      uf: 'SP',
      remessaConforme: true,
      iofPercentual: 0.035,
      outrasTaxasCents: 1500,
    });
    expect(r.iofCents).toBe(350);
    expect(r.outrasTaxasCents).toBe(1500);
    expect(r.totalImpostosCents).toBe(2048 + 350 + 1500);
  });

  it('custo final é valor aduaneiro mais impostos', () => {
    const r = calcularImportacao({
      produtoUsdCents: usdDe(330),
      cotacaoCents: cotacao500,
      uf: 'SP',
      remessaConforme: true,
    });
    expect(r.custoFinalCents).toBe(r.valorAduaneiroCents + r.totalImpostosCents);
  });
});
