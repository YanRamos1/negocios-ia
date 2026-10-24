import type { TipoRescisao } from '../../ferramentas/rescisao/src/index';

export interface PaginaRescisao {
  slug: string;
  tipo: TipoRescisao;
  titulo: string;
  resumo: string;
}

export const paginasRescisao: PaginaRescisao[] = [
  {
    slug: 'sem-justa-causa',
    tipo: 'sem-justa-causa',
    titulo: 'Dispensa sem justa causa',
    resumo:
      'O caso mais comum: aviso proporcional, 13º e férias proporcionais, férias vencidas e multa de 40% do FGTS.',
  },
  {
    slug: 'pedido-de-demissao',
    tipo: 'pedido-demissao',
    titulo: 'Pedido de demissão',
    resumo:
      'Você recebe saldo, 13º e férias proporcionais, mas não tem multa do FGTS nem saque. Aviso não cumprido é descontado.',
  },
  {
    slug: 'justa-causa',
    tipo: 'justa-causa',
    titulo: 'Dispensa por justa causa',
    resumo:
      'Só saldo de salário e férias vencidas com terço. Sem 13º proporcional, sem férias proporcionais, sem aviso e sem multa.',
  },
  {
    slug: 'acordo',
    tipo: 'acordo',
    titulo: 'Acordo entre as partes (art. 484-A)',
    resumo:
      'Metade do aviso indenizado, multa de 20% do FGTS, saque de até 80% e nenhum acesso ao seguro-desemprego.',
  },
];
