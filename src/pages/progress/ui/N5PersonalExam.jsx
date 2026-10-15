import React,{useMemo,useState} from 'react';
import {buildN5PersonalReview,gradeN5PersonalReview} from '../../../entities/study/index.js';
import {speakJapanese,stopSpeech,useReadingPreferences,AudioRateControl} from '../../../entities/study/index.js';
import {Button} from '../../../shared/ui/index.jsx';
const LABELS={vocabulary:'Vocabulário',grammar:'Gramática',reading:'Leitura',listening:'Escuta'};
/** A non-certifying self-check after completing every N5 unit. */
export default function N5PersonalExam({state,update}){
 const [step,setStep]=useState(0);
 const readingPreferences=useReadingPreferences();
 const [speechRate,setSpeechRate]=useState(()=>readingPreferences.speechRate);
 const [report,setReport]=useState(null);
 const [reviewedAnswers,setReviewedAnswers]=useState({});
 const [notice,setNotice]=useState('');
 const p=state.n5Practice||{seed:0,answers:{},played:[],transcripts:[],history:[]};
 const questions=useMemo(()=>p.seed?buildN5PersonalReview(p.seed):[],[p.seed]);
 const question=questions[step];
 const answered=questions.filter(q=>q.options.includes(p.answers?.[q.id])).length;
 const start=()=>{stopSpeech();setStep(0);setReport(null);setNotice('');update(s=>{
  s.n5Practice={seed:Math.max(1,Math.floor(Date.now()/1000)%2147483646),answers:{},played:[],transcripts:[],history:s.n5Practice?.history||[]};
 });};
 const answer=choice=>update(s=>{s.n5Practice.answers[question.id]=choice;});
 const play=()=>{setNotice('');speakJapanese(question.spokenText,msg=>setNotice(msg),{rate:speechRate,onStart:()=>update(s=>{
   s.n5Practice.played=[...new Set([...(s.n5Practice.played||[]),question.id])];
 })});};
 const reveal=()=>{stopSpeech();update(s=>{
  s.n5Practice.transcripts=[...new Set([...(s.n5Practice.transcripts||[]),question.id])];
 });};
 const finish=()=>{
  const graded=gradeN5PersonalReview(questions,p.answers,p.played,p.transcripts);
  if(graded.status!=='practice-reviewed')return;
  setReviewedAnswers({...p.answers});setReport(graded);stopSpeech();update(s=>{
   s.n5Practice.history=[{...graded,date:new Date().toISOString()},...(s.n5Practice.history||[])].slice(0,20);
   s.n5Practice.seed=0;s.n5Practice.answers={};s.n5Practice.played=[];s.n5Practice.transcripts=[];
  });
 };
 if(report){
  const mistaken=questions.filter(q=>reviewedAnswers[q.id]!==q.correct);
  return <section className="rounded-2xl border-2 border-primary bg-paper p-5 space-y-3" role="status">
   <h3 className="text-lg font-black text-ink-strong">Revisão final N5 — resultado</h3>
   <p className="font-black text-2xl text-ink-strong">{report.correct}/{report.total} acertos</p>
   <p className="text-sm text-muted">{report.practiceMastery?'Bom desempenho no conteúdo praticado.':'Revise os pontos com menos acertos e refaça depois.'} {report.audioEvidence?'As atividades de escuta foram iniciadas pelo navegador.':'Parte da escuta não foi reproduzida ou utilizou transcrição; essa parte não comprova compreensão auditiva.'}</p>
   <ul className="grid grid-cols-2 gap-2">{Object.entries(report.bySkill).map(([id,row])=><li key={id} className="rounded-xl bg-raised p-3 text-sm"><strong className="block">{LABELS[id]}</strong>{row.correct}/{row.total}</li>)}</ul>
   {!!mistaken.length&&<details className="rounded-xl bg-raised p-3"><summary className="min-h-11 cursor-pointer font-bold text-ink-strong text-sm">Rever {mistaken.length} questão(ões) incorreta(s)</summary><ol className="space-y-3 py-3">{mistaken.map(item=><li key={item.id} className="border-b border-line pb-3 text-sm space-y-1"><p className="font-bold">{item.prompt}</p><p>Você marcou: {reviewedAnswers[item.id]}</p><p className="text-primary-strong font-bold">Correto: {item.correct}</p><p className="text-muted">{item.explanation}</p>{item.spokenText&&<p lang="ja" className="font-jp">{item.spokenText}</p>}</li>)}</ol></details>}
   <p className="text-xs text-muted">Autoavaliação do Kotonoha. Não é prova oficial JLPT, não certifica N5 e não libera N4.</p>
   <Button variant="secondary" className="w-full" onClick={start}>Fazer outra revisão com novas questões →</Button>
  </section>;
 }
 if(!p.seed)return <section className="rounded-2xl border-2 border-primary bg-paper p-5 space-y-3">
  <h3 className="text-lg font-black text-ink-strong">Revisão final pessoal N5</h3>
  <p className="text-sm text-muted">32 questões de revisão dos assuntos estudados: vocabulário, gramática, leitura e escuta com voz do navegador. Você pode retomar se sair. Não é uma certificação JLPT e não desbloqueia N4.</p>
  {p.history?.[0]&&<p className="text-xs text-muted">Última tentativa: {p.history[0].correct}/{p.history[0].total} respostas corretas.</p>}
  <Button variant="primary" className="w-full" onClick={start}>Começar revisão final →</Button>
 </section>;
 return <section className="rounded-2xl border border-line bg-paper p-5 space-y-4" aria-labelledby="personal-exam-title">
  <div className="space-y-1"><p className="text-xs text-primary-strong font-black">REVISÃO FORMATIVA · N5</p><h3 id="personal-exam-title" className="font-black text-lg text-ink-strong">Questão {step+1} de {questions.length} · {LABELS[question.skill]}</h3><p className="text-xs text-muted">{answered} respostas salvas neste aparelho. Retome a qualquer momento.</p></div>
  <div role="progressbar" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={answered} aria-label="Respostas salvas" className="h-2 rounded-full bg-raised overflow-hidden"><div className="h-full bg-primary" style={{width:`${100*answered/questions.length}%`}}/></div>
  <div className="space-y-3"><p className="font-bold text-ink-strong">{question.prompt}</p>
  {question.context&&<p className="text-sm text-muted">Situação: {question.context}</p>}
  {question.text&&<p lang="ja" className="font-jp text-xl rounded-xl bg-raised p-4">{question.text}</p>}
  {question.spokenText&&<div className="rounded-xl bg-raised p-3 space-y-2"><Button variant="secondary" onClick={play}>▶ Ouvir japonês</Button><AudioRateControl rate={speechRate} onChange={setSpeechRate}/><button className="block text-xs text-primary-strong underline min-h-10 font-bold" type="button" onClick={reveal}>Não consigo ouvir · mostrar transcrição</button>{p.transcripts?.includes(question.id)&&<p lang="ja" className="font-jp text-lg">{question.spokenText}</p>}{notice&&<p role="alert" className="text-xs text-muted">{notice}</p>}</div>}
  <fieldset className="space-y-2"><legend className="sr-only">Selecione uma opção</legend>{question.options.map((choice,i)=><label key={i} className="min-h-11 flex items-center gap-3 border border-line rounded-xl p-3 text-sm"><input type="radio" name={`personal-${question.id}`} checked={p.answers?.[question.id]===choice} onChange={()=>answer(choice)}/><span>{choice}</span></label>)}</fieldset></div>
  <div className="flex gap-2"><Button variant="secondary" disabled={step===0} onClick={()=>setStep(i=>i-1)}>Anterior</Button><Button variant="secondary" disabled={step===questions.length-1} onClick={()=>setStep(i=>i+1)}>Próxima</Button></div>
  <Button variant="primary" className="w-full" disabled={answered!==questions.length} onClick={finish}>Corrigir revisão ({answered}/{questions.length})</Button>
 </section>;
}
