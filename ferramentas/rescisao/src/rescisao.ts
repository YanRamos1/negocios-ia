import { calcularInss, calcularIrrf } from '../../clt-pj/src/index';
import {
  adicionarAnos,
  adicionarDias,
  anosCompletos,
  diasAviso,
  inicioDoAno,
  inicioPeriodoAquisitivo,
  mesesProporcionais,
  paraData,
} from './datas';
import { REGRAS, rotuloTipo, type ModoAviso, type TipoRescisao } from './tipos';

export interface RescisaoInput {
  salarioCents: number;
  /** Formato YYYY-MM-DD. */
  admissao: string;
  desligamento: string;
  tipo: TipoRescisao;
  aviso?: ModoAviso;
  fgtsCents?: number;
  feriasVencidasPeriodos?: number;
  dependentes?: number;
}

export interface Verba {
  rotulo: string;
  valorCents: number;
  tributavel: boolean;
  detalhe?: string;
}

export interface RescisaoResultado {
  tipo: TipoRescisao;
  rotuloTipo: string;
  anosCompletos: number;
  mesesFerias: number;
  mesesDecimoTerceiro: number;
  diasAviso: number;
  dataProjetada: string;
  verbas: Verba[];
  totalBrutoCents: number;
  inssCents: number;
  irrfCents: number;
  descontoAvisoCents: number;
  totalDescontosCents: number;
  liquidoCents: number;
  multaFgtsCents: number;
}

const centavosDoDia = (salarioCents: number, dias: number): number =>
  Math.round((salarioCents / 30) * dias);

export function calcularRescisao(input: RescisaoInput): RescisaoResultado {
  const salario = Math.max(0, Math.round(input.salarioCents));
  const admissao = paraData(input.admissao);
  const desligamento = paraData(input.desligamento);
  const regra = REGRAS[input.tipo];
  const dependentes = Math.max(0, Math.round(input.dependentes ?? 0));
  const fgts = Math.max(0, Math.round(input.fgtsCents ?? 0));
  const feriasVencidas = Math.max(0, Math.round(input.feriasVencidasPeriodos ?? 0));

  const anos = anosCompletos(admissao, desligamento);
  const diasDoAviso = regra.avisoProporcional ? diasAviso(anos) : 30;

  const aviso = input.aviso ?? (input.tipo === 'pedido-demissao' ? 'trabalhado' : 'indenizado');
  const projeta = regra.projetaContrato && aviso !== 'nao-cumprido';
  const dataProjetada = projeta ? adicionarDias(desligamento, diasDoAviso) : desligamento;

  const diasTrabalhadosNoMes = Math.min(30, desligamento.getUTCDate());
  const saldoSalario = centavosDoDia(salario, diasTrabalhadosNoMes);

  const mesesDecimo = regra.pagaDecimoTerceiro
    ? mesesProporcionais(
        inicioDoAno(dataProjetada) > admissao ? inicioDoAno(dataProjetada) : admissao,
        dataProjetada,
      )
    : 0;
  const decimoTerceiro = Math.round((salario * mesesDecimo) / 12);

  const mesesFerias = regra.pagaFeriasProporcionais
    ? mesesProporcionais(inicioPeriodoAquisitivo(admissao, dataProjetada), dataProjetada)
    : 0;
  const feriasProporcionais = Math.round((salario * mesesFerias) / 12);

  const feriasVencidasBase = salario * feriasVencidas;
  const tercoFerias = Math.round((feriasProporcionais + feriasVencidasBase) / 3);

  let avisoCents = 0;
  if (input.tipo !== 'justa-causa' && aviso !== 'nao-cumprido') {
    const bruto = centavosDoDia(salario, diasDoAviso);
    avisoCents = regra.metadeAviso ? Math.round(bruto / 2) : bruto;
  }

  const descontoAviso =
    aviso === 'nao-cumprido' && input.tipo === 'pedido-demissao' ? salario : 0;

  const multaFgts = Math.round(fgts * regra.multaFgts);

  const verbas: Verba[] = [];
  verbas.push({
    rotulo: 'Saldo de salário',
    valorCents: saldoSalario,
    tributavel: true,
    detalhe: `${diasTrabalhadosNoMes} dias`,
  });

  if (avisoCents > 0) {
    verbas.push({
      rotulo: 'Aviso prévio',
      valorCents: avisoCents,
      tributavel: aviso === 'trabalhado',
      detalhe: `${diasDoAviso} dias${regra.metadeAviso ? ' (metade)' : ''}`,
    });
  }

  if (decimoTerceiro > 0) {
    verbas.push({
      rotulo: '13º proporcional',
      valorCents: decimoTerceiro,
      tributavel: true,
      detalhe: `${mesesDecimo}/12`,
    });
  }

  if (feriasProporcionais > 0) {
    verbas.push({
      rotulo: 'Férias proporcionais',
      valorCents: feriasProporcionais,
      tributavel: false,
      detalhe: `${mesesFerias}/12`,
    });
  }

  if (feriasVencidas > 0) {
    verbas.push({
      rotulo: 'Férias vencidas',
      valorCents: feriasVencidasBase,
      tributavel: false,
      detalhe: `${feriasVencidas} período(s)`,
    });
  }

  if (tercoFerias > 0) {
    verbas.push({
      rotulo: 'Terço constitucional de férias',
      valorCents: tercoFerias,
      tributavel: false,
    });
  }

  if (multaFgts > 0) {
    verbas.push({
      rotulo: `Multa do FGTS (${Math.round(regra.multaFgts * 100)}%)`,
      valorCents: multaFgts,
      tributavel: false,
    });
  }

  const totalBruto = verbas.reduce((soma, verba) => soma + verba.valorCents, 0);

  const inssSaldo = calcularInss(saldoSalario);
  const irrfSaldo = calcularIrrf({
    rendimentoCents: saldoSalario,
    inssCents: inssSaldo,
    dependentes,
  }).impostoCents;

  const inssDecimo = calcularInss(decimoTerceiro);
  const irrfDecimo = calcularIrrf({
    rendimentoCents: decimoTerceiro,
    inssCents: inssDecimo,
    dependentes,
  }).impostoCents;

  const inssAviso = aviso === 'trabalhado' ? calcularInss(avisoCents) : 0;
  const irrfAviso =
    aviso === 'trabalhado'
      ? calcularIrrf({ rendimentoCents: avisoCents, inssCents: inssAviso, dependentes }).impostoCents
      : 0;

  const inss = inssSaldo + inssDecimo + inssAviso;
  const irrf = irrfSaldo + irrfDecimo + irrfAviso;
  const totalDescontos = inss + irrf + descontoAviso;

  return {
    tipo: input.tipo,
    rotuloTipo: rotuloTipo(input.tipo),
    anosCompletos: anos,
    mesesFerias,
    mesesDecimoTerceiro: mesesDecimo,
    diasAviso: input.tipo === 'justa-causa' ? 0 : diasDoAviso,
    dataProjetada: dataProjetada.toISOString().slice(0, 10),
    verbas,
    totalBrutoCents: totalBruto,
    inssCents: inss,
    irrfCents: irrf,
    descontoAvisoCents: descontoAviso,
    totalDescontosCents: totalDescontos,
    liquidoCents: totalBruto - totalDescontos,
    multaFgtsCents: multaFgts,
  };
}
