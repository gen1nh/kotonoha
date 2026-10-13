import React,{useState} from 'react';
import {APPROVED_EXAM_ITEMS} from '../pedagogy/publishedItems.js';
import {buildN5CertificationExam,recordN5Result,N5_SKILL_LABELS} from '../pedagogy/readiness.js';
import {gradeAssessment} from '../pedagogy/engine.js';
import {Button} from './ui/index.jsx';
/** A single, resumable assessment interface; only rendered with a real reviewed bank. */
export default function N5Exam({state,update}){
  const [step,setStep]=useState(0);
  const [finished,setFinished]=useState(null);
  const draft=state.pedagogy?.examDraft;
  const seed=draft?.seed || 1950;
  const exam=buildN5CertificationExam(APPROVED_EXAM_ITEMS,seed);
  if(exam.status!=='ready')return null;
  const question=exam.questions[step];
  const answers=draft?.answers || {};
  const answered=exam.questions.filter(item=>Number.isInteger(answers[item.id])).length;
  const start=()=>update(s=>{s.pedagogy.examDraft={seed:1950,answers:{}};});
  const answer=(value)=>update(s=>{s.pedagogy.examDraft ||= {seed:1950,answers:{}};s.pedagogy.examDraft.answers[question.id]=value;});
  const submit=()=>{
    const grade=gradeAssessment(exam,answers);
    if(!['passed','needs_review'].includes(grade.status))return;
    update(s=>{
      if(grade.status==='passed')recordN5Result(s,grade,exam);
      else s.pedagogy.assessmentHistory=[...(s.pedagogy.assessmentHistory||[]), {...grade,date:new Date().toISOString(),policyVersion:1}].slice(-250);
      s.pedagogy.examDraft=null;
    });
    setFinished(grade);
  };
  if(finished)return <div className="rounded-xl border border-line p-4 space-y-2" role="status"><h3 className="font-black text-ink-strong">{finished.passed?'N5 validado internamente':'Pontos a reforçar antes do N4'}</h3><p className="text-sm text-muted">{finished.correct}/{finished.total} respostas corretas. {finished.passed?'Esta aprovação é interna ao Kotonoha, não um resultado oficial JLPT.':'Sua prova pode ser refeita com outro conjunto de itens após revisão.'}</p><ul className="text-sm space-y-1">{Object.entries(finished.bySkill).map(([skill,row])=><li key={skill}>{N5_SKILL_LABELS[skill]}: {row.correct}/{row.total}</li>)}</ul><Button variant="secondary" onClick={()=>{setStep(0);setFinished(null);}}>Fechar resultado</Button></div>;
  if(!draft)return <Button variant="primary" onClick={start}>Começar avaliação interna N5</Button>;
  return <div className="space-y-3 rounded-xl border border-line p-4" aria-labelledby="exam-title"><h3 id="exam-title" className="font-bold text-ink-strong">Prova de passagem N5 — {step+1}/{exam.questions.length}</h3><p className="text-xs text-muted">Respostas persistidas localmente ({answered} de {exam.questions.length}). Questões inéditas e áudio licenciados.</p><div className="h-2 bg-raised rounded-full overflow-hidden"><div className="bg-primary h-full" style={{width:`${Math.round(100*answered/exam.questions.length)}%`}} /></div><fieldset className="space-y-3"><legend className="font-bold text-ink-strong">{question.prompt}</legend>{question.audio && <audio controls preload="none" src={question.audio.path} aria-label="Áudio da questão">Seu navegador não suporta reprodução de áudio.</audio>}{question.sentence && <p lang="ja" className="text-lg">{question.sentence}</p>}{question.choices.map((choice,i)=><label key={i} className="flex gap-3 items-start border border-line rounded-lg min-h-12 p-3 text-sm"><input type="radio" name={`n5-final-${question.id}`} className="mt-1" checked={answers[question.id]===i} onChange={()=>answer(i)}/><span>{choice}</span></label>)}</fieldset><div className="flex flex-wrap gap-2"><Button variant="secondary" disabled={step===0} onClick={()=>setStep(s=>Math.max(0,s-1))}>Anterior</Button><Button variant="primary" disabled={step===exam.questions.length-1} onClick={()=>setStep(s=>Math.min(exam.questions.length-1,s+1))}>Próxima</Button></div><Button variant="primary" className="w-full" disabled={answered!==exam.questions.length} onClick={submit}>Corrigir avaliação completa ({answered}/{exam.questions.length})</Button></div>;
}
