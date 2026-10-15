import { playSound } from '../../../shared/audio/index.js';
import React,{useState,useEffect} from 'react';
import {speakJapanese} from '../../../entities/study/index.js';
import {checkpointQuestions,checkpointScore,PASS_PERCENT,checkpointPassed} from '../../../entities/study/index.js';
import {unitById} from '../../../entities/study/index.js';
import {lessonsFor} from '../../../entities/study/index.js';
import {Button} from '../../../shared/ui/index.jsx';
import {useReadingPreferences,AudioRateControl} from '../../../entities/study/index.js';
/** Tentativa e respostas são persistidas, inclusive entre atualizações da PWA. */
export default function CheckpointPlayer({state,topic,update,go,openGuidedLesson}){
 const [activeQuestion,setActiveQuestion]=useState(0);
 const readingPreferences=useReadingPreferences();
 const [speechRate,setSpeechRate]=useState(()=>readingPreferences.speechRate);
 const [revealed,setRevealed]=useState({});
 useEffect(()=>{setActiveQuestion(0);setRevealed({});setPlayed({});},[topic]);
 const [played,setPlayed]=useState({});
 const [audioNotice,setAudioNotice]=useState('');
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
 const grade=()=>{const score=checkpointScore(questions,answers);if(score===null)return;playSound(score>=PASS_PERCENT?'complete':'incorrect');update(s=>{
   s.drafts||={};s.drafts[key]={answers:{...answers},result:score};
   if(score>=PASS_PERCENT){s.checkpoints||={};const prev=s.checkpoints[topic];if(!prev||prev.score<score)s.checkpoints[topic]={score,date:new Date().toISOString(),...(unit.kind==='listening'?{modality:Object.keys(revealed).length?'reading-fallback':Object.keys(played).length===questions.length?'synthetic-listening':'unverified-audio'}:{})};}
 });};
 const retry=()=>{setPlayed({});setRevealed({});setAudioNotice('');update(s=>{s.attempts||={};s.attempts[key]=(s.attempts[key]||0)+1;delete s.drafts?.[key];});};
 if(!unit)return <p role="alert">Checkpoint indisponível. <button onClick={()=>go('path')}>Voltar à Trilha</button></p>;
 return <div className="mx-auto max-w-2xl space-y-4 pb-8">
  <header className="rounded-3xl border border-line bg-paper p-5 space-y-2"><p className="font-black text-xs text-primary-strong">CHECKPOINT · N5</p><h1 className="text-2xl font-black text-ink-strong">{unit.title}</h1><p className="text-sm text-muted">Avaliação da microlição. Mínimo de {PASS_PERCENT}% para avançar. Seu rascunho é salvo automaticamente neste aparelho.</p></header>
  {questions.length>=4&&<div className="rounded-2xl border border-line bg-paper p-4 space-y-3" aria-label="Progresso do checkpoint">
    <div className="flex items-center justify-between gap-3"><span className="text-sm font-bold text-ink-strong">Questão {activeQuestion+1} de {questions.length}</span><span className="text-xs text-muted">{questions.filter(q=>answers[q.id]!==undefined).length} respondidas</span></div>
    <div role="progressbar" aria-label="Questão atual" aria-valuemin={1} aria-valuemax={questions.length} aria-valuenow={activeQuestion+1} className="h-2 overflow-hidden rounded-full bg-raised"><div className="h-full rounded-full bg-primary" style={{width:`${100*(activeQuestion+1)/questions.length}%`}}/></div>
    <p className="text-xs text-muted">Responda uma questão por vez. O resultado aparece somente após finalizar.</p>
  </div>}
  {questions.length<4?<p role="alert">Esta avaliação não tem perguntas suficientes. Retorne à Trilha.</p>:
   <section className="space-y-3" aria-label="Questões do checkpoint">{questions.map((q,i)=>i!==activeQuestion?null:<fieldset key={q.id} disabled={result!==null} className="rounded-2xl border border-line bg-paper p-4 space-y-3"><legend className="sr-only">Questão {i+1}</legend><p className="text-xs font-black text-primary-strong">QUESTÃO {i+1} DE {questions.length}</p><p className="font-bold text-ink-strong">{q.prompt}</p>
    {q.text&&<p lang="ja" className="font-jp text-lg rounded-xl bg-raised p-3">{q.text}</p>}
    {q.spokenText&&<div className="rounded-xl bg-raised p-3 space-y-2">
      <button type="button" disabled={result!==null} onClick={()=>speakJapanese(q.spokenText,setAudioNotice,{rate:speechRate,onStart:()=>setPlayed(old=>({...old,[q.id]:true}))})} className="min-h-11 rounded-xl border border-line px-4 text-sm font-bold">▶ Ouvir frase</button>
      <AudioRateControl rate={speechRate} onChange={setSpeechRate}/>
      <button type="button" disabled={result!==null} onClick={()=>setRevealed(old=>({...old,[q.id]:true}))} className="block min-h-10 text-xs underline text-primary-strong font-bold">Não consegui ouvir · mostrar texto</button>
      {(revealed[q.id]||result!==null)&&<p lang="ja" className="font-jp text-lg">{q.spokenText}</p>}
      <p className="text-xs text-muted">Se consultar o texto, o resultado será registrado como prática de leitura, não como evidência auditiva.</p>
    </div>}
    <div className="space-y-2">{q.options.map(opt=><label key={opt} className={`min-h-12 flex items-center gap-3 rounded-xl border-2 p-3 cursor-pointer ${answers[q.id]===opt?'border-primary bg-accent-soft':'border-line bg-surface'}`}><input type="radio" name={`q-${q.id}`} checked={answers[q.id]===opt} onChange={()=>answer(q.id,opt)}/><span className="text-sm text-ink-strong">{opt}</span></label>)}</div>{result!==null&&<p className="text-sm text-muted">{answers[q.id]===q.answer?'✓ Correto':`Resposta correta: ${q.answer}`} {q.explanation||''}</p>}</fieldset>)}</section>}
  {questions.length>=4&&<nav aria-label="Navegar entre questões" className="flex items-center gap-3">
    <Button variant="secondary" disabled={activeQuestion===0} onClick={()=>setActiveQuestion(n=>Math.max(0,n-1))}>← Anterior</Button>
    {activeQuestion<questions.length-1&&<Button variant="primary" className="flex-1" disabled={answers[questions[activeQuestion]?.id]===undefined} onClick={()=>setActiveQuestion(n=>Math.min(questions.length-1,n+1))}>Próxima questão →</Button>}
  </nav>}
  {audioNotice&&<p role="alert" className="text-sm text-muted">{audioNotice}</p>}
  {result!==null?<section role="status" className="rounded-3xl border-2 border-primary bg-paper p-5 space-y-3"><h2 className="text-xl font-black">{result>=PASS_PERCENT?'Checkpoint aprovado!':'Ainda não. Você pode tentar novamente.'}</h2><p className="text-sm">Resultado: {result}%. {result>=PASS_PERCENT?'Próxima microlição desbloqueada.':'Revise os erros acima. Uma nova tentativa altera a seleção de questões.'} {unit.kind==='listening'?'A voz sintetizada e a leitura alternativa não substituem uma avaliação auditiva oficial.':''}</p>{result>=PASS_PERCENT?<Button variant="primary" className="w-full" onClick={()=>next?openGuidedLesson(next.id,'N5'):go('path')}>{next?'Próxima microlição →':'Voltar à Trilha →'}</Button>:<Button variant="primary" className="w-full" onClick={retry}>Tentar novamente</Button>}</section>:<Button variant="primary" size="lg" className="w-full" disabled={!ready||questions.length<4||activeQuestion!==questions.length-1} onClick={grade}>Finalizar e conferir respostas</Button>}
  {passed&&result===null&&<p className="text-xs text-muted">Você já foi aprovado nesta etapa. Refazer não apaga sua aprovação.</p>}
  <button type="button" onClick={()=>go('path')} className="min-h-11 text-primary-strong font-bold">← Voltar à Trilha</button>
 </div>;
}
