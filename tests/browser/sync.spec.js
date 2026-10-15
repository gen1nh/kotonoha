import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { initialState } from '../../src/entities/study/index.js';
import { fingerprint } from '../../src/app/model/syncDecision.js';

const account = '11111111-1111-4111-8111-111111111111';
async function setup(page, { row = null, base = null, rejectWrite = false } = {}) {
  const local = initialState(); local.onboardingCompleted = true; local.stats.reviews = 7;
  let cloud = row; const writes = [];
  await page.route('https://mrcqakxoraxukiwbreyy.supabase.co/**', async route => {
    const url = route.request().url();
    if (url.includes('/rpc/')) {
      const request = route.request().postDataJSON(); writes.push(request);
      if (rejectWrite) return route.fulfill({ json: [] });
      cloud = { payload: request.new_payload, revision: (cloud?.revision || 0) + 1, updated_at: new Date().toISOString() };
      return route.fulfill({ json: [cloud] });
    }
    if (url.includes('/rest/v1/kotonoha_progress')) return route.fulfill({ json: cloud ? [cloud] : [] });
    return route.fulfill({ json: {} });
  });
  await page.addInitScript(({ local, account, base }) => {
    if (!localStorage.getItem('kotonoha.v1')) localStorage.setItem('kotonoha.v1', JSON.stringify(local));
    const token = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' })) + '.' + btoa(JSON.stringify({ sub: account, exp: 4102444800 })) + '.test';
    localStorage.setItem('sb-mrcqakxoraxukiwbreyy-auth-token', JSON.stringify({ access_token: token, refresh_token: 'test', expires_at: 4102444800, expires_in: 3600, token_type: 'bearer', user: { id: account, email: 'pessoal@example.com', aud: 'authenticated', role: 'authenticated' } }));
    if (base) localStorage.setItem('kotonoha.sync.v1', JSON.stringify({ owner: account, base }));
  }, { local, account, base });
  await page.goto('/?view=settings');
  await page.getByRole('button', { name: 'Conta e backups' }).click();
  return { local, writes };
}

test('first login requires choice, upload preserves backup and prevents local reset', async ({ page }) => {
  const { writes } = await setup(page);
  await expect(page.getByText('Escolha o progresso para esta conta', { exact: true })).toBeVisible();
  expect(writes).toHaveLength(0);
  page.on('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Usar este aparelho', exact: true }).click();
  await expect(page.getByText('Sincronizado', { exact: true })).toBeVisible();
  expect(writes[0].new_payload.stats.reviews).toBe(7);
  await page.getByRole('button', { name: /Voltar às preferências/ }).click();
  await page.getByRole('button', { name: 'Mais opções' }).click();
  await page.getByText('Ajuda e gerenciamento', { exact: true }).click();
  await page.getByText('Reiniciar progresso', { exact: true }).click();
  await expect(page.getByRole('button', { name: 'Apagar todos os dados locais' })).toBeDisabled();
  expect(await page.evaluate(() => Object.keys(localStorage).filter(k => k.startsWith('kotonoha.sync.recovery.')).length)).toBe(1);
  const audit = await new AxeBuilder({ page }).include('main').analyze();
  expect(audit.violations).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: `test-results/sync-${test.info().project.name}.png`, fullPage: true });
  await page.getByRole('button', { name: /Voltar às preferências/ }).click();
  await page.getByRole('button', { name: 'Estudo' }).click();
  await page.getByRole('combobox', { name: 'Meta diária de atividades' }).selectOption('3');
  await page.getByRole('button', { name: /Voltar às preferências/ }).click();
  await page.getByRole('button', { name: 'Conta e backups' }).click();
  await page.getByRole('button', { name: 'Sincronizar agora' }).click();
  await expect(page.getByText('Sincronizado', { exact: true })).toBeVisible();
  expect(writes).toHaveLength(2);
  expect(writes[1].expected_revision).toBe(1);
  expect(writes[1].new_payload.dailyActivityGoal).toBe(3);
  await page.getByRole('button', { name: 'Sair da conta' }).click();
  await expect(page.getByRole('button', { name: 'Entrar com Google' })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('kotonoha.sync.v1'))).toBeNull();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('kotonoha.v1')).stats.reviews)).toBe(7);
});

test('receiving cloud keeps the previous local backup', async ({ page }) => {
  const payload = initialState(); payload.onboardingCompleted = true; payload.stats.reviews = 24;
  await setup(page, { row: { payload, revision: 5, updated_at: new Date().toISOString() } });
  await expect(page.getByRole('button', { name: 'Usar a nuvem', exact: true })).toBeVisible();
  page.on('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Usar a nuvem', exact: true }).click();
  await expect(page.getByText('Sincronizado', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('kotonoha.v1')).stats.reviews)).toBe(24);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem(Object.keys(localStorage).find(k => k.startsWith('kotonoha.sync.recovery.')))).local.stats.reviews)).toBe(7);
});

test('concurrent changes stop sending; rejected revision never reports success', async ({ page }) => {
  const payload = initialState(); payload.onboardingCompleted = true; payload.stats.reviews = 20;
  const { writes } = await setup(page, { row: { payload, revision: 5, updated_at: new Date().toISOString() }, base: { revision: 4, fingerprint: fingerprint({}) }, rejectWrite: true });
  await expect(page.getByText('Há alterações nos dois aparelhos. Escolha qual versão manter.', { exact: true })).toBeVisible();
  expect(writes).toHaveLength(0);
  page.on('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Usar este aparelho', exact: true }).click();
  await expect(page.getByText('Há alterações nos dois aparelhos. Escolha qual versão manter.', { exact: true })).toBeVisible();
  expect(writes).toHaveLength(1);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('kotonoha.v1')).stats.reviews)).toBe(7);
});

test('offline keeps pending local data and returns after reconnection', async ({ page, context }) => {
  await setup(page);
  await expect(page.getByText('Escolha o progresso para esta conta', { exact: true })).toBeVisible();
  await context.setOffline(true);
  await expect(page.getByText('Sem conexão. Seu estudo continua salvo neste aparelho.', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('kotonoha.v1')).stats.reviews)).toBe(7);
  await context.setOffline(false);
  await expect(page.getByText('Escolha o progresso para esta conta', { exact: true })).toBeVisible();
});
