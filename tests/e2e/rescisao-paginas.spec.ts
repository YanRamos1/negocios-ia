import { expect, test } from '@playwright/test';

test('página por tipo calcula o exemplo e aponta para a calculadora', async ({ page }) => {
  await page.goto('/rescisao/justa-causa/');

  await expect(page.locator('h1')).toContainText('justa causa');
  await expect(page.locator('.bloco.destaque .valor')).toContainText('2.117,32');

  const botao = page.locator('a.botao');
  await expect(botao).toHaveAttribute('href', /rescisao\/\?tipo=justa-causa/);
});

test('a calculadora abre preenchida com o caso da página', async ({ page }) => {
  await page.goto('/rescisao/?tipo=acordo&s=3.000,00&adm=2023-01-10&des=2026-10-23&fgts=12.000,00');

  await expect(page.locator('#tipo')).toHaveValue('acordo');
  await expect(page.locator('.bloco.destaque .valor')).toContainText('12.660,81');
});

test('as quatro páginas de tipo respondem', async ({ page }) => {
  for (const slug of ['sem-justa-causa', 'pedido-de-demissao', 'justa-causa', 'acordo']) {
    const resposta = await page.goto(`/rescisao/${slug}/`);
    expect(resposta?.status(), slug).toBe(200);
    await expect(page.locator('h1')).toBeVisible();
  }
});
