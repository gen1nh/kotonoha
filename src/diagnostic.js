import { CURRICULUM } from './curriculum.js';
import { N5_QUESTIONS } from './n5Questions.js';
export const DIAGNOSTIC_LEVELS = ['N5','N4','N3','N2','N1'];
export function diagnosticQuestions(level) {
  if (!DIAGNOSTIC_LEVELS.includes(level)) return [];
  if (level === 'N5') return N5_QUESTIONS.slice(0, 8);
  return CURRICULUM[level].flatMap(l => l.questions).filter(q => Array.isArray(q.choices) && Number.isInteger(q.answer)).slice(0, 8);
}
export function gradeDiagnostic(level, answers) {
  const questions = diagnosticQuestions(level);
  const correct = questions.filter(q => answers[q.id] === q.answer).length;
  const answered = questions.filter(q => Number.isInteger(answers[q.id])).length;
  return { level, correct, answered, total: questions.length, percent: questions.length ? Math.round(100 * correct / questions.length) : 0 };
}
