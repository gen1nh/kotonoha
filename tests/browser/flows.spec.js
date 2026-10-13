import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {initialState,todayKey} from '../../src/state.js';
import {checkpointQuestions} from '../../src/checkpoints.js';
import {N5_UNITS,cardIdsForUnit} from '../../src/courseUnits.js';
const seeded=()=>{const state=initialState();state.onboardingCompleted=true;return state;};
async function enter(page,state=seeded()){
 await page.addInitScript(s=>{if(!localStorage.getItem('kotonoha.v1'))localStorage.setItem('kotonoha.v1',JSON.stringify(s));},state);
 await page.goto('/');
}
const tab=(page,label)=>page.getByRole('navigation',{name:'Navegação móvel'}).getByRole('button',{name:label});
test.use({viewport:{width:390,height:844}});

test('quatro destinos, uma transição por toque, retorno do navegador',async({page})=>{
 await enter(page);await expect(page.getByRole('navigation',{name:'Navegação móvel'}).getByRole('button')).toHaveCount(4);
 const before=await page.evaluate(()=>history.length);
 await tab(page,'Trilha').click();await expect(page.getByRole('heading',{name:'Trilha de aprendizagem'})).toBeVisible();
 expect(await page.evaluate(()=>history.length)).toBe(before+1);
 await page.goBack();await expect(page.getByRole('heading',{name:'Seu próximo passo'})).toBeVisible();
});

test('microlição → cartões → checkpoint → próxima microlição, sem abrir a Biblioteca',async({page})=>{
 const first=N5_UNITS[0],state=seeded();const questions=checkpointQuestions(state,first.id);
 await enter(page,state);await page.getByRole('button',{name:/Continuar aprendendo/}).first().click();
 await expect(page.getByRole('heading',{name:first.title})).toBeVisible();
 await expect(page.getByRole('navigation',{name:'Navegação móvel'})).toHaveCount(0);
 await page.getByRole('button',{name:/Praticar 6 cartões/}).click();
 for(let i=0;i<cardIdsForUnit(first).length;i++){
  await page.getByRole('button',{name:'Revelar resposta'}).click();
  await page.getByRole('button',{name:/Bom/}).click();
 }
 await expect(page.getByRole('button',{name:/Fazer checkpoint/})).toBeVisible();
 await page.getByRole('button',{name:/Fazer checkpoint/}).click();
 for(const [index,q] of questions.entries())await page.locator('fieldset').nth(index).getByRole('radio',{name:q.answer,exact:true}).check();
 await page.getByRole('button',{name:'Corrigir checkpoint'}).click();
 await expect(page.getByText('Checkpoint aprovado!')).toBeVisible();
 await page.getByRole('button',{name:/Próxima microlição/}).click();
 await expect(page.getByRole('heading',{name:N5_UNITS[1].title})).toBeVisible();
});

test('checkpoint retoma respostas após recarga e aprovação entra na meta diária',async({page})=>{
 const state=seeded(),first=N5_UNITS[0];for(const cid of cardIdsForUnit(first))state.cards[cid].seen=true;
 const question=checkpointQuestions(state,first.id)[0];await enter(page,state);
 await page.getByRole('button',{name:/Fazer checkpoint/}).first().click();
 await page.locator('fieldset').first().getByRole('radio',{name:question.answer,exact:true}).check();
 await page.reload();await expect(page.locator('fieldset').first().getByRole('radio',{name:question.answer,exact:true})).toBeChecked();
 const qs=checkpointQuestions(state,first.id);
 for(const [i,q] of qs.entries())await page.locator('fieldset').nth(i).getByRole('radio',{name:q.answer,exact:true}).check();
 await page.getByRole('button',{name:'Corrigir checkpoint'}).click();
 await expect(page.getByText('Checkpoint aprovado!',{exact:true})).toBeVisible();
 // Persistence is debounced; verify the saved activity after the write completes.
 await expect.poll(()=>page.evaluate(day=>JSON.parse(localStorage.getItem('kotonoha.v1')).activityLog[day]||[],todayKey())).toContain(`checkpoint:${first.id}`);
});

test('filtro N1 não desbloqueia laboratórios nem URLs',async({page})=>{
 const state=seeded();state.selectedLevel='N1';await enter(page,state);
 await page.goto('/?view=line');await expect(page.getByRole('heading',{name:'Praticar'})).toBeVisible();
 await page.getByText('Laboratórios opcionais').click();
 await expect(page.getByRole('button',{name:'Bloqueado'}).first()).toBeDisabled();
});

test('tema escuro, configurações e backup',async({page})=>{
 await enter(page);await page.getByRole('button',{name:'Abrir preferências'}).click();
 await page.getByRole('combobox',{name:'Tema visual'}).selectOption('dark');
 await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
 const download=page.waitForEvent('download');await page.getByRole('button',{name:'Exportar backup JSON'}).click();
 expect((await download).suggestedFilename()).toContain('kotonoha-backup');
});

test('caligrafia recebe toque no canvas sem interceptação',async({page})=>{
 await enter(page);await tab(page,'Praticar').click();
 await page.getByRole('button',{name:'Abrir ferramenta →'}).first().click();
 const canvas=page.locator('canvas[data-drawing-surface]').first();await canvas.scrollIntoViewIfNeeded();
 const r=await canvas.boundingBox();expect(r).not.toBeNull();
 const onTop=await canvas.evaluate(c=>document.elementFromPoint(c.getBoundingClientRect().left+c.clientWidth/2,c.getBoundingClientRect().top+c.clientHeight/2)===c);
 expect(onTop).toBe(true);
 await page.mouse.move(r.x+20,r.y+20);await page.mouse.down();await page.mouse.move(r.x+70,r.y+70,{steps:5});await page.mouse.up();
 await expect(page.getByRole('button',{name:/Desfazer/})).toBeEnabled();
});

test('responsividade e acessibilidade do fluxo mobile',async({page})=>{
 const errors=[];page.on('pageerror',err=>errors.push(err.message));await enter(page);
 for(const width of [320,375,390,430,768,1024]){
  await page.setViewportSize({width,height:844});
  for(const view of ['home','path','practice','progress']){
   await page.goto(view==='home'?'/':`/?view=${view}`);
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  }
 }
 await page.setViewportSize({width:390,height:844});await page.goto('/');
 const a11y=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
 expect(a11y.violations).toEqual([]);expect(errors).toEqual([]);
});

test('PWA principal continua acessível offline com service worker',async({page,context},testInfo)=>{
 test.skip(testInfo.project.name!=='chromium','Service workers offline: homologação automatizada em Chromium; Safari requer teste manual.');
 await enter(page);await page.evaluate(()=>navigator.serviceWorker.ready);
 await page.reload();await page.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));
 await context.setOffline(true);await page.reload();
 await expect(page.getByRole('heading',{name:'Seu próximo passo'})).toBeVisible();
});
