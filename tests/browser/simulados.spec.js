import {test,expect} from '@playwright/test';
import {initialState} from '../../src/entities/study/index.js';

const initial = () => {const state=initialState();state.onboardingCompleted=true;return state;};
test.use({viewport:{width:390,height:844}});

test('Simulados separa tarefas e exibe apenas uma questão por vez', async ({page}) => {
  await page.addInitScript(state=>localStorage.setItem('kotonoha.v1',JSON.stringify(state)),initial());
  await page.goto('/?view=progress');
  await page.getByRole('button',{name:'Simulados'}).click();
  await expect(page.getByRole('heading',{name:'Simulados e prática'})).toBeVisible();
  await expect(page.getByRole('heading',{name:/Autoavaliação N5/})).toHaveCount(0);
  await expect(page.locator('fieldset')).toHaveCount(0);
  await page.getByRole('button',{name:'Abrir Fazer autoavaliação'}).click();
  await expect(page.locator('fieldset')).toHaveCount(1);
  await expect(page.getByRole('button',{name:'Próxima questão →'})).toBeDisabled();
  await page.locator('fieldset').getByRole('radio').first().check();
  await expect(page.getByRole('button',{name:'Próxima questão →'})).toBeEnabled();
  await page.getByRole('button',{name:'Próxima questão →'}).click();
  await expect(page.getByText('Questão 2 de 8')).toBeVisible();
  await page.reload();
  await expect(page.getByText('Questão 2 de 8')).toBeVisible();
  await expect(page.locator('fieldset')).toHaveCount(1);
  await page.getByRole('button',{name:/Voltar para Simulados/}).click();
  await expect(page.locator('fieldset')).toHaveCount(0);
  await page.getByRole('button',{name:'Abrir Meus resultados'}).click();
  await expect(page.getByRole('heading',{name:'Registrar resultado'})).toBeVisible();
  await page.getByLabel('Nome ou origem da prova (opcional)').fill('Simulado pessoal do curso');
  await page.getByLabel('Percentual de acertos').fill('76');
  await expect(page.getByText('Simulado pessoal do curso')).toHaveCount(0);
  await page.getByRole('button',{name:'Salvar resultado'}).click();
  await expect(page.getByText('76%')).toBeVisible();
  await expect(page.getByText('Simulado pessoal do curso')).toBeVisible();
  await page.getByRole('button',{name:/Voltar para Simulados/}).click();
  await page.getByRole('button',{name:'Abrir Material oficial JLPT'}).click();
  await expect(page.getByRole('link',{name:/Exemplos de provas/})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('Progresso mantém estatísticas recolhidas e simulados sem listas longas', async ({page}) => {
  await page.addInitScript(state=>localStorage.setItem('kotonoha.v1',JSON.stringify(state)),initial());
  await page.goto('/?view=progress');
  await expect(page.getByText('Estatísticas detalhadas e tempo de estudo')).toBeVisible();
  await expect(page.getByRole('heading',{name:'Quanto você já estudou'})).not.toBeVisible();
  await page.getByRole('button',{name:'Simulados'}).click();
  await expect(page.getByRole('heading',{name:'Quanto você já estudou'})).toHaveCount(0);
});
