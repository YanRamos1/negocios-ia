import { expect, test } from '@playwright/test';

test.describe('CLT x PJ', () => {
  test('calcula o cenário padrão', async ({ page }) => {
    await page.goto('/clt-pj/');
    await expect(page.locator('.veredito')).toContainText('PJ entrega mais');
    await expect(page.locator('.bloco').nth(0).locator('.valor')).toContainText('4.498,49');
    await expect(page.locator('.bloco').nth(1).locator('.valor')).toContainText('5.609,80');
  });

  test('recalcula ao mudar o faturamento', async ({ page }) => {
    await page.goto('/clt-pj/');
    await page.fill('#salario', '3.000,00');
    await page.fill('#faturamento', '4.000,00');
    await expect(page.locator('.bloco').nth(0).locator('.valor')).toContainText('2.751,40');
    await expect(page.locator('.bloco').nth(1).locator('.valor')).toContainText('3.281,69');
  });

  test('fator R define o anexo', async ({ page }) => {
    await page.goto('/clt-pj/');
    await page.fill('#faturamento', '4.000,00');
    await page.uncheck('#modo-prolabore');
    await page.fill('#prolabore', '1.621,00');
    await expect(page.locator('.bloco').nth(1).locator('.linhas')).toContainText('III');
    await expect(page.locator('.bloco').nth(1).locator('.linhas')).toContainText('40,5%');
  });
});

test.describe('Custo de importação', () => {
  test('aplica a regra de 12/05/2026 em São Paulo', async ({ page }) => {
    await page.goto('/custo-importacao/');
    await expect(page.locator('#uf')).toHaveValue('SP');
    await expect(page.locator('.veredito')).toContainText('Tributado em 60%');
    await expect(page.locator('.bloco.destaque .valor')).toContainText('466,97');
  });

  test('muda com o ICMS do estado', async ({ page }) => {
    await page.goto('/custo-importacao/');
    await page.selectOption('#uf', 'BA');
    await expect(page.locator('.bloco.destaque .valor')).toContainText('484,05');
  });

  test('isenta até US$ 50 no Remessa Conforme', async ({ page }) => {
    await page.goto('/custo-importacao/');
    await page.fill('#produto', '40,00');
    await expect(page.locator('.veredito')).toContainText('II zero');
  });

  test('remove o desconto fora do programa', async ({ page }) => {
    await page.goto('/custo-importacao/');
    await page.uncheck('#prc');
    await expect(page.locator('.bloco.destaque .valor')).toContainText('647,69');
  });
});

test.describe('Rescisão', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/rescisao/');
    await page.fill('#admissao', '2023-01-10');
    await page.fill('#desligamento', '2026-06-20');
    await page.fill('#fgts', '12.000,00');
    await page.fill('#salario', '3.000,00');
  });

  test('dispensa sem justa causa com aviso indenizado', async ({ page }) => {
    await expect(page.locator('.veredito')).toContainText('Dispensa sem justa causa');
    await expect(page.locator('.bloco.destaque .valor')).toContainText('14.494,47');
  });

  test('justa causa paga só saldo', async ({ page }) => {
    await page.selectOption('#tipo', 'justa-causa');
    await expect(page.locator('.bloco.destaque .valor')).toContainText('1.844,32');
  });

  test('acordo aplica metade do aviso e 20% de multa', async ({ page }) => {
    await page.selectOption('#tipo', 'acordo');
    await expect(page.locator('.bloco.destaque .valor')).toContainText('10.144,47');
  });

  test('aviso não cumprido desconta um salário', async ({ page }) => {
    await page.selectOption('#tipo', 'pedido-demissao');
    await page.selectOption('#aviso', 'nao-cumprido');
    await expect(page.locator('.bloco.destaque .linhas')).toContainText('3.000,00');
  });
});

test.describe('Precificação MEI', () => {
  test('sugere preço com margem real', async ({ page }) => {
    await page.goto('/precificacao-mei/');
    await expect(page.locator('.bloco.destaque .valor')).toContainText('136,07');
    await expect(page.locator('.bloco.destaque .linhas')).toContainText('30,0%');
    await expect(page.locator('.bloco.destaque .linhas')).toContainText('1.67x');
  });

  test('bloqueia margem mais taxa acima de 100%', async ({ page }) => {
    await page.goto('/precificacao-mei/');
    await page.fill('#margem', '60');
    await page.fill('#taxa', '40');
    await expect(page.locator('#resultado')).toContainText('menor que 100%');
  });
});

test.describe('Taxa de marketplace', () => {
  test('destaca o canal com maior sobra', async ({ page }) => {
    await page.goto('/taxa-marketplace/');
    await expect(page.locator('.veredito')).toContainText('Balcão');
    const marketplace = page.locator('.tabela tbody tr').nth(2);
    await expect(marketplace.locator('td').nth(3)).toContainText('28,00');
  });

  test('marca canal inviável abaixo do preço mínimo', async ({ page }) => {
    await page.goto('/taxa-marketplace/');
    await page.fill('#preco', '50,00');
    await expect(page.locator('.tabela')).toContainText('abaixo do mínimo');
  });
});
