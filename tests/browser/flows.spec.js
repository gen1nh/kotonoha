import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {initialState,todayKey} from '../../src/entities/study/index.js';
import {checkpointQuestions} from '../../src/entities/study/index.js';
import {N5_UNITS,cardIdsForUnit} from '../../src/entities/study/index.js';
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
 await expect(page.getByRole('button',{name:/Praticar 6 cartões/})).toBeHidden();
 await expect(page.getByRole('heading',{name:'Digite em japonês'})).toBeHidden();
 await page.getByRole('button',{name:/Entendi · começar a prática/}).click();
 await page.getByRole('button',{name:/Praticar 6 cartões/}).click();
 for(let i=0;i<cardIdsForUnit(first).length;i++){
  await page.getByRole('button',{name:'Revelar resposta'}).click();
  await page.getByRole('button',{name:/Bom/}).click();
 }
 await expect(page.getByRole('button',{name:/Fazer checkpoint/})).toBeVisible();
 await page.getByRole('button',{name:/Fazer checkpoint/}).click();
 for(const [index,q] of questions.entries()){
  await expect(page.locator('fieldset')).toHaveCount(1);
  await page.locator('fieldset').first().getByRole('radio',{name:q.answer,exact:true}).check();
  if(index<questions.length-1)await page.getByRole('button',{name:'Próxima questão →'}).click();
 }
 await page.getByRole('button',{name:'Finalizar e conferir respostas'}).click();
 await expect(page.getByText('Checkpoint aprovado!')).toBeVisible();
 await expect(page.getByText('QUESTÃO 1 DE '+questions.length,{exact:true})).toBeVisible();
 await expect(page.getByText('Você acertou esta questão.',{exact:false})).toBeVisible();
 await page.getByRole('button',{name:'Próxima resposta →'}).click();
 await expect(page.getByText('QUESTÃO 2 DE '+questions.length,{exact:true})).toBeVisible();
 await page.getByRole('button',{name:/Próxima microlição/}).click();
 await expect(page.getByRole('heading',{name:N5_UNITS[1].title})).toBeVisible();
});

test('checkpoint retoma respostas após recarga e aprovação entra na meta diária',async({page})=>{
 const state=seeded(),first=N5_UNITS[0];for(const cid of cardIdsForUnit(first))state.cards[cid].seen=true;
 const question=checkpointQuestions(state,first.id)[0];await enter(page,state);
 await page.getByRole('button',{name:/Fazer checkpoint/}).first().click();
 await page.locator('fieldset').first().getByRole('radio',{name:question.answer,exact:true}).check();
 await page.reload();
 const qs=checkpointQuestions(state,first.id);
 await expect(page.getByText(`QUESTÃO 2 DE ${qs.length}`,{exact:true})).toBeVisible();
 await page.getByRole('button',{name:'← Anterior'}).click();
 await expect(page.locator('fieldset').first().getByRole('radio',{name:question.answer,exact:true})).toBeChecked();
 await page.getByRole('button',{name:'Próxima questão →'}).click();
 for(let i=1;i<qs.length;i++){
  const q=qs[i];
  await page.locator('fieldset').first().getByRole('radio',{name:q.answer,exact:true}).check();
  if(i<qs.length-1)await page.getByRole('button',{name:'Próxima questão →'}).click();
 }
 await page.getByRole('button',{name:'Finalizar e conferir respostas'}).click();
 await expect(page.getByText('Checkpoint aprovado!',{exact:true})).toBeVisible();
 // Persistence is debounced; verify the saved activity after the write completes.
 await expect.poll(()=>page.evaluate(day=>JSON.parse(localStorage.getItem('kotonoha.v1')).activityLog[day]||[],todayKey())).toContain(`checkpoint:${first.id}`);
});

test('trilha destaca etapa atual e digitação só aparece como treino opcional',async({page})=>{
 await enter(page);await tab(page,'Trilha').click();
 const stage=page.locator('details').filter({has:page.getByRole('heading',{name:'Primeiros passos',exact:true})}).first();
 await expect(stage).toHaveAttribute('open','');
 await expect(page.getByText('Ler hiragana básico e reconhecer cumprimentos e frases de apresentação.',{exact:false})).toBeVisible();
 await tab(page,'Praticar').click();
 await expect(page.getByRole('heading',{name:'Digite em japonês'})).toBeHidden();
 await page.getByRole('button',{name:'Digitação japonesa'}).click();
 await expect(page.getByRole('heading',{name:'Digite em japonês'})).toBeVisible();
 await expect(page.getByRole('combobox',{name:'Conteúdo já disponível na sua Trilha'}).locator('option')).toHaveCount(1);
 await page.getByRole('textbox',{name:'Digite a leitura deste item'}).fill('a');
 await page.getByRole('button',{name:'Conferir resposta'}).click();
 await expect(page.getByText('Correto!',{exact:true})).toBeVisible();
});

test('gramática separa explicação de prática e permite consultar sem perder resposta',async({page})=>{
 const state=seeded(),unit=N5_UNITS.find(u=>u.kind==='grammar');
 for(const previous of N5_UNITS.slice(0,N5_UNITS.indexOf(unit)))state.checkpoints[previous.id]={score:100,date:new Date().toISOString()};
 await enter(page,state);await page.goto(`/?view=lesson&topic=${encodeURIComponent(unit.id)}&level=N5`);
 await expect(page.getByRole('radio')).toHaveCount(0);
 await page.getByRole('button',{name:/Entendi · começar a prática/}).click();
 await expect(page.getByRole('button',{name:/Concluir prática/})).toBeDisabled();
 await page.getByRole('radio',{name:unit.items[0].meaning,exact:true}).check();
 await page.getByRole('button',{name:'Consultar explicação e exemplos'}).click();
 await page.getByRole('button',{name:/Entendi · começar a prática/}).click();
 await expect(page.getByRole('radio',{name:unit.items[0].meaning,exact:true})).toBeChecked();
 await expect(page.getByRole('button',{name:/Concluir prática/})).toBeDisabled();
 await expect(page.getByText('Correto! Você reconheceu o significado.')).toHaveCount(0);
 await page.getByRole('button',{name:'Conferir resposta'}).click();
 await expect(page.getByText('Correto! Você reconheceu o significado.')).toBeVisible();
 await page.getByRole('button',{name:/Concluir prática/}).click();
 await expect(page.getByRole('button',{name:/Fazer checkpoint/})).toBeVisible();
});

for(const kind of ['reading','listening'])test(`${kind}: um exemplo por vez antes de confirmar o estudo`,async({page})=>{
 const state=seeded(),unit=N5_UNITS.find(u=>u.kind===kind);
 for(const previous of N5_UNITS.slice(0,N5_UNITS.indexOf(unit)))state.checkpoints[previous.id]={score:100,date:new Date().toISOString()};
 await enter(page,state);await page.goto(`/?view=lesson&topic=${encodeURIComponent(unit.id)}&level=N5`);
 await expect(page.locator('article')).toHaveCount(1);
 await expect(page.getByRole('button',{name:/Estudei os exemplos/})).toHaveCount(0);
 await expect(page.getByRole('button',{name:'Exemplo anterior'})).toBeDisabled();
 for(let i=1;i<unit.items.length;i++)await page.getByRole('button',{name:/Próximo exemplo/}).click();
 await expect(page.getByText(`EXEMPLO ${unit.items.length} DE ${unit.items.length}`,{exact:true})).toBeVisible();
 await page.getByRole('button',{name:/Estudei os exemplos/}).click();
 await expect(page.getByRole('button',{name:/Fazer checkpoint/})).toBeVisible();
});

test('filtro N1 não desbloqueia laboratórios nem URLs',async({page})=>{
 const state=seeded();state.selectedLevel='N1';await enter(page,state);
 await page.goto('/?view=line');await expect(page.getByRole('heading',{name:'Praticar'})).toBeVisible();
 await page.getByRole('button',{name:'Laboratórios'}).click();
 await expect(page.getByRole('button',{name:'Conversação'})).toBeDisabled();
 await expect(page.getByRole('button',{name:'Pronúncia'})).toBeDisabled();
});

test('tema escuro, configurações e backup',async({page})=>{
 await enter(page);await page.getByRole('button',{name:'Abrir preferências'}).click();
 await page.getByRole('button',{name:'Aparência'}).click();
 await page.getByRole('combobox',{name:'Tema visual'}).selectOption('dark');
 await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
 await page.getByRole('button',{name:/Voltar às preferências/}).click();
 await page.getByRole('button',{name:'Conta e backups'}).click();
 const download=page.waitForEvent('download');await page.getByRole('button',{name:'Exportar backup JSON'}).click();
 expect((await download).suggestedFilename()).toContain('kotonoha-backup');
});

test('caligrafia recebe toque no canvas sem interceptação',async({page})=>{
 await enter(page);await tab(page,'Praticar').click();
 await page.getByRole('button',{name:/Consultar Biblioteca e Caderno/}).click();
 await page.getByRole('button',{name:'Biblioteca'}).click();
 await page.getByRole('button',{name:'Hiragana'}).click();
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
 for(const name of ['correct','incorrect','complete']) {
   const bytes=await page.evaluate(async name=>{const response=await fetch(`/audio/${name}.wav`);if(!response.ok)return 0;return (await response.arrayBuffer()).byteLength;},name);
   expect(bytes).toBeGreaterThan(1000);
 }
});

test('escuta: revelar transcrição continua marcado após recarga e gera evidência de leitura',async({page})=>{
 const state=seeded(),unit=N5_UNITS.find(u=>u.kind==='listening');
 for(const previous of N5_UNITS.slice(0,N5_UNITS.indexOf(unit)))state.checkpoints[previous.id]={score:100,date:'2026-10-15'};
 state.lessons[unit.id]=true;
 const questions=checkpointQuestions(state,unit.id);
 await enter(page,state);
 await page.goto(`/?view=checkpoint&topic=${encodeURIComponent(unit.id)}&level=N5`);
 await expect(page.getByRole('heading',{name:unit.title})).toBeVisible();
 await page.getByRole('button',{name:/mostrar texto/i}).click();
 await expect(page.locator('fieldset [lang="ja"]')).toBeVisible();
 await expect.poll(()=>page.evaluate(key=>JSON.parse(localStorage.getItem('kotonoha.v1')).drafts[key]?.transcripts||[],`checkpoint:${unit.id}`)).toContain(questions[0].id);
 await page.reload();
 await expect(page.locator('fieldset [lang="ja"]')).toBeVisible();
 for(const [i,q] of questions.entries()){
  await page.locator('fieldset').first().getByRole('radio',{name:q.answer,exact:true}).check();
  if(i>0)await page.getByRole('button',{name:/mostrar texto/i}).click();
  if(i<questions.length-1)await page.getByRole('button',{name:'Próxima questão →'}).click();
 }
 await page.getByRole('button',{name:'Finalizar e conferir respostas'}).click();
 await expect(page.getByText('Checkpoint aprovado!',{exact:true})).toBeVisible();
 await expect.poll(()=>page.evaluate(id=>JSON.parse(localStorage.getItem('kotonoha.v1')).checkpoints[id]?.modality,unit.id)).toBe('reading-fallback');
});

test('escuta não aprova alternativas sem áudio ou leitura e permite fallback honesto',async({page})=>{
 const state=seeded(),unit=N5_UNITS.find(u=>u.kind==='listening');
 for(const previous of N5_UNITS.slice(0,N5_UNITS.indexOf(unit)))state.checkpoints[previous.id]={score:100,date:'2026-10-15'};
 state.lessons[unit.id]=true;
 const qs=checkpointQuestions(state,unit.id);
 await enter(page,state);
 await page.goto(`/?view=checkpoint&topic=${encodeURIComponent(unit.id)}&level=N5`);
 for(let i=0;i<qs.length;i++){
  await page.locator('fieldset').getByRole('radio',{name:qs[i].answer,exact:true}).check();
  if(i<qs.length-1)await expect(page.getByRole('button',{name:'Próxima questão →'})).toBeDisabled();
  else await expect(page.getByRole('button',{name:'Finalizar e conferir respostas'})).toBeDisabled();
  await page.getByRole('button',{name:/mostrar texto/i}).click();
  if(i<qs.length-1)await page.getByRole('button',{name:'Próxima questão →'}).click();
 }
 await expect(page.getByRole('button',{name:'Finalizar e conferir respostas'})).toBeEnabled();
 await page.reload();
 // All answers and disclosed transcripts survive reload; the completed draft resumes at its last question.
 await expect(page.getByText(`QUESTÃO ${qs.length} DE ${qs.length}`,{exact:true})).toBeVisible();
 await expect(page.locator('fieldset [lang="ja"]')).toBeVisible();
 await expect(page.getByRole('button',{name:'Finalizar e conferir respostas'})).toBeEnabled();
 await page.getByRole('button',{name:'Finalizar e conferir respostas'}).click();
 await expect(page.getByText('Checkpoint aprovado!',{exact:true})).toBeVisible();
 await expect.poll(()=>page.evaluate(id=>JSON.parse(localStorage.getItem('kotonoha.v1')).checkpoints[id]?.modality,unit.id)).toBe('reading-fallback');
});

test('checkpoint retomado abre a primeira questão pendente sem perder respostas',async({page})=>{
 const state=seeded(),unit=N5_UNITS[0];
 for(const id of cardIdsForUnit(unit))state.cards[id].seen=true;
 const questions=checkpointQuestions(state,unit.id);
 state.drafts[`checkpoint:${unit.id}`]={
  answers:{[questions[0].id]:questions[0].answer,[questions[1].id]:questions[1].answer},
  result:null,
 };
 await enter(page,state);
 await page.goto(`/?view=checkpoint&topic=${encodeURIComponent(unit.id)}&level=N5`);
 await expect(page.getByText(`QUESTÃO 3 DE ${questions.length}`,{exact:true})).toBeVisible();
 await page.reload();
 await expect(page.getByText(`QUESTÃO 3 DE ${questions.length}`,{exact:true})).toBeVisible();
 await page.getByRole('button',{name:'← Anterior'}).click();
 await expect(page.locator('fieldset').getByRole('radio',{name:questions[1].answer,exact:true})).toBeChecked();
});
