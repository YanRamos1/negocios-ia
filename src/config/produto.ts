export interface Produto {
  nome: string;
  precoCents: number;
  checkoutUrl: string | null;
  arquivoGratis: string;
}

/**
 * Preencha `checkoutUrl` quando o produto estiver à venda (Kiwify/Hotmart/Gumroad).
 * Enquanto for null, a página oferece a versão gratuita e avisa que a completa está em preparo.
 */
export const planilhaFinanceiro: Produto = {
  nome: 'Financeiro PF x PJ',
  precoCents: 3700,
  checkoutUrl: null,
  arquivoGratis: 'planilhas/financeiro-pf-pj-2026-gratis.xlsx',
};

export const planilhaConfeitaria: Produto = {
  nome: 'Precificação de Confeitaria',
  precoCents: 3700,
  checkoutUrl: null,
  arquivoGratis: 'planilhas/confeitaria/precificacao-confeitaria-2026-gratis.xlsx',
};
