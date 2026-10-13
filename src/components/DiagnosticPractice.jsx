import React, { useState } from 'react';
import { diagnosticQuestions, gradeDiagnostic } from '../diagnostic.js';
import { Button, Card } from './ui/index.jsx';
export default function DiagnosticPractice({ level, update }) {
  const questions = diagnosticQuestions(level);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const result = gradeDiagnostic(level, answers);
  const finish = () => {
    update(s => { s.diagnosticHistory = [...(s.diagnosticHistory || []), { ...result, date: new Date().toISOString() }].slice(-30); });
    setSubmitted(true);
  };
  return <Card className="space-y-4" aria-labelledby="diagnostic-practice-title">
    <h3 id="diagnostic-practice-title" className="text-lg font-bold text-ink">Autoavaliação prática {level}</h3>
    <p className="text-sm text-muted">Questões autorais do currículo. Não é prova oficial nem determina aprovação no JLPT. Responda sem consultar materiais.</p>
    {questions.map((q, i) => <fieldset key={q.id} className="border border-line rounded-xl p-3 space-y-2" disabled={submitted}>
      <legend className="font-semibold text-ink px-1">{i + 1}. {q.prompt}</legend>
      {q.sentence && <p lang="ja" className="text-lg">{q.sentence}</p>}
      {q.choices.map((choice, j) => <label key={j} className="flex items-start gap-2 text-sm min-h-10 cursor-pointer"><input type="radio" name={`diag-${level}-${q.id}`} checked={answers[q.id] === j} onChange={() => setAnswers(a => ({...a, [q.id]: j}))} className="mt-1"/> <span>{choice}</span></label>)}
      {submitted && <p className="text-sm" role="status"><strong>{answers[q.id] === q.answer ? 'Correto.' : `Resposta correta: ${q.choices[q.answer]}.`}</strong> {q.explanation}</p>}
    </fieldset>)}
    {submitted ? <div aria-live="polite" className="space-y-2"><strong>{result.correct} de {result.total} corretas ({result.percent}%)</strong><p className="text-sm text-muted">Amostra pequena e não calibrada: use o resultado apenas para escolher assuntos a revisar.</p><Button variant="secondary" onClick={() => {setAnswers({});setSubmitted(false);}}>Refazer</Button></div> : <Button variant="primary" disabled={result.answered !== result.total || !result.total} onClick={finish}>Corrigir respostas ({result.answered}/{result.total})</Button>}
  </Card>;
}
