import React from 'react';
import {checkpointQuestions,checkpointScore,PASS_PERCENT,checkpointPassed} from '../checkpoints.js';
import {unitById} from '../courseUnits.js';
import {lessonsFor} from '../learning.js';
import {Button} from './ui/index.jsx';
/** Tentativa e respostas são persistidas, inclusive entre atualizações da PWA. */
export default function CheckpointPlayer({state,topic,update,go,openGuidedLesson}){
 const unit=unitById(topic);
 const key=`checkpoint:${topic}`;
 const attempt=state.attempts?.[key]||0;
 const answers=state.drafts?.[key]?.answers||{};
 const result=state.drafts?.[key]?.result??null;
 const questions=checkpointQuestions(state,topic,5,attempt);
 const ready=checkpointScore(questions,answers)!==null;
 const passed=checkpointPassed(state,topic);
 const next=lessonsFor('N5')[lessonsFor('N5').findIndex(l=>l.id===topic)+1];
 const answer=(id,value)=>update(s=>{s.drafts||={};s.drafts[key]={answers:{...(s.drafts[key]?.answers||{}),[id]:value},result:null};});
 const grade=()=>{const score=checkpointScore(questions,answers);if(score===null)return;update(s=>{
   s.drafts||={};s.drafts[key]={answers:{...answers},result:score};
   if(score>=PASS_PERCENT){s.checkpoints||={};const prev=s.checkpoints[topic];if(!prev||prev.score<score)s.checkpoints[topic]={score,date:new Date().toISOString()};}
 });};
 const retry=()=>update(s=>{s.attempts||={};s.attempts[key]=(s.attempts[key]||0)+1;delete s.drafts?.[key];});
 if(!unit)return <p role="alert">Checkpoint indisponível. <button onClick={()=>go('path')}>Voltar à Trilha</button></p>;
 return <div className="mx-auto max-w-2xl space-y-4 pb-8">
  <header className="rounded-3xl border border-line bg-paper p-5 space-y-2"><p className="font-black text-xs text-primary-strong">CHECKPOINT · N5</p><h1 className="text-2xl font-black text-ink-strong">{unit.title}</h1><p className="text-sm text-muted">Avaliação da microlição. Mínimo de {PASS_PERCENT}% para avançar. Seu rascunho é salvo automaticamente neste aparelho.</p></header>
  {questions.length<4?<p role="alert">Esta avaliação não tem perguntas suficientes. Retorne à Trilha.</p>:
   <section className="space-y-3" aria-label="Questões do checkpoint">{questions.map((q,i)=><fieldset key={q.id} disabled={result!==null} className="rounded-2xl border border-line bg-paper p-4 space-y-3"><legend className="sr-only">Questão {i+1}</legend><p className="text-xs font-black text-primary-strong">QUESTÃO {i+1} DE {questions.length}</p><p className="font-bold text-ink-strong">{q.prompt}</p><div className="space-y-2">{q.options.map(opt=><label key={opt} className={`min-h-12 flex items-center gap-3 rounded-xl border-2 p-3 cursor-pointer ${answers[q.id]===opt?'border-primary bg-accent-soft':'border-line bg-surface'}`}><input type="radio" name={`q-${q.id}`} checked={answers[q.id]===opt} onChange={()=>answer(q.id,opt)}/><span className="text-sm text-ink-strong">{opt}</span></label>)}</div>{result!==null&&<p className="text-sm text-muted">{answers[q.id]===q.answer?'✓ Correto':`Resposta correta: ${q.answer}`}</p>}</fieldset>)}</section>}
  {result!==null?<section role="status" className="rounded-3xl border-2 border-primary bg-paper p-5 space-y-3"><h2 className="text-xl font-black">{result>=PASS_PERCENT?'Checkpoint aprovado!':'Ainda não. Você pode tentar novamente.'}</h2><p className="text-sm">Resultado: {result}%. {result>=PASS_PERCENT?'Próxima microlição desbloqueada.':'Revise os erros acima. Uma nova tentativa altera a seleção de questões.'}</p>{result>=PASS_PERCENT?<Button variant="primary" className="w-full" onClick={()=>next?openGuidedLesson(next.id,'N5'):go('path')}>{next?'Próxima microlição →':'Voltar à Trilha →'}</Button>:<Button variant="primary" className="w-full" onClick={retry}>Tentar novamente</Button>}</section>:<Button variant="primary" size="lg" className="w-full" disabled={!ready||questions.length<4} onClick={grade}>Corrigir checkpoint</Button>}
  {passed&&result===null&&<p className="text-xs text-muted">Você já foi aprovado nesta etapa. Refazer não apaga sua aprovação.</p>}
  <button type="button" onClick={()=>go('path')} className="min-h-11 text-primary-strong font-bold">← Voltar à Trilha</button>
 </div>;
}
