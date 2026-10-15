import test from 'node:test';
import assert from 'node:assert/strict';
import { diagnosticQuestions, gradeDiagnostic } from '../src/entities/study/index.js';
import { initialState, normalizeState } from '../src/entities/study/index.js';
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

test('draft diagnostic answers survive normalization without becoming a finished exam', () => {
 const s=initialState();
 s.diagnosticDrafts={N5:{step:2,answers:{'n5-1':0}},N3:{step:999,answers:{}}};
 const restored=normalizeState(s);
 assert.equal(restored.diagnosticDrafts.N5.step,2);
 assert.equal(restored.diagnosticDrafts.N3,undefined);
 assert.equal(restored.diagnosticHistory.length,0);
});
test('personal mock source survives backups without losing older entries', () => {
 const s=initialState();
 s.mocks=[{level:'N5',score:75,date:'2026-10-14',source:'Curso pessoal'},{level:'N5',score:55,date:'2026-10-01'}];
 const restored=normalizeState(s);
 assert.equal(restored.mocks[0].source,'Curso pessoal');
 assert.equal(restored.mocks[1].source,'');
});
