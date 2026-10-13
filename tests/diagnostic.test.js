import test from 'node:test';
import assert from 'node:assert/strict';
import { diagnosticQuestions, gradeDiagnostic } from '../src/diagnostic.js';
import { initialState, normalizeState } from '../src/state.js';
test('diagnostic questions contain valid answer indices', () => {
 for (const level of ['N5','N4','N3','N2','N1']) for (const q of diagnosticQuestions(level)) {
  assert.ok(q.choices.length >= 2);
  assert.ok(q.answer >= 0 && q.answer < q.choices.length);
 }
});
test('grading distinguishes unanswered from incorrect', () => {
 const q = diagnosticQuestions('N4')[0];
 const r = gradeDiagnostic('N4', { [q.id]: q.answer });
 assert.equal(r.correct, 1); assert.equal(r.answered, 1);
});
test('diagnostic history survives backup normalization and discards invalid entries', () => {
 const state = initialState();
 state.diagnosticHistory = [{ level: 'N5', correct: 1, total: 1, date: new Date().toISOString() }, {level:'N5',correct:200,total:1,date:'no'}];
 assert.equal(normalizeState(state).diagnosticHistory.length, 1);
});
