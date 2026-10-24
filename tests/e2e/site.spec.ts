import { expect, test } from '@playwright/test';

test('rota inexistente devolve a página 404 com navegação', async ({ page }) => {
  const resposta = await page.goto('/rota-que-nao-existe/');
  expect(resposta?.status()).toBe(404);
  await expect(page.locator('h1')).toContainText('Página não encontrada');
  await expect(page.locator('.lista-ferramentas a')).toHaveCount(6);
});

test('link de pular aponta para o conteúdo principal', async ({ page }) => {
  await page.goto('/');
  const pular = page.locator('a.pular');
  await expect(pular).toHaveAttribute('href', '#conteudo');
  await expect(page.locator('main#conteudo')).toHaveCount(1);
});

test('o menu marca a página atual', async ({ page }) => {
  await page.goto('/rescisao/');
  await expect(page.locator('nav a[aria-current="page"]')).toHaveText('Rescisão');
});
