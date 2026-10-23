const bruto = import.meta.env.BASE_URL ?? '/';

/** BASE_URL do Astro vem sem barra final em build de subpasta. */
export const base = bruto.endsWith('/') ? bruto : `${bruto}/`;

export const home = base;

export const url = (caminho = ''): string => `${base}${caminho.replace(/^\//, '')}`;
