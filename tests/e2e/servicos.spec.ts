import { expect, test } from '@playwright/test';

test('a landing de serviços apresenta a auditoria', async ({ page }) => {
  const resposta = await page.goto('/servicos/');
  expect(resposta?.status()).toBe(200);
  await expect(page.locator('h1')).toContainText('Auditoria de segurança');
  await expect(page.locator('body')).toContainText('IDOR');
  await expect(page.locator('body')).toContainText('R$ 18.000');
});

test('o relatório de exemplo pode ser baixado', async ({ page }) => {
  await page.goto('/servicos/');

  const link = page.locator('a[download]');
  const href = await link.getAttribute('href');
  expect(href).toContain('auditoria/relatorio-exemplo.pdf');

  const resposta = await page.request.get(new URL(href!, page.url()).toString());
  expect(resposta.status()).toBe(200);
  expect((await resposta.body()).length).toBeGreaterThan(8000);
});

test('a landing tem imagem de compartilhamento própria', async ({ page }) => {
  await page.goto('/servicos/');
  const conteudo = await page.locator('meta[property="og:image"]').getAttribute('content');
  expect(conteudo).toContain('/og/servicos.png');
});
