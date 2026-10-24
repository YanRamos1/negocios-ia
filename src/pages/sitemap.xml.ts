import type { APIRoute } from 'astro';
import { base } from '../lib/urls';
import { faixas } from '../data/faixas';
import { faixasImportacao } from '../data/faixas-importacao';
import { paginasRescisao } from '../data/tipos-rescisao';

export const GET: APIRoute = () => {
  const site = (import.meta.env.SITE ?? 'http://localhost:4321').replace(/\/$/, '');

  const rotas = [
    '',
    'clt-pj/',
    'custo-importacao/',
    'rescisao/',
    'precificacao-mei/',
    'taxa-marketplace/',
    'planilha-financeiro/',
    'kit-financeiro/',
    'sobre/',
    'privacidade/',
    ...faixas.map((faixa) => `clt-pj/${faixa.slug}/`),
    ...faixasImportacao.map((faixa) => `custo-importacao/${faixa.slug}/`),
    ...paginasRescisao.map((pagina) => `rescisao/${pagina.slug}/`),
  ];

  const urls = rotas
    .map((rota) => `  <url><loc>${site}${base}${rota}</loc></url>`)
    .join('\n');

  const corpo = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  return new Response(corpo, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
