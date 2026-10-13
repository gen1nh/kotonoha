import test from 'node:test';
import assert from 'node:assert/strict';
import { initialState,normalizeState } from '../src/state.js';
import { collectActivityChanges,dailyActivityCount,recordActivity } from '../src/dailyPlan.js';
import { courseLevel,nextGuidedAction } from '../src/learning.js';
import { guidedSamples,guidedLessonProgress } from '../src/lessonModel.js';
import { isAccessibleCheckpoint } from '../src/routeAccess.js';

const DAY='2026-10-13';
test('checkpoint aprovado conta exatamente uma atividade diária',()=>{
 const before=initialState();const after=structuredClone(before);
 after.checkpoints.hiragana={score:80,date:`${DAY}T10:00:00`};
 collectActivityChanges(before,after,DAY);
 assert.equal(dailyActivityCount(after,DAY),1);
 const retake=structuredClone(after);retake.checkpoints.hiragana={score:100,date:`${DAY}T11:00:00`};
 collectActivityChanges(after,retake,DAY);
 assert.equal(dailyActivityCount(retake,DAY),1);
 assert.deepEqual(retake.activityLog[DAY],['checkpoint:hiragana']);
});
test('desenho é prática, mas não equivale a revisão SRS ou unidade validada',()=>{
 const before=initialState(),after=structuredClone(before);
 after.lessons['draw:あ']=true;
 collectActivityChanges(before,after,DAY);
 assert.equal(dailyActivityCount(after,DAY),0);
 assert.equal(after.stats.reviews,0);
});
test('filtro superior não altera a jornada antes de concluir N5',()=>{
 const state=initialState();state.selectedLevel='N1';
 assert.equal(courseLevel(state),'N5');
 assert.equal(nextGuidedAction(state).lesson.id,'hiragana:0');
 for(const id of ['hiragana','katakana','words','grammar'])state.checkpoints[id]={score:80,date:DAY};
 assert.equal(courseLevel(state),'N5');
});
test('conteúdo para lições corresponde ao cartão e persiste por backup',()=>{
 const s=initialState();
 assert.equal(guidedSamples('hiragana').length,46);
 assert.equal(guidedSamples('katakana').length,46);
 assert.ok(guidedSamples('words').length>=15);
 assert.equal(guidedLessonProgress(s,'hiragana').studied,0);
 for(const card of Object.values(s.cards)) if(card.type==='Hiragana')card.seen=true;
 assert.equal(guidedLessonProgress(s,'hiragana').studied,46);
 assert.equal(isAccessibleCheckpoint(s,'hiragana:0'),true);
 assert.equal(guidedLessonProgress(normalizeState(s),'hiragana').studied,46);
});
test('registro de atividades da revisão não se duplica',()=>{
 const state=initialState();recordActivity(state,'review',DAY);recordActivity(state,'review',DAY);
 assert.equal(dailyActivityCount(state,DAY),1);
});

test('notas pessoais transformadas em flashcards sobrevivem a recarga e entram na revisão',()=>{
 const s=initialState();
 assert.deepEqual(s.notebook.notes,[]);
 s.cards['custom:1700']={id:'custom:1700',type:'Caderno Pessoal',prompt:'Minha palavra',answer:'Resposta',seen:true,reps:1,interval:1,ease:2.5,due:1};
 const restored=normalizeState(JSON.parse(JSON.stringify(s)));
 assert.equal(restored.cards['custom:1700'].prompt,'Minha palavra');
 assert.equal(restored.cards['custom:1700'].answer,'Resposta');
});

test('uma atividade nova acende ofensiva real e uma repetição não duplica',async ()=>{
 const before=initialState(), after=structuredClone(before);
 after.checkpoints.hiragana={score:80,date:new Date().toISOString()};
 collectActivityChanges(before,after);
 assert.equal(after.streak.days,1);
 assert.equal(after.streak.last, (await import('../src/state.js')).todayKey());
 const again=structuredClone(after);
 collectActivityChanges(after,again);
 assert.equal(again.streak.days,1);
});

test('progresso avançado exige aprovação sequencial e não um filtro',async ()=>{
 const { isAccessibleLesson }=await import('../src/routeAccess.js');
 const { CURRICULUM }=await import('../src/curriculum.js');
 const { advancedLessonScore }=await import('../src/lessonModel.js');
 const state=initialState();state.selectedLevel='N1';
 assert.equal(isAccessibleLesson(state,CURRICULUM.N4[0].id,'N4'),false);
 for(const id of ['hiragana','katakana','words','grammar'])state.checkpoints[id]={score:80,date:DAY};
 assert.equal(isAccessibleLesson(state,CURRICULUM.N4[0].id,'N4'),false);
 assert.equal(isAccessibleLesson(state,CURRICULUM.N4[1].id,'N4'),false);
 assert.equal(isAccessibleLesson(state,CURRICULUM.N3[0].id,'N3'),false);
 const first=CURRICULUM.N4[0];
 const answers=Object.fromEntries(first.questions.map(q=>[q.id,q.answer]));
 assert.equal(advancedLessonScore(first,answers),100);
 assert.equal(advancedLessonScore(first,{}),null);
 for(const l of CURRICULUM.N4)state.lessons[l.id]=true;
 assert.equal(isAccessibleLesson(state,CURRICULUM.N3[0].id,'N3'),false);
});
