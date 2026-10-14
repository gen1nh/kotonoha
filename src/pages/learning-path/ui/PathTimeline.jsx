import React from 'react';
import {lessonsFor,isDone,courseLevel} from '../../../entities/study/index.js';
import {N5_TOPICS,N5_TOPIC_LABELS,unitAccessible,unitPracticed,topicPassed,unitsForTopic} from '../../../entities/study/index.js';
import {isAccessibleLesson} from '../../../entities/study/index.js';
import Icon from '../../../shared/ui/Icon.jsx';
import {Button} from '../../../shared/ui/index.jsx';
const LABELS=N5_TOPIC_LABELS;
const chapters=units=>Array.from(new Set(units.map(unit=>unit.chapter))).map(name=>({name,units:units.filter(unit=>unit.chapter===name)}));
export default function PathTimeline({state,openGuidedLesson,openCheckpoint,go}){
 const level=courseLevel(state);
 const lessons=lessonsFor(level);
 const completed=lessons.filter(l=>isDone(state,level,l)).length;
 const current=lessons.findIndex(l=>!isDone(state,level,l));
 const renderStep=(unit,i)=>{
  const done=isDone(state,level,unit);
  const locked=level==='N5'?!unitAccessible(state,unit.id):!isAccessibleLesson(state,unit.id,level);
  const ready=level==='N5'&&!done&&!locked&&unitPracticed(state,unit.id);
  return <li key={unit.id} className="relative pl-8 pb-3">
   <span aria-hidden="true" className={`absolute -left-[13px] top-4 h-7 w-7 flex items-center justify-center rounded-full border-2 border-paper ${done?'bg-primary text-white':locked?'bg-raised text-muted':'bg-blue text-white'}`}><Icon name={done?'check':locked?'lock':'learn'} className="w-4 h-4"/></span>
   <article className={`rounded-2xl border-2 p-4 space-y-2 ${locked?'border-line bg-raised':'border-line bg-paper'}`}>
    <div className="flex gap-3 items-center justify-between"><p className="font-black text-ink-strong">{unit.title}</p><span className="shrink-0 text-xs font-bold text-muted">{done?'✓ Aprovada':locked?'Bloqueada':ready?'Avaliar':'Aprender'}</span></div>
    <p className="text-xs sm:text-sm text-muted">{unit.detail||unit.focus||unit.explanation}</p>
    {locked?<p className="text-xs text-muted"><Icon name="lock" className="inline w-3 h-3"/> Conclua primeiro a microlição anterior.</p>:<Button variant={done?'secondary':'primary'} className="w-full sm:w-auto" onClick={()=>ready?openCheckpoint(unit.id):openGuidedLesson(unit.id,level)}>{done?'Revisitar':ready?'Fazer checkpoint →':'Continuar →'}</Button>}
   </article>
  </li>;
 };
 return <div className="mx-auto max-w-2xl space-y-5 pb-6">
  <header className="rounded-3xl border border-line bg-paper p-5 space-y-3"><p className="text-xs font-black text-primary-strong">SEU CAMINHO · {level}</p><h1 className="text-2xl font-black text-ink-strong">Trilha de aprendizagem</h1><p className="text-sm text-muted">Cada passo é curto. Aprenda, pratique e aprove para avançar.</p><div className="flex justify-between text-xs text-muted font-bold"><span>Microlições aprovadas</span><span>{completed}/{lessons.length}</span></div><div className="h-3 bg-raised rounded-full overflow-hidden" role="progressbar" aria-label="Microlições aprovadas" aria-valuemin={0} aria-valuemax={lessons.length} aria-valuenow={completed}><div className="h-full bg-primary" style={{width:`${100*completed/Math.max(1,lessons.length)}%`}}/></div></header>
  {level==='N5'?N5_TOPICS.map(topic=><section key={topic} className="space-y-3" aria-label={`Unidade ${LABELS[topic]}`}><div className="flex items-center justify-between px-1"><h2 className="text-lg font-black text-ink-strong">{LABELS[topic]}</h2><span className="text-xs text-muted font-bold">{topicPassed(state,topic)?'Concluída':`${unitsForTopic(topic).filter(u=>isDone(state,'N5',u)).length}/${unitsForTopic(topic).length}`}</span></div><div className="space-y-2">{chapters(unitsForTopic(topic)).map(chapter=><details key={chapter.name} className="rounded-2xl border border-line bg-paper p-3" open={chapter.units.some(unit=>unit.id===lessons[current]?.id)}>
   <summary className="cursor-pointer min-h-11 flex items-center justify-between gap-2 text-sm font-bold text-ink-strong">{chapter.name}<span className="text-xs text-muted">{chapter.units.filter(unit=>isDone(state,'N5',unit)).length}/{chapter.units.length}</span></summary>
   <ol className="ml-4 mt-3 border-l-2 border-line">{chapter.units.map(unit=>renderStep(unit,lessons.indexOf(unit)))}</ol>
  </details>)}</div></section>):<section className="space-y-3"><p className="text-xs rounded-2xl bg-raised p-3 text-muted">Prévia introdutória do {level}. O curso completo N4–N1 ainda está em construção.</p><ol className="ml-4 border-l-2 border-line">{lessons.map(renderStep)}</ol></section>}
  {level==='N5'&&lessons.every(l=>isDone(state,'N5',l)) && <section className="rounded-2xl border border-line bg-paper p-5 space-y-2"><h2 className="font-black text-ink-strong">Fundamentos N5 concluídos</h2><p className="text-sm text-muted">Você concluiu todas as microlições da Trilha N5. Isso é a conclusão do curso pessoal, não uma certificação JLPT. A avaliação certificadora adicional continua pendente de questões e áudio revisados.</p><Button variant="secondary" className="w-full" onClick={()=>go('progress')}>Ver preparação para a prova →</Button></section>}
  <p className="rounded-xl bg-raised p-3 text-xs text-muted">As opções N5–N1 da Biblioteca são apenas filtros de consulta. Elas não alteram os desbloqueios desta Trilha.</p>
 </div>;
}
