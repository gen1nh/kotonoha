import React from 'react';
import {n5ReleaseReadiness} from '../pedagogy/readiness.js';
import {N5_CURRICULUM} from '../pedagogy/n5Curriculum.js';
import {APPROVED_EXAM_ITEMS} from '../pedagogy/publishedItems.js';
import N5Exam from './N5Exam.jsx';
import {N5_TOPICS} from '../courseUnits.js';
import {Button} from './ui/index.jsx';
const TOPICS={hiragana:'Hiragana',katakana:'Katakana',words:'Vocabulário',grammar:'Gramática'};

/** Always distinguish a micro-checkpoint from a certified level. */
export default function N5Readiness({state,go,update}){
  // Approved exam items are intentionally empty until licensed content and audio are reviewed.
  const readiness=n5ReleaseReadiness(APPROVED_EXAM_ITEMS,state);
  const completed=N5_TOPICS.filter(topic=>readiness.foundations[topic]).length;
  return <section className="rounded-2xl border border-line bg-paper p-5 space-y-4" aria-labelledby="readiness-title">
    <div className="space-y-1"><p className="text-xs font-black text-primary-strong">CAMINHO PARA O N4</p><h2 id="readiness-title" className="text-lg font-black text-ink-strong">Preparação N5</h2><p className="text-sm text-muted">Aprender e concluir checkpoints é diferente de comprovar todo o N5. A prova interna exige leitura, gramática, vocabulário e áudio revisados.</p></div>
    <div className="flex items-center justify-between text-sm"><strong className="text-ink-strong">Fundamentos da trilha</strong><span className="font-bold text-primary-strong tabular-nums">{completed}/{N5_TOPICS.length}</span></div>
    <div className="h-2.5 bg-raised rounded-full overflow-hidden" role="progressbar" aria-label="Fundamentos da trilha N5" aria-valuemin={0} aria-valuemax={N5_TOPICS.length} aria-valuenow={completed}><div className="h-full bg-primary" style={{width:`${100*completed/N5_TOPICS.length}%`}}/></div>
    <ul className="grid grid-cols-2 gap-2">{N5_TOPICS.map(topic=><li key={topic} className="rounded-lg border border-line bg-surface p-3 flex justify-between items-center gap-2 text-sm"><span className="text-ink-strong">{TOPICS[topic]}</span><strong className={readiness.foundations[topic]?'text-primary-strong':'text-muted'}>{readiness.foundations[topic]?'✓':'—'}</strong></li>)}</ul>
    <p className="text-xs text-muted">Para treinar escuta agora, abra <strong>Praticar → Prática de escuta</strong> e use a voz japonesa do aparelho, sem baixar áudios.</p>
    <div className="border-t border-line pt-3 space-y-2">
      <h3 className="font-bold text-ink-strong">Avaliação de passagem</h3>
      {readiness.certified ? <p className="text-sm text-primary-strong font-bold">N5 validado internamente. Você pode continuar no N4 introdutório.</p> : <p role="status" className="text-sm text-muted">A prova abrangente ainda não foi liberada: faltam questões revisadas e gravações adequadas para avaliar escuta. A voz do navegador pode ser usada para praticar, mas não certifica o N5.</p>}
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">{Object.entries(readiness.bySkill).map(([id,row])=><li key={id} className="rounded-lg bg-raised p-3"><strong className="block text-ink-strong">{row.label}</strong><span className="text-muted">Banco aprovado: {row.approved}/{row.required} itens mínimos. Competências sem itens: {readiness.missingCompetencies[id]?.length ?? 0}</span></li>)}</ul>
      <p className="text-xs text-muted">O currículo editorial N5 contempla {N5_CURRICULUM.length} grupos de competências. Os mínimos exibidos são internos e provisórios, não uma fórmula oficial do JLPT.</p>
    </div>
    {readiness.examAvailable && readiness.foundationsComplete && !readiness.certified && <N5Exam state={state} update={update} />}
    {!readiness.certified&&<Button variant="secondary" className="w-full" onClick={()=>go('path')}>{completed===N5_TOPICS.length?'Revisar minha trilha':'Continuar N5'} →</Button>}
  </section>;
}
