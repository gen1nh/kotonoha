import React, {useState} from 'react';
import { lessonsFor,isDone } from '../../../entities/study/index.js';
import { dailyActivityCount,dailyGoal } from '../../../entities/study/index.js';
import { todayKey } from '../../../entities/study/index.js';
import { hasUnlockedN4 } from '../../../entities/study/index.js';
import Icon from '../../../shared/ui/Icon.jsx';
import JlptDiagnostic from './JlptDiagnostic.jsx';
import { LEVELS } from '../../../entities/study/index.js';
import { courseLevel } from '../../../entities/study/index.js';
import N5Readiness from './N5Readiness.jsx';
export default function ProgressOverview({state,go,update,toast,changeLevel}) {
  const [section,setSection]=useState('overview');
  const [mockScore,setMockScore]=useState('');
  const [mockError,setMockError]=useState('');
  const displayLevel=state.selectedLevel||'N5';
  const mocks=(state.mocks||[]).filter(entry=>entry.level===displayLevel).slice(0,5);
  const addMock=(event)=>{
    event.preventDefault();
    const score=Number(mockScore);
    if(mockScore.trim()==='' || !Number.isFinite(score) || score<0 || score>100){setMockError('Informe um percentual válido entre 0 e 100.');return;}
    update(s=>{s.mocks ||= [];s.mocks.unshift({level:displayLevel,score,date:new Date().toISOString().slice(0,10)});s.mocks=s.mocks.slice(0,200);});
    setMockError('');setMockScore('');toast?.('Resultado pessoal registrado no dispositivo.');
  };
  const currentLevel=courseLevel(state);
  const lessons=lessonsFor(currentLevel);
  const completed=lessons.filter(l=>isDone(state,currentLevel,l)).length;
  const today=dailyActivityCount(state);
  const goal=dailyGoal(state);
  const checked=Object.values(state.cards||{}).filter(c=>c.seen).length;
  const due=Object.values(state.cards||{}).filter(c=>c.seen&&c.due<=Date.now()).length;
  const correct=state.stats?.correct||0;const reviews=state.stats?.reviews||0;
  const total=Object.values(state.cards||{}).length;
  const todaySeconds=state.studyLog?.[todayKey()] || 0;
  return <div className="mx-auto max-w-3xl space-y-5">
    <header className="space-y-1"><p className="text-sm text-primary-strong font-bold">Sua evolução</p><h1 className="text-2xl font-black text-ink-strong">Progresso</h1><p className="text-sm text-muted">O progresso da trilha é validado por checkpoints, não apenas por tempo de uso.</p></header>
    <nav aria-label="Seções do progresso" className="flex gap-2 overflow-x-auto pb-1">
      {[["overview","Resumo"],["preparation","Preparação N5"],["exam","Simulados"]].map(([id,label])=><button type="button" key={id} aria-current={section===id?"page":undefined} onClick={()=>setSection(id)} className={`shrink-0 min-h-11 rounded-xl border-2 px-4 text-sm font-bold ${section===id?"border-primary bg-accent-soft text-primary-strong":"border-line bg-paper text-ink-strong"}`}>{label}</button>)}
    </nav>
    {section==="overview"&&<>
    <section className="rounded-2xl border border-line bg-paper p-5 space-y-4" aria-label="Resumo da aprendizagem">
      <h2 className="font-bold text-lg text-ink-strong">Competências {currentLevel}</h2>
      <div className="flex items-center justify-between"><p className="text-sm text-ink">{completed} de {lessons.length} etapas validadas</p><strong className="text-primary-strong">{Math.round(100*completed/Math.max(1,lessons.length))}%</strong></div>
      <div role="progressbar" aria-label="Etapas validadas" aria-valuemin={0} aria-valuemax={lessons.length} aria-valuenow={completed} className="h-3 overflow-hidden bg-raised rounded-full"><div className="bg-primary h-full rounded-full" style={{width:`${100*completed/Math.max(1,lessons.length)}%`}} /></div>
      <p className="text-sm text-muted">Seu próximo passo é mostrado na Home. A timeline com todos os detalhes fica somente na Trilha.</p>
      <button onClick={()=>go('path')} className="min-h-11 text-sm text-primary-strong font-bold">Ir para minha trilha →</button>
    </section>
    <section className="grid grid-cols-2 gap-3" aria-label="Indicadores complementares">
      <div className="rounded-2xl border border-line bg-paper p-4"><p className="text-xs text-muted">Atividades hoje</p><p className="font-black text-2xl text-ink-strong">{today}<span className="text-sm text-muted">/{goal}</span></p><p className="text-xs text-muted">Concluídas, não tempo de tela</p></div>
      <div className="rounded-2xl border border-line bg-paper p-4"><p className="text-xs text-muted">Precisão em revisões</p><p className="font-black text-2xl text-ink-strong">{reviews?Math.round(correct/reviews*100):0}%</p><p className="text-xs text-muted">Em {reviews} avaliações de cartões</p></div>
      <div className="rounded-2xl border border-line bg-paper p-4"><p className="text-xs text-muted">Revisões vencidas</p><p className="font-black text-2xl text-ink-strong">{due}</p><p className="text-xs text-muted">Cartões aguardando prática</p></div>
      <div className="rounded-2xl border border-line bg-paper p-4"><p className="text-xs text-muted">Tempo ativo hoje</p><p className="font-black text-2xl text-ink-strong">{Math.floor(todaySeconds/60)} <span className="text-sm">min</span></p><p className="text-xs text-muted">Indicador complementar</p></div>
    </section>
    </>}
    {section==="preparation"&&<>
    <N5Readiness state={state} go={go} update={update}/>
    <section className="rounded-2xl border border-line bg-paper p-5 space-y-2"><h2 className="font-bold text-ink-strong">Próximos níveis</h2><p className="text-sm text-muted">{hasUnlockedN4(state) ? 'N5 validado internamente. O N4 introdutório está disponível; o currículo completo N4–N1 ainda está em construção.' : 'Checkpoints concluídos não equivalem à aprovação no N5. Continue estudando e acompanhe a preparação para a prova de passagem.'}</p></section>
    </>}
    {section==="exam"&&<details className="rounded-2xl border border-line bg-paper p-4 sm:p-5 space-y-3" open>
      <summary className="cursor-pointer min-h-11 flex items-center font-bold text-lg text-ink-strong">Preparação para o JLPT e exercícios extras <span className="ml-auto text-xs font-normal text-muted">Opcional</span></summary>
      <div className="pt-4 space-y-5">
        <div className="rounded-xl bg-raised p-4 space-y-3">
          <p className="text-sm text-muted">As provas de prática, exercícios para imprimir e registros são recursos opcionais. Não desbloqueiam a Trilha nem substituem os checkpoints.</p>
          <label className="block text-sm font-bold text-ink-strong">Consultar nível de referência
            <select className="mt-2 min-h-11 w-full rounded-lg border border-line bg-paper p-2 text-ink-strong" aria-label="Consultar nível JLPT" value={displayLevel} onChange={e=>changeLevel(e.target.value)}>{LEVELS.map(([id,label])=><option key={id} value={id}>{id} · {label}</option>)}</select>
          </label>
          <div className="flex flex-wrap gap-3"><a href="https://www.jlpt.jp/e/samples/sampleindex.html" target="_blank" rel="noreferrer" className="inline-flex items-center min-h-11 text-sm font-bold underline text-primary-strong">Exemplos de provas JLPT ↗</a><a href="https://www.jlpt.jp/e/samples/forlearners.html" target="_blank" rel="noreferrer" className="inline-flex items-center min-h-11 text-sm font-bold underline text-primary-strong">Questões e áudios oficiais ↗</a></div>
        </div>
        <JlptDiagnostic state={state} update={update} toast={toast}/>
        <section className="rounded-xl border border-line p-4 space-y-3" aria-labelledby="mock-results-title">
          <h3 id="mock-results-title" className="font-bold text-ink-strong">Meu registro de simulados · {displayLevel}</h3>
          <p className="text-sm text-muted">Anote o percentual de uma prova ou exercício que realizou. Esse registro é pessoal e não indica aprovação oficial.</p>
          <form onSubmit={addMock} className="flex gap-2 items-start"><div className="flex-1"><label htmlFor="mock-score" className="sr-only">Percentual de acertos</label><input id="mock-score" type="number" step="1" min="0" max="100" value={mockScore} onChange={e=>setMockScore(e.target.value)} placeholder="Acertos (%)" className="min-h-11 w-full rounded-lg border border-line bg-paper px-3 text-ink-strong"/>{mockError&&<p role="alert" className="text-xs text-danger mt-1">{mockError}</p>}</div><button type="submit" className="min-h-11 rounded-lg bg-primary text-white font-bold text-sm px-4">Registrar</button></form>
          <ul className="space-y-2 text-sm">{mocks.map((entry,index)=><li key={`${entry.date}-${index}`} className="rounded-lg p-2 bg-raised flex items-center justify-between gap-3"><span className="text-ink-strong">{entry.date}</span><strong className="text-primary-strong">{entry.score}%</strong></li>)}{!mocks.length&&<li className="text-muted">Nenhum resultado registrado.</li>}</ul>
        </section>
      </div>
    </details>}
  </div>;
}
