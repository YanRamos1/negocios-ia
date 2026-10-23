import { describe, expect, it } from 'vitest';
import { calcularRescisao } from './rescisao';
import { anosCompletos, diasAviso, mesesProporcionais, paraData } from './datas';

const base = {
  salarioCents: 300000,
  admissao: '2023-01-10',
  desligamento: '2026-06-20',
  fgtsCents: 1200000,
} as const;

describe('regras de data', () => {
  it('conta anos completos', () => {
    expect(anosCompletos(paraData('2023-01-10'), paraData('2026-06-20'))).toBe(3);
    expect(anosCompletos(paraData('2023-01-10'), paraData('2026-01-09'))).toBe(2);
  });

  it('aplica 30 dias + 3 por ano, com teto de 90', () => {
    expect(diasAviso(0)).toBe(30);
    expect(diasAviso(3)).toBe(39);
    expect(diasAviso(25)).toBe(90);
  });

  it('só conta mês com 15 dias ou mais', () => {
    expect(mesesProporcionais(paraData('2026-01-01'), paraData('2026-01-14'))).toBe(0);
    expect(mesesProporcionais(paraData('2026-01-01'), paraData('2026-01-15'))).toBe(1);
  });
});

describe('dispensa sem justa causa com aviso indenizado', () => {
  const r = calcularRescisao({ ...base, tipo: 'sem-justa-causa' });

  it('calcula aviso proporcional de 39 dias', () => {
    expect(r.anosCompletos).toBe(3);
    expect(r.diasAviso).toBe(39);
    expect(r.dataProjetada).toBe('2026-07-29');
  });

  it('soma saldo, aviso, 13º, férias e multa', () => {
    const valor = (rotulo: string) =>
      r.verbas.find((verba) => verba.rotulo.startsWith(rotulo))?.valorCents;
    expect(valor('Saldo de salário')).toBe(200000);
    expect(valor('Aviso prévio')).toBe(390000);
    expect(valor('13º proporcional')).toBe(175000);
    expect(valor('Férias proporcionais')).toBe(175000);
    expect(valor('Terço')).toBe(58333);
    expect(valor('Multa do FGTS')).toBe(480000);
    expect(r.totalBrutoCents).toBe(1478333);
  });

  it('desconta INSS do saldo e do 13º, sem tocar nas verbas indenizatórias', () => {
    expect(r.inssCents).toBe(15568 + 13318);
    expect(r.irrfCents).toBe(0);
    expect(r.liquidoCents).toBe(1449447);
  });
});

describe('tipos de desligamento', () => {
  it('justa causa paga só saldo e férias vencidas', () => {
    const r = calcularRescisao({ ...base, tipo: 'justa-causa' });
    expect(r.totalBrutoCents).toBe(200000);
    expect(r.multaFgtsCents).toBe(0);
    expect(r.mesesFerias).toBe(0);
    expect(r.mesesDecimoTerceiro).toBe(0);
    expect(r.liquidoCents).toBe(184432);
  });

  it('pedido de demissão sem cumprir aviso desconta um salário', () => {
    const r = calcularRescisao({ ...base, tipo: 'pedido-demissao', aviso: 'nao-cumprido' });
    expect(r.descontoAvisoCents).toBe(300000);
    expect(r.mesesDecimoTerceiro).toBe(6);
    expect(r.mesesFerias).toBe(6);
    expect(r.totalBrutoCents).toBe(550000);
    expect(r.liquidoCents).toBe(550000 - (15568 + 11250 + 300000));
  });

  it('acordo paga metade do aviso e multa de 20%', () => {
    const r = calcularRescisao({ ...base, tipo: 'acordo' });
    const aviso = r.verbas.find((verba) => verba.rotulo === 'Aviso prévio');
    expect(aviso?.valorCents).toBe(195000);
    expect(r.multaFgtsCents).toBe(240000);
    expect(r.totalBrutoCents).toBe(1043333);
    expect(r.liquidoCents).toBe(1014447);
  });
});

describe('tributação do aviso', () => {
  it('aviso trabalhado entra na base do INSS', () => {
    const indenizado = calcularRescisao({ ...base, tipo: 'sem-justa-causa', aviso: 'indenizado' });
    const trabalhado = calcularRescisao({ ...base, tipo: 'sem-justa-causa', aviso: 'trabalhado' });
    expect(trabalhado.inssCents).toBeGreaterThan(indenizado.inssCents);
    expect(trabalhado.totalBrutoCents).toBe(indenizado.totalBrutoCents);
  });
});

describe('férias vencidas', () => {
  it('paga período completo mais o terço', () => {
    const r = calcularRescisao({ ...base, tipo: 'justa-causa', feriasVencidasPeriodos: 1 });
    expect(r.totalBrutoCents).toBe(200000 + 300000 + 100000);
  });
});
