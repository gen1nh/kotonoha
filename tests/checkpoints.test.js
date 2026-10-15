import test from 'node:test';
import assert from 'node:assert/strict';
import { initialState, normalizeState } from '../src/entities/study/index.js';
import { checkpointQuestions, checkpointScore, checkpointPassed, exposureComplete, explainCheckpointAnswer } from '../src/entities/study/index.js';
test('checkpoint requer respostas completas e 80% de acerto', () => {
 const state=initialState();
 const qs=checkpointQuestions(state,'hiragana');
 assert.equal(qs.length,5);
 assert.equal(checkpointScore(qs,{}),null);
 assert.equal(checkpointScore(qs,Object.fromEntries(qs.map(q=>[q.id,q.answer]))),100);
 assert.equal(checkpointPassed(state,'hiragana'),false);
});
test('checkpoint aprovado persiste em backup sem aceitar pontuação inválida',()=>{
 const state=initialState();state.checkpoints={hiragana:{score:80,date:'2026-10-12'},katakana:{score:999,date:'x'}};
 const restored=normalizeState(state);
 assert.equal(checkpointPassed(restored,'hiragana:0'),true);
 assert.equal(checkpointPassed(restored,'hiragana'),false); // Os sons novos não herdam aprovação antiga.
 assert.equal(restored.checkpoints.katakana,undefined);
});
test('visualização de cartões não equivale a checkpoint aprovado',()=>{
 const state=initialState();
 for(const card of Object.values(state.cards)) if(card.type==='Hiragana')card.seen=true;
 assert.equal(exposureComplete(state,'hiragana'),true);
 assert.equal(checkpointPassed(state,'hiragana'),false);
});

test('gramática exige checkpoint e oferece cinco questões com alternativas únicas',()=>{
 const state=initialState();state.lessons.grammar=true;
 const questions=checkpointQuestions(state,'grammar');
 assert.equal(questions.length,5);
 for(const question of questions){assert.ok(question.options.includes(question.answer));assert.equal(new Set(question.options).size,question.options.length)}
 assert.equal(checkpointPassed(state,'grammar'),false);
 assert.equal(exposureComplete(state,'grammar'),true);
});

test('feedback distingue alternativas parecidas sem mudar gabarito nem revelar durante a tentativa',()=>{
 const state=initialState();
 const ids=['hiragana:0','katakana:0','words:0','kanji:0'];
 for(const id of ids){
  const questions=checkpointQuestions(state,id);
  for(const q of questions){
   assert.ok(q.explanation?.length>15,`missing explanation: ${q.id}`);
   assert.equal(explainCheckpointAnswer(q,q.answer),q.explanation);
   const wrong=q.options.find(x=>x!==q.answer);
   const feedback=explainCheckpointAnswer(q,wrong);
   assert.ok(feedback.length>15);
   if(q.distractorContext?.[wrong])assert.ok(feedback.includes(q.distractorContext[wrong]));
   assert.equal(checkpointScore([q],{[q.id]:q.answer}),100);
  }
 }
});
test('gramática e atividades contextualizadas carregam explicação sem marcar itens aprovados',()=>{
 const state=initialState();
 for(const id of ['grammar:0','reading:0','listening:0']){
  for(const q of checkpointQuestions(state,id)) {
   assert.ok(q.explanation?.length>15,`explanation missing for ${q.id}`);
   assert.ok(q.options.includes(q.answer));
  }
 }
});

test('checkpoint de escuta mantém evidência de transcrição e modalidade no backup',()=>{
 const state=initialState();
 state.drafts['checkpoint:listening:0']={
  answers:{'n5-listening-01':'exemplo'},
  result:null,
  transcripts:['n5-listening-01','n5-listening-01'],
 };
 state.checkpoints['listening:0']={score:80,date:'2026-10-15',modality:'reading-fallback'};
 const restored=normalizeState(JSON.parse(JSON.stringify(state)));
 assert.deepEqual(restored.drafts['checkpoint:listening:0'].transcripts,['n5-listening-01']);
 assert.equal(restored.checkpoints['listening:0'].modality,'reading-fallback');
 const legacy=initialState();
 legacy.drafts['checkpoint:listening:0']={answers:{},result:null};
 assert.deepEqual(normalizeState(legacy).drafts['checkpoint:listening:0'].transcripts,[]);
 const corrupt=initialState();
 corrupt.checkpoints['listening:0']={score:80,date:'2026-10-15',modality:'official-certified'};
 assert.equal(normalizeState(corrupt).checkpoints['listening:0'].modality,undefined);
});
