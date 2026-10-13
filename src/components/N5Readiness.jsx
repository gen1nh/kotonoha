import React from 'react';
import {n5ReleaseReadiness} from '../pedagogy/readiness.js';
import {N5_CURRICULUM} from '../pedagogy/n5Curriculum.js';
import {APPROVED_EXAM_ITEMS} from '../pedagogy/publishedItems.js';
import N5Exam from './N5Exam.jsx';
import N5PersonalExam from './N5PersonalExam.jsx';
import {N5_TOPICS,N5_TOPIC_LABELS,N5_UNITS,unitPassed,unitsForTopic} from '../courseUnits.js';
import {Button} from './ui/index.jsx';
const TOPICS=N5_TOPIC_LABELS;

/** Always distinguish a micro-checkpoint from a certified level. */
export default function N5Readiness({state,go,update}){
  // Approved exam items are intentionally empty until licensed content and audio are reviewed.
  const readiness=n5ReleaseReadiness(APPROVED_EXAM_ITEMS,state);
  const completed=N5_UNITS.filter(unit=>unitPassed(state,unit.id)).length;
  return <section className="rounded-2xl border border-line bg-paper p-5 space-y-4" aria-labelledby="readiness-title">
    <div className="space-y-1"><p className="text-xs font-black text-primary-strong">EVOLUÇÃO NO N5</p><h2 id="readiness-title" className="text-lg font-black text-ink-strong">Preparação N5</h2><p className="text-sm text-muted">Acompanhe todas as áreas estudadas e prepare-se para a revisão final. Conclusão do curso e certificação JLPT são coisas diferentes.</p></div>
    <div className="flex items-center justify-between text-sm"><strong className="text-ink-strong">Microlições concluídas</strong><span className="font-bold text-primary-strong tabular-nums">{completed}/{N5_UNITS.length}</span></div>
    <div className="h-2.5 bg-raised rounded-full overflow-hidden" role="progressbar" aria-label="Microlições da trilha N5" aria-valuemin={0} aria-valuemax={N5_UNITS.length} aria-valuenow={completed}><div className="h-full bg-primary" style={{width:`${100*completed/N5_UNITS.length}%`}}/></div>
    <ul className="grid grid-cols-2 gap-2">{N5_TOPICS.map(topic=><li key={topic} className="rounded-lg border border-line bg-surface p-3 flex justify-between items-center gap-2 text-sm"><span className="text-ink-strong">{TOPICS[topic]}</span><strong className={readiness.foundations[topic]?'text-primary-strong':'text-muted'}>{unitsForTopic(topic).filter(unit=>unitPassed(state,unit.id)).length}/{unitsForTopic(topic).length}</strong></li>)}</ul>
    <p className="text-xs text-muted">Para treinar escuta agora, abra <strong>Praticar → Prática de escuta</strong> e use a voz japonesa do aparelho, sem baixar áudios.</p>
    {readiness.foundationsComplete&&<p className="rounded-xl bg-accent-soft p-4 text-sm text-primary-strong" role="status"><strong className="block">Trilha N5 concluída!</strong> Você estudou e aprovou os checkpoints de todas as áreas do curso. Agora pode fazer a revisão final formativa. Isso não equivale à aprovação no exame JLPT.</p>}
    {readiness.foundationsComplete&&<N5PersonalExam state={state} update={update}/>}
    <div className="border-t border-line pt-3 space-y-2">
      <h3 className="font-bold text-ink-strong">Certificação interna adicional (indisponível)</h3>
      {readiness.certified ? <p className="text-sm text-primary-strong font-bold">N5 validado internamente. Você pode continuar no N4 introdutório.</p> : <p role="status" className="text-sm text-muted">A avaliação certificadora ainda não foi liberada: faltam questões revisadas e gravações adequadas para avaliar escuta. A voz do navegador pode ser usada para praticar, mas não certifica o N5.</p>}
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">{Object.entries(readiness.bySkill).map(([id,row])=><li key={id} className="rounded-lg bg-raised p-3"><strong className="block text-ink-strong">{row.label}</strong><span className="text-muted">Questões independentes aprovadas: {row.approved}/{row.required} itens mínimos. Competências sem itens: {readiness.missingCompetencies[id]?.length ?? 0}</span></li>)}</ul>
      <p className="text-xs text-muted">O currículo editorial N5 contempla {N5_CURRICULUM.length} grupos de competências. Os mínimos exibidos são internos e provisórios, não uma fórmula oficial do JLPT.</p>
    </div>
    {readiness.examAvailable && readiness.foundationsComplete && !readiness.certified && <N5Exam state={state} update={update} />}
    {!readiness.certified&&<Button variant="secondary" className="w-full" onClick={()=>go('path')}>{completed===N5_UNITS.length?'Revisar minha trilha':'Continuar N5'} →</Button>}
  </section>;
}
