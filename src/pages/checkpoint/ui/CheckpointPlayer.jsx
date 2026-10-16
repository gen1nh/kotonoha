import { playSound } from '../../../shared/audio/index.js';
import React,{useState,useEffect} from 'react';
import {speakJapanese} from '../../../entities/study/index.js';
import {checkpointQuestions,checkpointScore,PASS_PERCENT,checkpointPassed,explainCheckpointAnswer} from '../../../entities/study/index.js';
import {unitById} from '../../../entities/study/index.js';
import {lessonsFor} from '../../../entities/study/index.js';
import {Button,AudioRateControl} from '../../../shared/ui/index.jsx';
import {useReadingPreferences} from '../../../entities/study/index.js';
/** The graded attempt is a separate step, not a question-navigation mode. */
function CheckpointResult({unit,questions,answers,score,passed,next,onNext,onRetry,onReviewLesson,onPath}){
 const correct=questions.filter(q=>answers[q.id]===q.answer).length;
 const mistakes=questions.length-correct;
 const approved=score>=PASS_PERCENT;
 return <div className="mx-auto max-w-2xl space-y-4 pb-8">
  <section role="status" aria-label="Resultado do checkpoint" className="rounded-3xl border border-line bg-paper p-5 sm:p-7 space-y-5">
   <div className="space-y-2 text-center">
    <p className="text-xs font-black uppercase tracking-wide text-primary-strong">Resultado · N5</p>
    <h1 id="checkpoint-result-heading" tabIndex={-1} className="text-2xl font-black text-ink-strong">{approved?'Checkpoint aprovado!':'Vamos praticar mais um pouco'}</h1>
    <p className="text-sm text-muted">{unit.title}</p>
   </div>
   <div className="rounded-2xl bg-raised p-5 text-center space-y-1" aria-label={`Resultado: ${score}%`}>
    <p className="text-4xl font-black text-ink-strong">{score}%</p>
    <p className="text-sm font-semibold text-ink-strong">Você acertou {correct} de {questions.length} questões</p>
    <p className="text-xs text-muted">{mistakes===0?'Todas as respostas corretas!':`${mistakes} ${mistakes===1?'questão precisa':'questões precisam'} de revisão.`}</p>
   </div>
   <p className="text-sm text-muted text-center">{approved
     ? 'Meta atingida! Você pode continuar para a próxima etapa.'
     : `A meta é ${PASS_PERCENT}% de acertos. Confira a correção e tente novamente quando estiver pronto.`}
     {passed&&!approved?' Esta etapa já foi aprovada anteriormente; uma nova tentativa não apaga sua aprovação.':''}
   </p>
   {unit.kind==='listening'&&<p className="text-xs text-muted text-center">Esta é uma atividade de prática com a voz do aparelho, não uma prova oficial de compreensão auditiva.</p>}
   <div className="space-y-2">
    {approved
     ? <Button variant="primary" className="w-full" onClick={onNext}>{next?'Próxima microlição →':'Voltar à Trilha →'}</Button>
     : <Button variant="primary" className="w-full" onClick={onRetry}>Tentar novamente</Button>}
    {!approved&&<Button variant="secondary" className="w-full" onClick={onReviewLesson}>Rever explicação desta lição</Button>}
   </div>
  </section>
  <details className="rounded-2xl border border-line bg-paper p-4 sm:p-5 space-y-3">
   <summary className="min-h-11 flex items-center font-bold text-ink-strong cursor-pointer">Ver correção das {questions.length} questões</summary>
   <ol className="space-y-3 pt-3">
    {questions.map((q,i)=>{
      const correctAnswer=answers[q.id]===q.answer;
      return <li key={q.id} className="rounded-xl border border-line p-4 space-y-2">
       <p className="text-xs font-bold text-muted">Questão {i+1} · {correctAnswer?'Correta':'Precisa revisar'}</p>
       <p className="text-sm font-semibold text-ink-strong">{q.prompt}</p>
       {q.text&&<p lang="ja" className="font-jp text-base">{q.text}</p>}
       {q.spokenText&&<p lang="ja" className="font-jp text-base">{q.spokenText}</p>}
       <p className="text-sm text-muted">Sua resposta: {answers[q.id]??'Não respondida'}</p>
       {!correctAnswer&&<p className="text-sm font-semibold text-ink-strong">Resposta correta: {q.answer}</p>}
       <p className="text-sm text-muted">{explainCheckpointAnswer(q,answers[q.id])}</p>
      </li>;
    })}
   </ol>
  </details>
  <button type="button" onClick={onPath} className="min-h-11 text-primary-strong font-bold">← Voltar à Trilha</button>
 </div>;
}

/** Continue at the first unanswered question after a reload.
 * Already graded attempts restart at question one for answer review. */
export function resumeCheckpointQuestion(state,topic){
 const key=`checkpoint:${topic}`;
 const draft=state?.drafts?.[key];
 if(draft?.result!=null)return 0;
 const questions=checkpointQuestions(state,topic,5,state?.attempts?.[key]||0);
 if(!questions.length)return 0;
 const index=questions.findIndex(q=>draft?.answers?.[q.id]===undefined);
 return index<0?questions.length-1:index;
}
/** Tentativa e respostas são persistidas, inclusive entre atualizações da PWA. */
export default function CheckpointPlayer({state,topic,update,go,openGuidedLesson}){
 const [activeQuestion,setActiveQuestion]=useState(()=>resumeCheckpointQuestion(state,topic));
 const readingPreferences=useReadingPreferences();
 const [speechRate,setSpeechRate]=useState(()=>readingPreferences.speechRate);
 useEffect(()=>{setActiveQuestion(resumeCheckpointQuestion(state,topic));},[topic]);
 const [audioNotice,setAudioNotice]=useState('');

 const unit=unitById(topic);
 const key=`checkpoint:${topic}`;
 const attempt=state.attempts?.[key]||0;
 const answers=state.drafts?.[key]?.answers||{};
 const result=state.drafts?.[key]?.result??null;
 useEffect(()=>{if(result!==null)document.getElementById('checkpoint-result-heading')?.focus({preventScroll:true});},[result,topic]);
 const transcripts=state.drafts?.[key]?.transcripts||[];
 const revealed=Object.fromEntries(transcripts.map(id=>[id,true]));
 const audioPlayed=state.drafts?.[key]?.audioPlayed||[];
 const played=Object.fromEntries(audioPlayed.map(id=>[id,true]));
 const questions=checkpointQuestions(state,topic,5,attempt);
 const ready=checkpointScore(questions,answers)!==null&&
  (unit?.kind!=='listening'||questions.every(q=>played[q.id]||revealed[q.id]));
 const passed=checkpointPassed(state,topic);
 const next=lessonsFor('N5')[lessonsFor('N5').findIndex(l=>l.id===topic)+1];
 const answer=(id,value)=>update(s=>{s.drafts||={};s.drafts[key]={...s.drafts[key],answers:{...(s.drafts[key]?.answers||{}),[id]:value},result:null};});
 const revealTranscript=id=>update(s=>{s.drafts||={};const previous=s.drafts[key]||{};s.drafts[key]={...previous,answers:previous.answers||{},result:null,transcripts:[...new Set([...(previous.transcripts||[]),id])]};});
 const markAudioPlayed=id=>update(s=>{s.drafts||={};const previous=s.drafts[key]||{};s.drafts[key]={...previous,answers:previous.answers||{},result:null,audioPlayed:[...new Set([...(previous.audioPlayed||[]),id])]};});
 const grade=()=>{const score=checkpointScore(questions,answers);if(score===null||!ready)return;setActiveQuestion(0);playSound(score>=PASS_PERCENT?'complete':'incorrect');update(s=>{
   s.drafts||={};s.drafts[key]={...s.drafts[key],answers:{...answers},result:score};
   if(score>=PASS_PERCENT){s.checkpoints||={};const prev=s.checkpoints[topic];if(!prev||prev.score<score)s.checkpoints[topic]={score,date:new Date().toISOString(),...(unit.kind==='listening'?{modality:Object.keys(revealed).length?'reading-fallback':Object.keys(played).length===questions.length?'synthetic-listening':'unverified-audio'}:{})};}
 });};
 const retry=()=>{setAudioNotice('');update(s=>{s.attempts||={};s.attempts[key]=(s.attempts[key]||0)+1;delete s.drafts?.[key];});};
 if(!unit)return <p role="alert">Checkpoint indisponível. <button onClick={()=>go('path')}>Voltar à Trilha</button></p>;
 if(result!==null)return <CheckpointResult unit={unit} questions={questions} answers={answers} score={result} passed={passed} next={next} onNext={()=>next?openGuidedLesson(next.id,'N5'):go('path')} onRetry={retry} onReviewLesson={()=>openGuidedLesson(topic,'N5')} onPath={()=>go('path')}/>;
 return <div className="mx-auto max-w-2xl space-y-4 pb-8">
  <header className="rounded-3xl border border-line bg-paper p-5 space-y-2"><p className="font-black text-xs text-primary-strong">TESTE RÁPIDO · N5</p><h1 className="text-2xl font-black text-ink-strong">{unit.title}</h1><p className="text-sm text-muted">Responda às perguntas e confira o resultado no final. Você precisa acertar pelo menos {PASS_PERCENT}% para continuar.</p></header>
  {questions.length>=4&&<div className="rounded-2xl border border-line bg-paper p-4 space-y-3" aria-label="Progresso do checkpoint">
    <div className="flex items-center justify-between gap-3"><span className="text-sm font-bold text-ink-strong">Questão {activeQuestion+1} de {questions.length}</span><span className="text-xs text-muted">{questions.filter(q=>answers[q.id]!==undefined).length} respondidas</span></div>
    <div role="progressbar" aria-label="Questão atual" aria-valuemin={1} aria-valuemax={questions.length} aria-valuenow={activeQuestion+1} className="h-2 overflow-hidden rounded-full bg-raised"><div className="h-full rounded-full bg-primary" style={{width:`${100*(activeQuestion+1)/questions.length}%`}}/></div>
    <p className="text-xs text-muted">Uma pergunta por vez. Você verá o resultado no final.</p>
  </div>}
  {questions.length<4?<p role="alert">Esta avaliação não tem perguntas suficientes. Retorne à Trilha.</p>:
   <section className="space-y-3" aria-label="Questões do checkpoint">{questions.map((q,i)=>i!==activeQuestion?null:<fieldset key={q.id} disabled={result!==null} className="rounded-2xl border border-line bg-paper p-4 space-y-3"><legend className="sr-only">Questão {i+1}</legend><p className="text-xs font-black text-primary-strong">QUESTÃO {i+1} DE {questions.length}</p><p className="font-bold text-ink-strong">{q.prompt}</p>
    {q.text&&<p lang="ja" className="font-jp text-lg rounded-xl bg-raised p-3">{q.text}</p>}
    {q.spokenText&&<div className="rounded-xl bg-raised p-3 space-y-2">
      <button type="button" disabled={result!==null} onClick={()=>speakJapanese(q.spokenText,setAudioNotice,{rate:speechRate,onStart:()=>markAudioPlayed(q.id)})} className="min-h-11 rounded-xl border border-line px-4 text-sm font-bold">▶ Ouvir frase</button>
      <AudioRateControl rate={speechRate} onChange={setSpeechRate} defaultRate={readingPreferences.speechRate}/>
      <button type="button" disabled={result!==null} onClick={()=>revealTranscript(q.id)} className="block min-h-10 text-xs underline text-primary-strong font-bold">Não consegui ouvir · mostrar texto</button>
      {(revealed[q.id]||result!==null)&&<p lang="ja" className="font-jp text-lg">{q.spokenText}</p>}
      <p className="text-xs text-muted">Ouça a frase antes de responder. Se o áudio não funcionar, revele o texto. Nesse caso, a atividade conta como leitura.</p>
    </div>}
    <div className="space-y-2">{q.options.map(opt=><label key={opt} className={`min-h-12 flex items-center gap-3 rounded-xl border-2 p-3 cursor-pointer ${answers[q.id]===opt?'border-primary bg-accent-soft':'border-line bg-surface'}`}><input type="radio" name={`q-${q.id}`} checked={answers[q.id]===opt} onChange={()=>answer(q.id,opt)}/><span className="text-sm text-ink-strong">{opt}</span></label>)}</div>{result!==null&&<div className="rounded-xl bg-raised p-3 space-y-2" role="status">
       <p className="text-sm font-bold text-ink-strong">{answers[q.id]===q.answer?'✓ Você acertou esta questão.':'Resposta correta: '+q.answer}</p>
       <p className="text-sm text-muted">{explainCheckpointAnswer(q,answers[q.id])}</p>
     </div>}</fieldset>)}</section>}
  {questions.length>=4&&<nav aria-label="Navegar entre questões" className="flex items-center gap-3">
    <Button variant="secondary" disabled={activeQuestion===0} onClick={()=>setActiveQuestion(n=>Math.max(0,n-1))}>← Anterior</Button>
    {activeQuestion<questions.length-1&&<Button variant="primary" className="flex-1" disabled={result===null&&(answers[questions[activeQuestion]?.id]===undefined||(unit?.kind==='listening'&&!played[questions[activeQuestion]?.id]&&!revealed[questions[activeQuestion]?.id]))} onClick={()=>setActiveQuestion(n=>Math.min(questions.length-1,n+1))}>{result!==null?'Próxima resposta →':'Próxima questão →'}</Button>}
  </nav>}
  {audioNotice&&<p role="alert" className="text-sm text-muted">{audioNotice}</p>}
  <Button variant="primary" size="lg" className="w-full" disabled={!ready||questions.length<4||activeQuestion!==questions.length-1} onClick={grade}>Finalizar e ver resultado</Button>
  {passed&&result===null&&<p className="text-xs text-muted">Você já concluiu esta lição. Uma nova tentativa não apaga sua conquista.</p>}
  <button type="button" onClick={()=>go('path')} className="min-h-11 text-primary-strong font-bold">← Voltar à Trilha</button>
 </div>;
}
