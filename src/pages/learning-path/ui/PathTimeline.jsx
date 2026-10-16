import React from 'react';
import {lessonsFor,isDone,courseLevel} from '../../../entities/study/index.js';
import {N5_STAGES,stageProgress,unitAccessible,unitPracticed} from '../../../entities/study/index.js';
import {isAccessibleLesson} from '../../../entities/study/index.js';
import Icon from '../../../shared/ui/Icon.jsx';
import {Button} from '../../../shared/ui/index.jsx';
const chapters=units=>units.reduce((groups,unit)=>{
 const previous=groups.at(-1);
 if(previous?.name===unit.chapter)previous.units.push(unit);
 else groups.push({name:unit.chapter,key:unit.id,units:[unit]});
 return groups;
},[]);
export default function PathTimeline({state,openGuidedLesson,openCheckpoint,go,speak}){
 const level=courseLevel(state);
 const lessons=lessonsFor(level);
 const completed=lessons.filter(l=>isDone(state,level,l)).length;
 const current=lessons.findIndex(l=>!isDone(state,level,l));
 const currentUnit=lessons[current];
 const renderStep=(unit,i)=>{
  const done=isDone(state,level,unit);
  const locked=level==='N5'?!unitAccessible(state,unit.id):!isAccessibleLesson(state,unit.id,level);
  const ready=level==='N5'&&!done&&!locked&&unitPracticed(state,unit.id);
  return <li key={unit.id} className="relative pl-8 pb-3">
   <span aria-hidden="true" className={`absolute -left-[13px] top-4 h-7 w-7 flex items-center justify-center rounded-full border-2 border-paper ${done?'bg-primary text-white':locked?'bg-raised text-muted':'bg-blue text-white'}`}><Icon name={done?'check':locked?'lock':'learn'} className="w-4 h-4"/></span>
   <article className={`rounded-2xl border p-4 space-y-2 ${locked?'border-line bg-raised':'border-line bg-paper'}`}>
    <div className="flex gap-3 items-center justify-between"><p className="font-black text-ink-strong">{unit.title}</p><span className="shrink-0 text-xs font-bold text-muted">{done?'✓ Aprovada':locked?'Bloqueada':ready?'Avaliar':'Aprender'}</span></div>
    {(!done&&!locked)&&<p className="text-xs sm:text-sm text-muted">{unit.detail||unit.focus||unit.explanation}</p>}
    {locked?null:<Button variant={done?'secondary':'primary'} className="w-full sm:w-auto" onClick={()=>ready?openCheckpoint(unit.id):openGuidedLesson(unit.id,level)}>{done?'Rever':ready?'Fazer teste rápido →':'Continuar lição →'}</Button>}
   </article>
  </li>;
 };
 return <div className="mx-auto max-w-2xl space-y-5 pb-6">
  <header className="rounded-3xl border border-line bg-paper p-5 space-y-3"><p className="text-xs font-black text-primary-strong">SEU CAMINHO · {level}</p><h1 className="text-2xl font-black text-ink-strong">Trilha de aprendizagem</h1><p className="text-sm text-muted">Uma lição de cada vez. Vamos mostrar o que vem a seguir.</p><div className="flex justify-between text-xs text-muted font-bold"><span>Lições concluídas</span><span>{completed}/{lessons.length}</span></div><div className="h-3 bg-raised rounded-full overflow-hidden" role="progressbar" aria-label="Microlições aprovadas" aria-valuemin={0} aria-valuemax={lessons.length} aria-valuenow={completed}><div className="h-full bg-primary" style={{width:`${100*completed/Math.max(1,lessons.length)}%`}}/></div></header>
  {level==='N5'?N5_STAGES.map((stage,index)=>{
   const progress=stageProgress(state,stage);
   const example=stage.units.find(unit=>unit.kind==='grammar')?.items[0];
   const status=progress.status==='completed'?'Concluída':progress.status==='current'?'Você está aqui':'Em breve';
   return <details key={stage.id} className="rounded-3xl border border-line bg-paper p-4 sm:p-5" open={progress.status==='current'}>
    <summary className="cursor-pointer min-h-11 space-y-2">
     <span className="text-xs font-bold text-primary-strong">ETAPA {index+1} · {status}</span>
     <h2 className="text-lg font-black text-ink-strong inline ml-2">{stage.title}</h2>
     <span className="block text-sm text-muted">{progress.completed} de {progress.total} microlições aprovadas</span>
    </summary>
    <div className="mt-4 space-y-4">
     <p className="text-sm text-ink"><strong>Objetivo:</strong> {stage.goal}</p>
     
     {example&&<details className="rounded-xl bg-raised p-3"><summary className="min-h-11 cursor-pointer font-bold">Uma frase que você vai entender</summary><p lang="ja" className="font-jp text-xl mt-3">{example.example}</p><p className="text-sm text-ink mt-2">{example.meaning}</p><p className="text-sm text-muted mt-2">{example.text}</p><Button variant="secondary" className="mt-3" onClick={()=>speak(example.example)}>Ouvir exemplo</Button></details>}
     
     {progress.status==='current'&&currentUnit&&stage.units.some(unit=>unit.id===currentUnit.id)&&<section className="rounded-2xl border border-line p-3 space-y-2" aria-label="Sua lição atual">
       <h3 className="text-sm font-bold text-ink-strong">Sua próxima lição</h3>
       <ol className="ml-4 border-l-2 border-line">{renderStep(currentUnit,lessons.indexOf(currentUnit))}</ol>
      </section>}
     <details className="rounded-2xl border border-line p-3">
      <summary className="cursor-pointer min-h-11 text-sm font-semibold text-ink-strong">Ver outras lições desta etapa</summary>
      <div className="mt-3 space-y-2">
       {chapters(stage.units).map(chapter=><details key={chapter.key} className="rounded-xl border border-line p-3">
        <summary className="cursor-pointer min-h-11 text-sm font-semibold text-ink-strong">{chapter.name} · {chapter.units.filter(unit=>isDone(state,'N5',unit)).length}/{chapter.units.length}</summary>
        <ol className="ml-4 mt-3 border-l-2 border-line">{chapter.units.filter(unit=>unit.id!==currentUnit?.id).map(unit=>renderStep(unit,lessons.indexOf(unit)))}</ol>
       </details>)}
      </div>
     </details>
    </div>
   </details>;
  }):<section className="space-y-3"><p className="text-xs rounded-2xl bg-raised p-3 text-muted">Prévia introdutória do {level}. O curso completo N4–N1 ainda está em construção.</p><ol className="ml-4 border-l-2 border-line">{lessons.map(renderStep)}</ol></section>}
  {level==='N5'&&lessons.every(l=>isDone(state,'N5',l)) && <section className="rounded-2xl border border-line bg-paper p-5 space-y-2"><h2 className="font-black text-ink-strong">Fundamentos N5 concluídos</h2><p className="text-sm text-muted">Você concluiu todas as microlições da Trilha N5. Isso é a conclusão do curso pessoal, não uma certificação JLPT. A avaliação certificadora adicional continua pendente de questões e áudio revisados.</p><Button variant="secondary" className="w-full" onClick={()=>go('progress')}>Ver preparação para a prova →</Button></section>}
  
 </div>;
}
