import test from 'node:test';
import assert from 'node:assert/strict';
import { initialState } from '../src/state.js';
import { nextGuidedAction } from '../src/learning.js';

test('iniciante recebe uma única próxima lição', () => {
  const state = initialState();
  const action = nextGuidedAction(state, 'N5');
  assert.equal(action.kind, 'learn');
  assert.equal(action.lesson.id, 'hiragana:0');
});

test('após estudar hiragana, próximo passo é checkpoint', () => {
  const state = initialState();
  for (const card of Object.values(state.cards)) if (card.type === 'Hiragana') card.seen = true;
  const action = nextGuidedAction(state, 'N5');
  assert.equal(action.kind, 'checkpoint');
  assert.equal(action.lesson.id, 'hiragana:0');
});

test('checkpoint aprovado libera próxima lição', () => {
  const state = initialState();
  state.checkpoints = { hiragana: { score: 80, date: '2026-10-12' } };
  const action = nextGuidedAction(state, 'N5');
  assert.equal(action.kind, 'learn');
  assert.equal(action.lesson.id, 'katakana:0');
});
