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
 * Isca/lead: link de captura (WhatsApp, formulário ou landing do parceiro).
 */
export const capturaLead: CapturaLead | null = null;

export const avisoAfiliado =
  'Este site pode receber comissão por indicação. O valor para você não muda.';
