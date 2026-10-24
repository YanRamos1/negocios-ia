import { expect, test } from '@playwright/test';

test('o formulário gera os configs a partir dos campos', async ({ page }) => {
  await page.goto('/interno/credenciais/');

  await expect(page.locator('h1')).toContainText('Formulário de credibilidade');

  await page.fill('#nome', 'Maria Silva');
  await page.fill('#cargo', 'Engenheira de software e segurança');
  await page.fill('#bio', 'Audito sistemas multi-inquilino com foco em autorização.');
  await page.fill('#github', 'https://github.com/maria');
  await page.fill('#email', 'contato@exemplo.com.br');
  await page.fill('#whatsapp', '5511987654321');

  await expect(page.locator('#progresso')).toHaveText('5 de 5 campos obrigatórios');

  const autor = await page.locator('#saida-autor code').textContent();
  expect(autor).toContain('Maria Silva');
  expect(autor).toContain('https://github.com/maria');

  const contato = await page.locator('#saida-contato code').textContent();
  expect(contato).toContain('contato@exemplo.com.br');
  expect(contato).toContain('5511987654321');
});

test('o formulário aponta o que falta e valida formato', async ({ page }) => {
  await page.goto('/interno/credenciais/');

  await page.fill('#email', 'email-invalido');
  await page.fill('#whatsapp', '123');

  const pendencias = page.locator('#pendencias');
  await expect(pendencias).toContainText('Faltam');
  await expect(pendencias).toContainText('E-mail com formato inválido');
  await expect(pendencias).toContainText('WhatsApp deve ter');
});

test('a prova social só é gerada com dados', async ({ page }) => {
  await page.goto('/interno/credenciais/');

  let prova = await page.locator('#saida-prova code').textContent();
  expect(prova).toContain('autorizacao: "nao"');

  await page.selectOption('#autorizacao', 'anonimo');
  await page.fill('#cliente', 'Fintech de 80 pessoas');
  await page.fill('#resultado', '3 falhas críticas corrigidas');

  prova = await page.locator('#saida-prova code').textContent();
  expect(prova).toContain('Fintech de 80 pessoas');
  expect(prova).toContain('"anonimo"');
});
