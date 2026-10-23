export type TipoRescisao = 'sem-justa-causa' | 'pedido-demissao' | 'justa-causa' | 'acordo';
export type ModoAviso = 'indenizado' | 'trabalhado' | 'nao-cumprido';

export interface RegraTipo {
  rotulo: string;
  multaFgts: number;
  pagaDecimoTerceiro: boolean;
  pagaFeriasProporcionais: boolean;
  avisoProporcional: boolean;
  metadeAviso: boolean;
  projetaContrato: boolean;
}

export const REGRAS: Record<TipoRescisao, RegraTipo> = {
  'sem-justa-causa': {
    rotulo: 'Dispensa sem justa causa',
    multaFgts: 0.4,
    pagaDecimoTerceiro: true,
    pagaFeriasProporcionais: true,
    avisoProporcional: true,
    metadeAviso: false,
    projetaContrato: true,
  },
  'pedido-demissao': {
    rotulo: 'Pedido de demissão',
    multaFgts: 0,
    pagaDecimoTerceiro: true,
    pagaFeriasProporcionais: true,
    avisoProporcional: false,
    metadeAviso: false,
    projetaContrato: false,
  },
  'justa-causa': {
    rotulo: 'Dispensa por justa causa',
    multaFgts: 0,
    pagaDecimoTerceiro: false,
    pagaFeriasProporcionais: false,
    avisoProporcional: false,
    metadeAviso: false,
    projetaContrato: false,
  },
  acordo: {
    rotulo: 'Acordo entre as partes (art. 484-A)',
    multaFgts: 0.2,
    pagaDecimoTerceiro: true,
    pagaFeriasProporcionais: true,
    avisoProporcional: true,
    metadeAviso: true,
    projetaContrato: true,
  },
};

export const rotuloTipo = (tipo: TipoRescisao): string => REGRAS[tipo].rotulo;
