import test from 'node:test';
import assert from 'node:assert/strict';
import { initialState } from '../src/entities/study/index.js';
import { resolveView, viewFromSearch, hasUnlockedN4, isAccessibleLesson, isAccessibleCheckpoint } from '../src/entities/study/index.js';

const approvedN5 = () => {const s=initialState();for(const topic of ['hiragana','katakana','words','grammar'])s.checkpoints[topic]={score:80,date:'2026-10-13'};return s;};
test('mudar filtro para N4 não desbloqueia laboratórios ou URLs',()=>{
  const state=initialState();state.selectedLevel='N4';
  assert.deepEqual(resolveView('line',state),{view:'practice',blocked:true});
  assert.deepEqual(viewFromSearch('?view=pitch',state),{view:'practice',blocked:true});
  assert.equal(hasUnlockedN4(state),false);
});
test('checkpoints liberam laboratórios de prática, mas não certificação N5',()=>{
  const state=approvedN5();
  assert.equal(hasUnlockedN4(state),false);
  assert.deepEqual(resolveView('pitch',state),{view:'pitch',blocked:false});
  assert.deepEqual(resolveView('line',state),{view:'line',blocked:false});
});
test('lições e checkpoints não são acessíveis fora de ordem',()=>{
  const s=initialState();
  assert.equal(isAccessibleLesson(s,'hiragana:0'),true);
  assert.equal(isAccessibleLesson(s,'katakana:0'),false);
  assert.equal(isAccessibleCheckpoint(s,'hiragana:0'),false);
  for(const card of Object.values(s.cards)) if(card.type==='Hiragana') card.seen=true;
  assert.equal(isAccessibleCheckpoint(s,'hiragana:0'),true);
  s.checkpoints.hiragana={score:80,date:'2026-10-13'};
  assert.equal(isAccessibleLesson(s,'words:43'),true);
  assert.equal(isAccessibleLesson(s,'katakana:0'),false); // sons novos ainda não foram estudados
  assert.equal(isAccessibleLesson(s,'words:0'),false);
});
test('URLs legadas resolvem para uma única Trilha',()=>{
  assert.deepEqual(viewFromSearch('?view=jlpt',initialState()),{view:'path',blocked:false});
  assert.deepEqual(resolveView('paper',initialState()),{view:'path',blocked:false});
  assert.deepEqual(resolveView('desconhecida',initialState()),{view:'home',blocked:false});
});
