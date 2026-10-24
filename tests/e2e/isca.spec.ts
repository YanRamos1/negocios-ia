import { expect, test } from '@playwright/test';

test('o kit tem download real em PDF', async ({ page }) => {
  await page.goto('/kit-financeiro/');

  const link = page.locator('a[download]');
  await expect(link).toContainText('Baixar o kit');
  const href = await link.getAttribute('href');
  expect(href).toContain('kit-financeiro-2026.pdf');

  const resposta = await page.request.get(new URL(href!, page.url()).toString());
  expect(resposta.status()).toBe(200);
  expect((await resposta.body()).length).toBeGreaterThan(3000);
});

test('a isca aparece abaixo do resultado das calculadoras', async ({ page }) => {
  await page.goto('/clt-pj/');
  const oferta = page.locator('.oferta-lead');
  await expect(oferta).toBeVisible();
  await expect(oferta.locator('a').first()).toHaveAttribute('href', /kit-financeiro/);
});

test('og:image usa a imagem da ferramenta', async ({ page }) => {
  await page.goto('/rescisao/');
  const conteudo = await page.locator('meta[property="og:image"]').getAttribute('content');
  expect(conteudo).toContain('/og/rescisao.png');
});
