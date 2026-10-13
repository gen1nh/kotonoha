import test from 'node:test';
import assert from 'node:assert/strict';
import { N5_QUESTIONS } from '../src/n5Questions.js';
import { diagnosticQuestions, gradeDiagnostic } from '../src/diagnostic.js';
test('N5 question bank contains distinct, explained items', () => {
 assert.ok(N5_QUESTIONS.length >= 12);
 assert.equal(new Set(N5_QUESTIONS.map(q => q.id)).size, N5_QUESTIONS.length);
 for(const q of N5_QUESTIONS){
  assert.ok(q.explanation.length > 12);
  assert.ok(q.choices.length >= 3);
  assert.ok(q.answer >= 0 && q.answer < q.choices.length);
 }
});
test('N5 diagnostic samples more than one item and grades all correct', () => {
 const questions = diagnosticQuestions('N5');
 assert.ok(questions.length >= 8);
 const answers = Object.fromEntries(questions.map(q => [q.id,q.answer]));
 const grade = gradeDiagnostic('N5', answers);
 assert.equal(grade.correct,questions.length);
 assert.equal(grade.percent,100);
});
