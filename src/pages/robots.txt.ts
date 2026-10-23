import type { APIRoute } from 'astro';
import { base } from '../lib/urls';

export const GET: APIRoute = () => {
  const site = (import.meta.env.SITE ?? 'http://localhost:4321').replace(/\/$/, '');

  const corpo = `User-agent: *
Allow: /

Sitemap: ${site}${base}sitemap.xml
`;

  return new Response(corpo, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
