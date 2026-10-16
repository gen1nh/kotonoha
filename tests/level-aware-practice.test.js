import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState,normalizeState,selectReview,dailyChallenge,
 speedPracticePool,speedPracticeQuestion,listeningPracticePool,N5_UNITS} from '../src/entities/study/index.js';

test('iniciante não recebe conteúdo novo na revisão nem no desafio',()=>{
 const state=initialState();
 assert.deepEqual(selectReview(state),[]);
 assert.deepEqual(speedPracticePool(state),[]);
 assert.equal(dailyChallenge(state,'N5',new Date(2026,9,16)),null);
 for(const mode of ['hiragana','katakana','vocab']){
  assert.deepEqual(speedPracticePool(state,mode),[]);
 }
});

test('revisão vencida e desafio rápido respeitam o que foi estudado',()=>{
 const state=initialState();
 for(const key of ['hira:あ','hira:い','hira:う','hira:え','hira:お']){
  state.cards[key].seen=true;
  state.cards[key].due=0;
 }
 const studied=new Set(['hira:あ','hira:い','hira:う','hira:え','hira:お']);
 assert.deepEqual(new Set(selectReview(state)),studied);
 const pool=speedPracticePool(state,'hiragana');
 assert.equal(pool.length,5);
 assert.ok(pool.every(x=>studied.has(x.id)));
 assert.deepEqual(speedPracticePool(state,'katakana'),[]);
 const asked=[];
 for(let i=0;i<5;i++){
  const question=speedPracticeQuestion(pool,asked,()=>0);
  assert.ok(question);
  assert.ok(!asked.includes(question.id));
  assert.equal(new Set(question.choices).size,4);
  assert.ok(question.choices.includes(question.answer));
  asked.push(question.id);
 }
 assert.equal(new Set(asked).size,5);
});

test('desafio diário evolui com lições aprovadas, sem entregar futuras lições',()=>{
 const state=initialState(),first=N5_UNITS[0];
 state.checkpoints[first.id]={score:100,date:'2026-10-16'};
 const questions=Array.from({length:5},(_,i)=>dailyChallenge(state,'N5',new Date(2026,9,16+i)));
 assert.ok(questions.every(Boolean));
 assert.ok(new Set(questions.map(q=>q.id)).size>1);
 assert.ok(questions.every(q=>q.choices.includes(q.choices[q.answer])));
 const chosen=questions[0];
 const key='2026-10-16:N5';
 state.dailyQuestionIds[key]=chosen.id;
 state.dailyAnswers[key]=chosen.answer;
 const second=N5_UNITS[1];
 state.checkpoints[second.id]={score:100,date:'2026-10-16'};
 assert.equal(dailyChallenge(state,'N5',new Date(2026,9,16)).id,chosen.id);
 const restored=normalizeState(JSON.parse(JSON.stringify(state)));
 assert.equal(dailyChallenge(restored,'N5',new Date(2026,9,16)).id,chosen.id);
 assert.deepEqual(restored.dailyQuestionIds,{[key]:chosen.id});
});

test('escuta opcional só contém caracteres já vistos ou situações de lições praticadas',()=>{
 const state=initialState();
 assert.deepEqual(listeningPracticePool(state),[]);
 for(const key of ['hira:あ','hira:い','hira:う','hira:え','hira:お'])state.cards[key].seen=true;
 const beginner=listeningPracticePool(state);
 assert.equal(beginner.length,5);
 assert.ok(beginner.every(q=>q.id.startsWith('heard:hira:')));
 assert.ok(beginner.every(q=>q.choices.length===4&&q.choices[q.answerIndex]));
 const first=N5_UNITS.find(unit=>unit.kind==='listening');
 const second=N5_UNITS.filter(unit=>unit.kind==='listening')[1];
 state.lessons[first.id]=true;
 const advanced=listeningPracticePool(state);
 assert.equal(advanced.length,beginner.length+first.items.length);
 assert.ok(first.items.every(q=>advanced.some(item=>item.id===q.id)));
 assert.ok(!advanced.some(q=>second.items.some(item=>item.id===q.id)));
});
