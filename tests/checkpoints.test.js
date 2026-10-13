import test from 'node:test';
import assert from 'node:assert/strict';
import { initialState, normalizeState } from '../src/state.js';
import { checkpointQuestions, checkpointScore, checkpointPassed, exposureComplete } from '../src/checkpoints.js';
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
