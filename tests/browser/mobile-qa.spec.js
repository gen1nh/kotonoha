import {test,expect} from '@playwright/test';
import {initialState,N5_UNITS,checkpointQuestions} from '../../src/entities/study/index.js';

const seeded=()=>{const state=initialState();state.onboardingCompleted=true;return state;};
async function openWithState(page,state=seeded(),view='home'){
 await page.addInitScript(value=>{
  if(!localStorage.getItem('kotonoha.v1'))localStorage.setItem('kotonoha.v1',JSON.stringify(value));
 },state);
 await page.goto('/?view='+view);
}

test.use({viewport:{width:390,height:844}});

test('viewport móvel mantém a navegação acessível e sem rolagem horizontal',async({page})=>{
 await openWithState(page);
 for(const width of [320,375,390,430]){
  await page.setViewportSize({width,height:844});
  for(const view of ['home','path','progress','learn']){
   await page.goto('/?view='+view);
   await expect(page.locator('#view-'+view)).toBeVisible();
   const layout=await page.evaluate(()=>{
    const main=document.getElementById('main-content');
    const nav=document.querySelector('nav[aria-label="Navegação móvel"]');
    return {
     viewport:document.documentElement.clientWidth,
     scroll:document.documentElement.scrollWidth,
     mainRight:main.getBoundingClientRect().right,
     navBottom:nav.getBoundingClientRect().bottom,
     height:innerHeight,
    };
   });
   expect(layout.scroll,`sem overflow em ${view} / ${width}`).toBeLessThanOrEqual(layout.viewport+1);
   expect(layout.mainRight,`main cabe em ${view} / ${width}`).toBeLessThanOrEqual(width+1);
   expect(layout.navBottom,`barra inferior ${view} / ${width}`).toBeLessThanOrEqual(layout.height+1);
  }
 }
});

test('lousa de kana aceita traço, desfazer e limpar sem scroll do canvas',async({page})=>{
 await openWithState(page,seeded(),'learn');
 await page.getByRole('button',{name:'Hiragana',exact:true}).click();
 const canvas=page.locator('canvas[data-drawing-surface]');
 await expect(canvas).toBeVisible();
 await expect(canvas).toHaveCSS('touch-action','none');
 const box=await canvas.boundingBox();
 expect(box).not.toBeNull();
 expect(box.width).toBeGreaterThan(180);
 const undo=page.getByRole('button',{name:/Desfazer/});
 const clear=page.getByRole('button',{name:/Limpar lousa/});
 await expect(undo).toBeDisabled();
 await page.mouse.move(box.x+box.width*.25,box.y+box.height*.30);
 await page.mouse.down();
 await page.mouse.move(box.x+box.width*.65,box.y+box.height*.65,{steps:8});
 await page.mouse.up();
 await expect(undo).toBeEnabled();
 await expect(clear).toBeEnabled();
 await undo.click();
 await expect(undo).toBeDisabled();
 await page.mouse.move(box.x+box.width*.2,box.y+box.height*.4);
 await page.mouse.down();
 await page.mouse.move(box.x+box.width*.7,box.y+box.height*.5,{steps:5});
 await page.mouse.up();
 await clear.click();
 await expect(clear).toBeDisabled();
});

test('checkpoint retoma a primeira pergunta pendente após reiniciar no WebKit móvel',async({page})=>{
 const state=seeded(),unit=N5_UNITS[0],questions=checkpointQuestions(state,unit.id);
 state.drafts[`checkpoint:${unit.id}`]={answers:{[questions[0].id]:questions[0].answer},result:null};
 await openWithState(page,state,'checkpoint&topic='+encodeURIComponent(unit.id)+'&level=N5');
 await expect(page.getByText(`QUESTÃO 2 DE ${questions.length}`,{exact:true})).toBeVisible();
 await page.reload();
 await expect(page.getByText(`QUESTÃO 2 DE ${questions.length}`,{exact:true})).toBeVisible();
 await page.getByRole('button',{name:'← Anterior'}).click();
 await expect(page.locator('fieldset').getByRole('radio',{name:questions[0].answer,exact:true})).toBeChecked();
});
