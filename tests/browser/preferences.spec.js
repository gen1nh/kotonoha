import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { initialState } from '../../src/entities/study/index.js';
test.use({ reducedMotion: 'reduce' });

test('preferências priorizam ajustes, preservam áudio local e mantêm acesso aos dados', async ({ page }) => {
  const state = initialState(); state.onboardingCompleted = true;
  await page.addInitScript(state => {
    if (!localStorage.getItem('kotonoha.v1')) localStorage.setItem('kotonoha.v1', JSON.stringify(state));
  }, state);
  await page.goto('/?view=settings');
  await expect(page.getByRole('button', { name: 'Áudio e leitura' })).toBeVisible();
  await page.getByRole('button', { name: 'Áudio e leitura' }).click();
  await expect(page.getByLabel('Chave de API (Groq)')).not.toBeVisible();
  await expect(page.getByRole('button', { name: 'Apagar todos os dados locais' })).not.toBeVisible();
  await page.getByText('Experimentar sons', { exact: true }).click();
  const audioSupported = await page.evaluate(() => Boolean(window.AudioContext || window.webkitAudioContext));
  if (!audioSupported) test.info().annotations.push({ type: 'audio', description: 'This WebKit runtime has no Web Audio implementation. Asset availability and fallback controls are verified; audible playback requires a real iPhone.' });
  for (const [file, label] of [['correct', 'Ouvir acerto'], ['incorrect', 'Ouvir tentativa'], ['complete', 'Ouvir conclusão']]) {
    const response = audioSupported ? page.waitForResponse(r => r.url().endsWith(`/audio/${file}.wav`)) : page.request.get(`/audio/${file}.wav`);
    await page.getByRole('button', { name: label, exact: true }).click();
    expect((await response).status()).toBe(200);
  }
  await page.getByRole('slider', { name: 'Volume dos efeitos' }).fill('25');
  await page.getByRole('switch', { name: 'Efeitos sonoros' }).uncheck();
  await page.reload();
  // Subpages are URL-addressable and survive reloads without returning to the menu.
  await expect(page.getByRole('combobox', { name: 'Velocidade padrão do japonês' })).toBeVisible();
  await expect(page.getByRole('switch', { name: 'Efeitos sonoros' })).not.toBeChecked();
  await expect(page.getByRole('button', { name: 'Ouvir acerto' })).not.toBeVisible();
  await page.getByRole('switch', { name: 'Efeitos sonoros' }).check();
  await expect(page.getByRole('slider', { name: 'Volume dos efeitos' })).toHaveValue('25');
  await page.getByRole('button', { name: /Voltar às preferências/ }).click();
  await page.getByRole('button', { name: 'Aparência' }).click();
  for (const theme of ['light', 'dark']) {
    await page.getByRole('combobox', { name: 'Tema visual' }).selectOption(theme);
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
    await expect(page.locator('main .bg-paper').first()).toHaveCSS('background-color', theme === 'dark' ? 'rgb(17, 23, 20)' : 'rgb(255, 255, 255)');
    expect((await new AxeBuilder({ page }).include('main').analyze()).violations).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `test-results/preferences-${test.info().project.name}-${theme}.png`, fullPage: true });
  }
  await page.getByRole('button', { name: /Voltar às preferências/ }).click();
  await page.getByRole('button', { name: 'Mais opções' }).click();
  await page.getByText('Assistente de IA', { exact: false }).first().click();
  await expect(page.getByLabel('Chave de API (Groq)')).toBeVisible();
});
