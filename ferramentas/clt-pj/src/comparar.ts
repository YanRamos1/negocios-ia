import { calcularClt, type CltInput, type CltResultado } from './clt';
import { calcularPj, type PjInput, type PjResultado } from './pj';

export type Veredito = 'CLT' | 'PJ' | 'empate';

export interface ComparacaoResultado {
  clt: CltResultado;
  pj: PjResultado;
  diferencaMensalCents: number;
  diferencaAnualCents: number;
  veredito: Veredito;
  faturamentoEquivalenteCents: number | null;
}

export function comparar(cltInput: CltInput, pjInput: PjInput): ComparacaoResultado {
  const clt = calcularClt(cltInput);
  const pj = calcularPj(pjInput);

  const diferencaMensal = pj.liquidoMensalCents - clt.liquidoMensalCents;
  const veredito: Veredito =
    diferencaMensal > 50 ? 'PJ' : diferencaMensal < -50 ? 'CLT' : 'empate';

  return {
    clt,
    pj,
    diferencaMensalCents: diferencaMensal,
    diferencaAnualCents: diferencaMensal * 12,
    veredito,
    faturamentoEquivalenteCents: faturamentoEquivalente(clt.liquidoMensalCents, pjInput),
  };
}

/**
 * Faturamento PJ que entrega o mesmo líquido mensal do CLT.
 * Busca binária porque o líquido é monótono no faturamento.
 */
export function faturamentoEquivalente(
  liquidoAlvoCents: number,
  pjInput: PjInput,
): number | null {
  const liquidoEm = (faturamentoCents: number): number =>
    calcularPj({ ...pjInput, faturamentoMensalCents: faturamentoCents }).liquidoMensalCents;

  const tetoBusca = 100_000_000;
  if (liquidoEm(tetoBusca) < liquidoAlvoCents) return null;

  let baixo = 0;
  let alto = tetoBusca;
  for (let i = 0; i < 60; i += 1) {
    const meio = Math.floor((baixo + alto) / 2);
    if (liquidoEm(meio) < liquidoAlvoCents) baixo = meio;
    else alto = meio;
  }
  return alto;
}
