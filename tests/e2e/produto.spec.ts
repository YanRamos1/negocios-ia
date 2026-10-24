import { expect, test } from '@playwright/test';

test('a página do produto oferece o download da versão gratuita', async ({ page }) => {
  await page.goto('/planilha-financeiro/');

  const link = page.locator('a[download]');
  await expect(link).toHaveCount(1);
  await expect(link).toContainText('Baixar planilha');

  const href = await link.getAttribute('href');
  expect(href).toContain('financeiro-pf-pj-2026-gratis.xlsx');

  const resposta = await page.request.get(new URL(href!, page.url()).toString());
  expect(resposta.status()).toBe(200);
  expect((await resposta.body()).length).toBeGreaterThan(5000);
});

test('a página da confeitaria entrega a planilha gratuita', async ({ page }) => {
  await page.goto('/planilha-confeitaria/');

  const link = page.locator('a[download]');
  const href = await link.getAttribute('href');
  expect(href).toContain('precificacao-confeitaria-2026-gratis.xlsx');

  const resposta = await page.request.get(new URL(href!, page.url()).toString());
  expect(resposta.status()).toBe(200);
  expect((await resposta.body()).length).toBeGreaterThan(5000);

  await expect(page.locator('.tabela')).toContainText('R$ 92,28');
});

test('a página mostra o cenário do comparativo', async ({ page }) => {
  await page.goto('/planilha-financeiro/');
  await expect(page.locator('.tabela')).toContainText('4.498,49');
  await expect(page.locator('.tabela')).toContainText('5.609,80');
  await expect(page.locator('.tabela')).toContainText('III');
});
