import {test,expect} from '@playwright/test';
import {initialState} from '../../src/entities/study/index.js';

test.use({viewport:{width:390,height:844}});
async function enter(page, view) {
  const state=initialState();state.onboardingCompleted=true;
  await page.addInitScript(s=>{
    if(!localStorage.getItem('kotonoha.v1')) localStorage.setItem('kotonoha.v1',JSON.stringify(s));
  },state);
  await page.goto('/?view='+view);
}

test('Praticar organiza atividades em cards e abre apenas a escolhida',async({page})=>{
  await enter(page,'practice');
  await expect(page.getByRole('button',{name:'Escuta'})).toBeVisible();
  await expect(page.getByRole('heading',{name:'Prática de escuta'})).toHaveCount(0);
  await page.getByRole('button',{name:'Escuta'}).click();
  await expect(page.getByRole('heading',{name:'Prática de escuta'})).toBeVisible();
  await expect(page.getByRole('button',{name:/Consultar Biblioteca e Caderno/})).toHaveCount(0);
  await page.getByRole('button',{name:/Voltar para Praticar/}).click();
  await expect(page.getByRole('button',{name:/Consultar Biblioteca e Caderno/})).toBeVisible();
  await page.getByRole('button',{name:'Laboratórios'}).click();
  await expect(page.getByRole('button',{name:'Conversação'})).toBeDisabled();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('Biblioteca e Caderno mantêm categorias separadas da ferramenta aberta',async({page})=>{
  await enter(page,'practice');
  await page.getByRole('button',{name:/Consultar Biblioteca e Caderno/}).click();
  await page.getByRole('button',{name:'Biblioteca'}).click();
  await expect(page.getByRole('button',{name:'Hiragana'})).toBeVisible();
  await expect(page.getByRole('button',{name:'Katakana'})).toBeVisible();
  await page.getByRole('button',{name:'Hiragana'}).click();
  await expect(page.getByRole('button',{name:/Todas as categorias/})).toBeVisible();
  await expect(page.getByRole('button',{name:'Katakana'})).toHaveCount(0);
  await page.getByRole('button',{name:/Todas as categorias/}).click();
  await expect(page.getByRole('button',{name:'Katakana'})).toBeVisible();

  await page.goto('/?view=notebook');
  await expect(page.getByRole('button',{name:'Minhas anotações'})).toBeVisible();
  await expect(page.getByRole('button',{name:'Minhas dúvidas'})).toBeVisible();
  await page.getByRole('button',{name:'Minhas anotações'}).click();
  await expect(page.getByRole('button',{name:/Voltar ao Caderno/})).toBeVisible();
  await expect(page.getByRole('button',{name:'Minhas dúvidas'})).toHaveCount(0);
  await page.getByRole('button',{name:/Voltar ao Caderno/}).click();
  await expect(page.getByRole('button',{name:'Meus erros'})).toBeVisible();
});

test('Progresso e Preferências usam destinos claros e sem rolagem horizontal',async({page})=>{
  await enter(page,'progress');
  await page.getByRole('button',{name:'Preparação N5'}).click();
  await expect(page.getByRole('heading',{name:'Preparação N5'})).toBeVisible();
  await page.getByRole('button',{name:/Voltar ao resumo/}).click();
  await page.getByRole('button',{name:'Simulados'}).click();
  await expect(page.getByRole('heading',{name:'Simulados e prática'})).toBeVisible();
  await page.goto('/?view=settings');
  await expect(page.getByRole('button',{name:'Conta e backups'})).toBeVisible();
  await page.getByRole('button',{name:'Conta e backups'}).click();
  await expect(page.getByRole('heading',{name:'Seus dados'})).toBeVisible();
  await page.getByRole('button',{name:/Voltar às preferências/}).click();
  await page.getByRole('button',{name:'Mais opções'}).click();
  await expect(page.getByText('Ajuda e gerenciamento')).toBeVisible();
  for(const width of [320,390,768]){
    await page.setViewportSize({width,height:844});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  }
});

test('voltar e avançar do navegador restauram as subpáginas sem perder o menu',async({page})=>{
  await enter(page,'practice');
  await page.getByRole('button',{name:'Escuta'}).click();
  await expect(page).toHaveURL(/sub_practice=listening/);
  await page.goBack();
  await expect(page.getByRole('button',{name:'Escuta'})).toBeVisible();
  await page.goForward();
  await expect(page.getByRole('heading',{name:'Prática de escuta'})).toBeVisible();
  await page.goto('/?view=settings');
  await page.getByRole('button',{name:'Aparência'}).click();
  await expect(page).toHaveURL(/sub_settings=appearance/);
  await page.reload();
  await expect(page.getByRole('combobox',{name:'Tema visual'})).toBeVisible();
  await page.goBack();
  await expect(page.getByRole('button',{name:'Aparência'})).toBeVisible();
});

test('Praticar não duplica desafio nem continuidade da Trilha e separa digitação',async({page})=>{
  await enter(page,'practice');
  await expect(page.getByRole('button',{name:'Desafio rápido'})).toHaveCount(1);
  await expect(page.getByRole('heading',{name:'Continue sua Trilha'})).toHaveCount(0);
  await expect(page.getByRole('heading',{name:'Digite em japonês'})).toHaveCount(0);
  await page.getByRole('button',{name:'Digitação japonesa'}).click();
  await expect(page.getByRole('heading',{name:'Digite em japonês'})).toBeVisible();
  await expect(page.getByRole('button',{name:'Desafio rápido'})).toHaveCount(0);
  await page.goBack();
  await expect(page.getByRole('button',{name:'Digitação japonesa'})).toBeVisible();
});
