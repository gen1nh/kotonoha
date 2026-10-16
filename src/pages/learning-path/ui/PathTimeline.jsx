import React from 'react';
import {lessonsFor,isDone,courseLevel,N5_STAGES,stageProgress,unitAccessible,unitPracticed,isAccessibleLesson} from '../../../entities/study/index.js';
import Icon from '../../../shared/ui/Icon.jsx';
import {Button} from '../../../shared/ui/index.jsx';

const chapters=units=>units.reduce((groups,unit)=>{
 const previous=groups.at(-1);
 if(previous?.name===unit.chapter)previous.units.push(unit);
 else groups.push({name:unit.chapter,key:unit.id,units:[unit]});
 return groups;
},[]);

/** Only the five stages expand. Chapters are headings on a single continuous timeline. */
export default function PathTimeline({state,openGuidedLesson,openCheckpoint,go}){
 const level=courseLevel(state);
 const lessons=lessonsFor(level);
 const completed=lessons.filter(unit=>isDone(state,level,unit)).length;
 const currentUnit=lessons.find(unit=>!isDone(state,level,unit));
 const [openedStage,setOpenedStage]=React.useState(()=>{
  if(level!=='N5')return null;
  return N5_STAGES.find(stage=>stage.units.some(unit=>unit.id===currentUnit?.id))?.id||N5_STAGES.at(-1)?.id;
 });
 const chooseUnit=unit=>unitPracticed(state,unit.id)&&level==='N5'?openCheckpoint(unit.id):openGuidedLesson(unit.id,level);
 const renderStep=unit=>{
  const done=isDone(state,level,unit);
  const locked=level==='N5'?!unitAccessible(state,unit.id):!isAccessibleLesson(state,unit.id,level);
  const current=unit.id===currentUnit?.id;
  const ready=level==='N5'&&!done&&!locked&&unitPracticed(state,unit.id);
  const label=done?'Concluída':locked?'Bloqueada':ready?'Pronta para o teste':'Para aprender';
  return <li key={unit.id} className="relative pl-8 pb-3">
   <span aria-hidden="true" className={`absolute -left-[13px] top-3 flex h-7 w-7 items-center justify-center rounded-full border-2 border-paper ${done?'bg-primary text-white':locked?'bg-raised text-muted':current?'bg-blue text-white':'bg-surface text-ink-strong border-line'}`}>
    <Icon name={done?'check':locked?'lock':'learn'} className="h-4 w-4"/>
   </span>
   <article className={`rounded-2xl border p-3 sm:p-4 ${current?'border-primary/30 bg-accent-soft/50':locked?'border-line bg-raised/60':'border-line bg-paper'}`}>
    <div className="flex items-start justify-between gap-3">
     <div className="min-w-0 space-y-1">
      <p className={`text-sm sm:text-base font-bold ${locked?'text-muted':'text-ink-strong'}`}>{unit.title}</p>
      <p className="text-xs text-muted">{current?'Você está aqui':label}</p>
     </div>
     {!locked&&!current&&<button type="button" onClick={()=>chooseUnit(unit)} className="min-h-11 shrink-0 px-2 text-sm font-semibold text-ink-strong underline">{done?'Rever':'Abrir'}</button>}
    </div>
    {current&&<>
     <p className="mt-2 text-sm text-ink-strong">{unit.detail||unit.focus||unit.explanation}</p>
     <Button variant="primary" className="mt-3 w-full sm:w-auto" onClick={()=>chooseUnit(unit)}>{ready?'Fazer teste rápido →':'Continuar lição →'}</Button>
    </>}
   </article>
  </li>;
 };
 const stages=level==='N5'?N5_STAGES.map((stage,index)=>{
  const progress=stageProgress(state,stage);
  const open=openedStage===stage.id;
  const status=progress.status==='completed'?'Concluída':progress.status==='current'?'Você está aqui':'Mais adiante';
  return <section key={stage.id} className="overflow-hidden rounded-2xl border border-line bg-paper">
   <h2>
    <button type="button" aria-expanded={open} aria-controls={`stage-${stage.id}`} onClick={()=>setOpenedStage(open?null:stage.id)}
      className="flex min-h-20 w-full items-center gap-3 px-4 py-4 text-left sm:px-5">
     <span aria-hidden="true" className="text-muted text-sm">{open?'▾':'▸'}</span>
     <span className="min-w-0 flex-1">
      <span className="block text-xs font-semibold text-muted">Etapa {index+1} · {status}</span>
      <span className="block text-lg font-black text-ink-strong">{stage.title}</span>
      <span className="block mt-1 text-xs text-muted">{progress.completed} de {progress.total} lições concluídas</span>
     </span>
    </button>
   </h2>
   {open&&<div id={`stage-${stage.id}`} className="border-t border-line px-4 pb-5 pt-4 sm:px-5">
    <p className="mb-4 text-sm text-muted">{stage.goal}</p>
    <div className="space-y-5">
     {chapters(stage.units).map(chapter=><section key={chapter.key} aria-label={chapter.name}>
      <h3 className="mb-3 text-sm font-bold text-ink-strong">{chapter.name}</h3>
      <ol className="ml-3 border-l-2 border-line">{chapter.units.map(renderStep)}</ol>
     </section>)}
    </div>
   </div>}
  </section>;
 }):null;
 return <div className="mx-auto max-w-2xl space-y-4 pb-6">
  <header className="rounded-2xl border border-line bg-paper p-5 space-y-3">
   <p className="text-xs font-semibold text-muted">Sua jornada · {level}</p>
   <h1 className="text-2xl font-black text-ink-strong">Trilha de aprendizagem</h1>
   <p className="text-sm text-muted">Siga os passos na ordem. A etapa atual já está aberta.</p>
   <div className="flex items-center justify-between text-xs font-semibold text-muted"><span>Lições concluídas</span><span>{completed}/{lessons.length}</span></div>
   <div className="h-2 overflow-hidden rounded-full bg-raised" role="progressbar" aria-label="Lições concluídas" aria-valuemin={0} aria-valuemax={lessons.length} aria-valuenow={completed}>
    <div className="h-full bg-primary" style={{width:`${100*completed/Math.max(1,lessons.length)}%`}}/>
   </div>
  </header>
  {stages||<section className="space-y-3"><p className="rounded-2xl bg-raised p-3 text-sm text-muted">{level} ainda tem apenas lições introdutórias.</p><ol className="ml-4 border-l-2 border-line">{lessons.map(renderStep)}</ol></section>}
  {level==='N5'&&lessons.every(unit=>isDone(state,'N5',unit))&&<section className="rounded-2xl border border-line bg-paper p-5 space-y-2">
   <h2 className="font-bold text-ink-strong">Você terminou as lições N5!</h2>
   <p className="text-sm text-muted">Isso não é uma certificação JLPT. A avaliação final ainda depende de questões e áudio revisados.</p>
   <Button variant="secondary" onClick={()=>go('progress')}>Minha preparação</Button>
  </section>}
 </div>;
}
