import params from './params-2026.json';
import { calcularInss } from './inss';
import { calcularIrrf } from './irrf';

export interface CltInput {
  salarioBrutoCents: number;
  dependentes?: number;
  beneficiosCents?: number;
  encargosPatronais?: number;
}

export interface CltResultado {
  salarioBrutoCents: number;
  inssCents: number;
  irrfCents: number;
  beneficiosCents: number;
  liquidoMensalCents: number;
  decimoTerceiroLiquidoCents: number;
  feriasTercoLiquidoCents: number;
  liquidoAnualCents: number;
  custoEmpregadorMensalCents: number;
  fgtsCents: number;
  provisaoDecimoTerceiroCents: number;
  provisaoFeriasCents: number;
  patronalCents: number;
}

export function calcularClt(input: CltInput): CltResultado {
  const bruto = Math.max(0, Math.round(input.salarioBrutoCents));
  const dependentes = input.dependentes ?? 0;
  const beneficios = Math.max(0, Math.round(input.beneficiosCents ?? 0));
  const taxaPatronal = input.encargosPatronais ?? params.encargos.patronalPadrao;

  const inss = calcularInss(bruto);
  const irrf = calcularIrrf({ rendimentoCents: bruto, inssCents: inss, dependentes }).impostoCents;
  const liquidoMensal = bruto - inss - irrf + beneficios;

  const inssDecimo = calcularInss(bruto);
  const irrfDecimo = calcularIrrf({
    rendimentoCents: bruto,
    inssCents: inssDecimo,
    dependentes,
  }).impostoCents;
  const decimoTerceiroLiquido = bruto - inssDecimo - irrfDecimo;

  const aliquotaEfetiva =
    bruto > 0 ? (liquidoMensal - beneficios) / bruto : 0;
  const feriasTercoLiquido = Math.round((bruto / 3) * aliquotaEfetiva);

  const provisaoDecimoTerceiro = Math.round(bruto / 12);
  const provisaoFerias = Math.round((bruto * (4 / 3)) / 12);
  const fgts = Math.round(
    params.encargos.fgts * (bruto + provisaoDecimoTerceiro + provisaoFerias),
  );
  const patronal = Math.round(bruto * taxaPatronal);

  return {
    salarioBrutoCents: bruto,
    inssCents: inss,
    irrfCents: irrf,
    beneficiosCents: beneficios,
    liquidoMensalCents: liquidoMensal,
    decimoTerceiroLiquidoCents: decimoTerceiroLiquido,
    feriasTercoLiquidoCents: feriasTercoLiquido,
    liquidoAnualCents: liquidoMensal * 12 + decimoTerceiroLiquido + feriasTercoLiquido,
    custoEmpregadorMensalCents: bruto + provisaoDecimoTerceiro + provisaoFerias + fgts + patronal,
    fgtsCents: fgts,
    provisaoDecimoTerceiroCents: provisaoDecimoTerceiro,
    provisaoFeriasCents: provisaoFerias,
    patronalCents: patronal,
  };
}
