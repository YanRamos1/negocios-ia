import { expect, test } from '@playwright/test';

test('a landing de serviços apresenta a auditoria', async ({ page }) => {
  const resposta = await page.goto('/servicos/');
  expect(resposta?.status()).toBe(200);
  await expect(page.locator('h1')).toContainText('Auditoria de segurança');
  await expect(page.locator('body')).toContainText('IDOR');
  await expect(page.locator('body')).toContainText('R$ 18.000');
});

test('a landing mostra processo, amostra e referências públicas', async ({ page }) => {
  await page.goto('/servicos/');

  await expect(page.locator('.selos')).toContainText('Escopo assinado');
  await expect(page.locator('.selos')).toContainText('Sem teste em produção');

  await expect(page.locator('.codigo-amostra')).toContainText('db(\'invoices\')');
  await expect(page.locator('.chip-critica')).toContainText('CRÍTICA');

  await expect(page.getByRole('link', { name: 'OWASP Top 10 (2021)' })).toHaveCount(1);
  await expect(page.getByRole('link', { name: 'OWASP Top 10 para LLM' })).toHaveCount(1);
  await expect(page.locator('body')).toContainText('LGPD');

  const jsonLd = await page.locator('script[type="application/ld+json"]').textContent();
  expect(jsonLd).toContain('ProfessionalService');
});

test('a landing mostra identidade e canais de contato', async ({ page }) => {
  await page.goto('/servicos/');

  await expect(page.locator('body')).toContainText('Yan Ramos');
  await expect(page.locator('body')).toContainText('isolamento e autorização');

  const email = page.locator('a[href^="mailto:"]').first();
  await expect(email).toHaveAttribute('href', /yanramos111@gmail\.com/);

  const whatsapp = page.locator('a[href^="https://wa.me/"]').first();
  await expect(whatsapp).toHaveAttribute('href', /5524999822342/);
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
