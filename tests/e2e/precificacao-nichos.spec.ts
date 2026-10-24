import { expect, test } from '@playwright/test';

const NICHOS = [
  ['confeitaria', '136,07'],
  ['artesanato', '187,59'],
  ['costura-criativa', '223,27'],
  ['velas-artesanais', '84,82'],
] as const;

for (const [slug, preco] of NICHOS) {
  test(`nicho ${slug} calcula o preço`, async ({ page }) => {
    const resposta = await page.goto(`/precificacao-mei/${slug}/`);
    expect(resposta?.status()).toBe(200);
    await expect(page.locator('.bloco.destaque .valor')).toContainText(preco);
  });
}

test('a calculadora abre preenchida com o nicho', async ({ page }) => {
  await page.goto(
    '/precificacao-mei/?m=12,00&h=0,8&vh=30,00&e=4,00&f=450,00&d=82,00&p=80&t=10&mg=35',
  );
  await expect(page.locator('#material')).toHaveValue('12,00');
  await expect(page.locator('#horas')).toHaveValue('0,8');
  await expect(page.locator('.bloco.destaque .valor')).toContainText('84,82');
});
