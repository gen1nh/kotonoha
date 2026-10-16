import React from 'react';
import {n5ReleaseReadiness} from '../../../entities/study/index.js';
import {APPROVED_EXAM_ITEMS} from '../../../entities/study/index.js';
import N5Exam from './N5Exam.jsx';
import N5PersonalExam from './N5PersonalExam.jsx';
import {N5_TOPICS,N5_TOPIC_LABELS,N5_UNITS,unitPassed,unitsForTopic} from '../../../entities/study/index.js';
import {Button} from '../../../shared/ui/index.jsx';
const TOPICS=N5_TOPIC_LABELS;

/** Always distinguish a micro-checkpoint from a certified level. */
export default function N5Readiness({state,go,update}){
  // Approved exam items are intentionally empty until licensed content and audio are reviewed.
  const readiness=n5ReleaseReadiness(APPROVED_EXAM_ITEMS,state);
  const completed=N5_UNITS.filter(unit=>unitPassed(state,unit.id)).length;
  return <section className="rounded-2xl border border-line bg-paper p-5 space-y-4" aria-labelledby="readiness-title">
    <div className="space-y-1"><p className="text-xs font-black text-primary-strong">SEU JAPONÊS</p><h2 id="readiness-title" className="text-lg font-black text-ink-strong">Preparação N5</h2><p className="text-sm text-muted">Acompanhe todas as áreas estudadas e prepare-se para a revisão final. Conclusão do curso e certificação JLPT são coisas diferentes.</p></div>
    <div className="flex items-center justify-between text-sm"><strong className="text-ink-strong">Lições concluídas</strong><span className="font-bold text-primary-strong tabular-nums">{completed}/{N5_UNITS.length}</span></div>
    <div className="h-2.5 bg-raised rounded-full overflow-hidden" role="progressbar" aria-label="Microlições da trilha N5" aria-valuemin={0} aria-valuemax={N5_UNITS.length} aria-valuenow={completed}><div className="h-full bg-primary" style={{width:`${100*completed/N5_UNITS.length}%`}}/></div>
    <ul className="grid grid-cols-2 gap-2">{N5_TOPICS.map(topic=><li key={topic} className="rounded-lg border border-line bg-surface p-3 flex justify-between items-center gap-2 text-sm"><span className="text-ink-strong">{TOPICS[topic]}</span><strong className={readiness.foundations[topic]?'text-primary-strong':'text-muted'}>{unitsForTopic(topic).filter(unit=>unitPassed(state,unit.id)).length}/{unitsForTopic(topic).length}</strong></li>)}</ul>
    <p className="text-xs text-muted">Para praticar escuta, abra <strong>Praticar → Prática de escuta</strong> e use a voz japonesa do aparelho, sem baixar áudios.</p>
    {readiness.foundationsComplete&&<p className="rounded-xl bg-accent-soft p-4 text-sm text-primary-strong" role="status"><strong className="block">Você terminou as lições N5!</strong> Você estudou e aprovou os checkpoints de todas as áreas do curso. Agora pode fazer a revisão final formativa. Isso não equivale à aprovação no exame JLPT.</p>}
    {readiness.foundationsComplete&&<N5PersonalExam state={state} update={update}/>}
    <div className="border-t border-line pt-3 space-y-2">
      <h3 className="font-bold text-ink-strong">Próximas etapas</h3>
      {readiness.certified ? <p className="text-sm text-primary-strong font-bold">N5 validado internamente. Você pode continuar no N4 introdutório.</p> : <p role="status" className="text-sm text-muted">Você pode seguir praticando e revisando o que aprendeu. A prova final de validação ainda não está disponível.</p>}
    </div>
    {readiness.examAvailable && readiness.foundationsComplete && !readiness.certified && <N5Exam state={state} update={update} />}
    {!readiness.certified&&<Button variant="secondary" className="w-full" onClick={()=>go('path')}>{completed===N5_UNITS.length?'Revisar minha trilha':'Continuar N5'} →</Button>}
  </section>;
}
