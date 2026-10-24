export interface OfertaAfiliado {
  titulo: string;
  texto: string;
  cta: string;
  url: string;
  aviso?: string;
}

export interface CapturaLead {
  titulo: string;
  texto: string;
  cta: string;
  url: string;
}

/**
 * Preencha quando o programa de afiliados estiver aprovado.
 * O bloco só aparece no site quando a URL existe — nada de link inventado.
 */
export const afiliadoPrincipal: OfertaAfiliado | null = null;

/**
 * Isca gratuita exibida abaixo do resultado das calculadoras.
 * URL interna (começando com /) recebe o prefixo do site automaticamente.
 */
export const capturaLead: CapturaLead = {
  titulo: 'Kit Financeiro imprimível',
  texto: 'Seis folhas A4 para orçamento, dívidas, metas e despesas. Grátis, sem cadastro.',
  cta: 'Baixar o kit',
  url: '/kit-financeiro/',
};

export const avisoAfiliado =
  'Este site pode receber comissão por indicação. O valor para você não muda.';
