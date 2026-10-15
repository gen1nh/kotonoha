import React, { useState } from 'react';
import { diagnosticQuestions, gradeDiagnostic } from '../../../entities/study/index.js';
import { Button, Card } from '../../../shared/ui/index.jsx';

/** Questão por vez, correção apenas após concluir; sem gabarito durante a escolha. */
export default function DiagnosticPractice({ level, update }) {
  const questions = diagnosticQuestions(level);
  const [answers, setAnswers] = useState({});
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const result = gradeDiagnostic(level, answers);
  const item = questions[step];
  const finish = () => {
    if (result.answered !== result.total || !result.total) return;
    update(s => {
      s.diagnosticHistory = [
        ...(s.diagnosticHistory || []),
        { ...result, date: new Date().toISOString() },
      ].slice(-30);
    });
    setSubmitted(true);
  };
  const retry = () => { setAnswers({}); setStep(0); setSubmitted(false); };

  if (!questions.length) return <Card><p className="text-sm text-muted">Ainda não há questões disponíveis neste nível.</p></Card>;
  return <Card className="space-y-4" aria-labelledby="diagnostic-practice-title">
    <div className="space-y-2">
      <h3 id="diagnostic-practice-title" className="text-lg font-bold text-ink-strong">Autoavaliação {level}</h3>
      <p className="text-xs text-muted">Questões de prática, não uma prova oficial. O resultado aparece apenas no final.</p>
    </div>
    {submitted ? <div className="space-y-3" role="status">
      <p className="text-2xl font-black text-ink-strong">{result.correct} de {result.total} acertos</p>
      <p className="text-sm text-muted">{result.percent}% nesta tentativa. Use o resultado para descobrir o que revisar.</p>
      <details className="rounded-xl border border-line p-3">
        <summary className="min-h-11 cursor-pointer font-bold text-ink-strong">Conferir respostas</summary>
        <div className="space-y-3 pt-3">{questions.map((q,i)=><div key={q.id} className="border-b border-line pb-3 space-y-1 text-sm">
          <p className="font-bold text-ink-strong">{i+1}. {q.prompt}</p>
          <p className="text-muted">Você marcou: {q.choices[answers[q.id]]}</p>
          <p className="text-primary-strong">Correto: {q.choices[q.answer]}</p>
          <p className="text-muted">{q.explanation}</p>
        </div>)}</div>
      </details>
      <Button variant="primary" className="w-full" onClick={retry}>Refazer prática</Button>
    </div> : <>
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2 text-sm">
          <strong className="text-ink-strong">Questão {step+1} de {questions.length}</strong>
          <span className="text-muted">{result.answered} respondidas</span>
        </div>
        <div role="progressbar" aria-label="Progresso da autoavaliação" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={step+1} className="h-2 rounded-full bg-raised overflow-hidden">
          <div className="h-full bg-primary" style={{width:`${100*(step+1)/questions.length}%`}} />
        </div>
      </div>
      <fieldset className="space-y-3">
        <legend className="font-bold text-ink-strong">{item.prompt}</legend>
        {item.sentence&&<p lang="ja" className="font-jp text-xl rounded-xl bg-raised p-4">{item.sentence}</p>}
        {item.choices.map((choice,j)=><label key={j} className="min-h-12 flex items-center gap-3 cursor-pointer rounded-xl border border-line p-3 text-sm text-ink-strong">
          <input type="radio" name={`diagnostic-${item.id}`} checked={answers[item.id]===j} onChange={()=>setAnswers(a=>({...a,[item.id]:j}))} />
          <span>{choice}</span>
        </label>)}
      </fieldset>
      <div className="flex gap-3">
        <Button variant="secondary" disabled={step===0} onClick={()=>setStep(i=>Math.max(0,i-1))}>Anterior</Button>
        {step<questions.length-1
          ? <Button variant="primary" className="flex-1" disabled={answers[item.id]===undefined} onClick={()=>setStep(i=>i+1)}>Próxima questão →</Button>
          : <Button variant="primary" className="flex-1" disabled={result.answered!==questions.length} onClick={finish}>Finalizar e ver resultado</Button>}
      </div>
    </>}
  </Card>;
}
