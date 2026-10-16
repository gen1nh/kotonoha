import {test,expect} from '@playwright/test';
import {initialState,N5_UNITS,cardIdsForUnit,checkpointQuestions} from '../../src/entities/study/index.js';

const stateForTest=()=>{const s=initialState();s.onboardingCompleted=true;return s;};
async function start(page,state=stateForTest(),view='home'){
 await page.addInitScript(saved=>{
  if(!localStorage.getItem('kotonoha.v1'))localStorage.setItem('kotonoha.v1',JSON.stringify(saved));
 },state);
 await page.goto('/?view='+view);
}

test.use({viewport:{width:390,height:844}});

test('lousa de kanji usa ponteiro de toque, desfazer e limpar sem arrastar a página',async({page,browserName})=>{
 await start(page,undefined,'learn');
 await page.getByRole('button',{name:/Kanji N5/}).click();
 const canvas=page.locator('canvas[data-drawing-surface]');
 await expect(canvas).toBeVisible();
 await expect(canvas).toHaveCSS('touch-action','none');
 await canvas.scrollIntoViewIfNeeded();
 const undo=page.getByRole('button',{name:/Desfazer/});
 const clear=page.getByRole('button',{name:/Limpar lousa/});
 await expect(undo).toBeDisabled();
 const box=await canvas.boundingBox();
 // Real pointer sequence through Playwright (shared with mobile WebKit emulation).
 await page.mouse.move(box.x+box.width*.25,box.y+box.height*.25);
 await page.mouse.down();
 await page.mouse.move(box.x+box.width*.65,box.y+box.height*.65,{steps:8});
 await page.mouse.up();
 await expect(undo).toBeEnabled();
 await undo.click();
 await expect(undo).toBeDisabled();
 await canvas.scrollIntoViewIfNeeded();
 const box2=await canvas.boundingBox();
 await page.mouse.move(box2.x+30,box2.y+35);
 await page.mouse.down();
 await page.mouse.move(box2.x+80,box2.y+95,{steps:5});
 await page.mouse.up();
 await expect(clear).toBeEnabled();
 await clear.click();
 await expect(clear).toBeDisabled();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth)).toBe(true);
});

test('retomada após fechar a aba preserva checkpoint e progresso salvo',async({browser})=>{
 const context=await browser.newContext({viewport:{width:390,height:844}});
 const unit=N5_UNITS[0],state=stateForTest();
 for(const id of cardIdsForUnit(unit))state.cards[id].seen=true;
 const q=checkpointQuestions(state,unit.id);
 const page=await context.newPage();
 await start(page,state,'checkpoint&topic='+encodeURIComponent(unit.id)+'&level=N5');
 await page.locator('fieldset').getByRole('radio',{name:q[0].answer,exact:true}).check();
 await page.getByRole('button',{name:'Próxima questão →'}).click();
 await expect(page.getByText('QUESTÃO 2 DE '+q.length,{exact:true})).toBeVisible();
 // New page within the same browser context models close/reopen without clearing storage.
 await page.close();
 const reopened=await context.newPage();
 await reopened.goto('/?view=checkpoint&topic='+encodeURIComponent(unit.id)+'&level=N5');
 await expect(reopened.getByText('QUESTÃO 2 DE '+q.length,{exact:true})).toBeVisible();
 await reopened.getByRole('button',{name:'← Anterior'}).click();
 await expect(reopened.locator('fieldset').getByRole('radio',{name:q[0].answer,exact:true})).toBeChecked();
 await context.close();
});

test('mobile Safari mantém contêiner e controles dentro da tela em rotas principais',async({page})=>{
 await start(page);
 for(const width of [320,375,390,430]){
  await page.setViewportSize({width,height:844});
  for(const view of ['home','path','progress','learn','practice','review','settings']){
   await page.goto('/?view='+view);
   await expect(page.locator('#view-'+view)).toBeVisible();
   const sizes=await page.evaluate(()=>{
    const node=document.getElementById('main-content');
    return {client:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth,right:node.getBoundingClientRect().right};
   });
   expect(sizes.scroll,view+' scroll at '+width).toBeLessThanOrEqual(sizes.client+1);
   expect(sizes.right,view+' container at '+width).toBeLessThanOrEqual(width+1);
  }
 }
});
