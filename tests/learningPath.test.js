import test from 'node:test';
import assert from 'node:assert/strict';
import { lessonsFor, isDone } from '../src/entities/study/index.js';

test('N5 guia hiragana antes de katakana, vocabulário e gramática', () => {
  assert.deepEqual([...new Set(lessonsFor('N5').map(l=>l.topic))], ['hiragana','katakana','words','kanji','grammar','reading','listening']);
  assert.ok(lessonsFor('N5').length>20); // Microlições, não quatro blocos enormes.
});
test('conclusão de hiragana não desbloqueia katakana automaticamente', () => {
  const state = { lessons: {}, cards: {
    a: {type:'Hiragana',seen:true},
    b: {type:'Katakana',seen:false},
    c: {type:'Vocabulário N5',seen:false},
  }};
  const lessons=lessonsFor('N5');
  assert.equal(isDone(state,'N5',lessons[0]),false); // visualizar não basta
  state.checkpoints = {hiragana: {score: 80, date: "2026-10-12"}};
  assert.equal(isDone(state,'N5',lessons[0]),true);
  assert.equal(isDone(state,'N5',lessons.find(l=>l.topic==='katakana')),false);
});
