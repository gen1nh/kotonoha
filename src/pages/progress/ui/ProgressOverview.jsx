import React from 'react';
import {useSubpageNavigation} from '../../../shared/lib/useSubpageNavigation.js';
import { lessonsFor,isDone } from '../../../entities/study/index.js';
import { dailyActivityCount,dailyGoal } from '../../../entities/study/index.js';
import { todayKey } from '../../../entities/study/index.js';
import { hasUnlockedN4 } from '../../../entities/study/index.js';
import Icon from '../../../shared/ui/Icon.jsx';
import JlptDiagnostic from './JlptDiagnostic.jsx';
import {NavigationTile} from '../../../shared/ui/index.jsx';
import SimuladosHub from './SimuladosHub.jsx';
import { courseLevel } from '../../../entities/study/index.js';
import N5Readiness from './N5Readiness.jsx';
export default function ProgressOverview({state,go,update,toast,changeLevel}) {
  const [section,setSection,backSection]=useSubpageNavigation('progress','overview',['overview','preparation','exam']);
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
    <header className="space-y-1"><p className="text-sm text-muted font-semibold">Sua jornada e suas ferramentas</p><h1 className="text-2xl font-black text-ink-strong">Meu espaço</h1><p className="text-sm text-muted">Veja o que aprendeu e encontre ajuda quando precisar.</p></header>
    {section!=='overview'&&<button type="button" className="min-h-11 text-sm font-semibold text-ink-strong" onClick={backSection}>← Voltar ao meu espaço</button>}
    {section==="overview"&&<>
    <section className="rounded-2xl border border-line bg-accent-soft/40 p-5 space-y-4" aria-label="Resumo da aprendizagem">
      <h2 className="font-bold text-lg text-ink-strong">Seu progresso no {currentLevel}</h2>
      <div className="flex items-center justify-between"><p className="text-sm text-ink">{completed} de {lessons.length} lições concluídas</p><strong className="text-primary-strong">{Math.round(100*completed/Math.max(1,lessons.length))}%</strong></div>
      <div role="progressbar" aria-label="Etapas validadas" aria-valuemin={0} aria-valuemax={lessons.length} aria-valuenow={completed} className="h-3 overflow-hidden bg-raised rounded-full"><div className="bg-primary h-full rounded-full" style={{width:`${100*completed/Math.max(1,lessons.length)}%`}} /></div>
      <p className="text-sm text-muted">Sua próxima atividade está em Hoje.</p>
      <button onClick={()=>go('path')} className="min-h-11 text-sm text-ink-strong underline font-semibold">Ver minha trilha</button>
    </section>
    <section aria-labelledby="my-tools-heading" className="space-y-3">
      <div className="space-y-1">
       <h2 id="my-tools-heading" className="text-lg font-bold text-ink-strong">Para continuar estudando</h2>
       <p className="text-sm text-muted">Se precisar de ajuda ou quiser reforçar algum assunto.</p>
      </div>
      <nav aria-label="Ferramentas e recursos" className="grid grid-cols-2 gap-3">
       <NavigationTile tone="sky" title="Revisar" icon="review" description="Relembrar palavras." onClick={()=>go('review')}/>
       <NavigationTile tone="sage" title="Biblioteca" icon="learn" description="Consultar o japonês." onClick={()=>go('learn')}/>
       <NavigationTile tone="peach" title="Caderno" icon="academic" description="Notas, dúvidas e erros." onClick={()=>go('notebook')}/>
       <NavigationTile tone="lilac" title="Treinos extras" icon="bolt" description="Escuta e escrita." onClick={()=>go('practice')}/>
      </nav>
    </section>
    <section className="space-y-3" aria-label="Avaliações e configurações">
     <h2 className="text-lg font-bold text-ink-strong">Sua preparação e ajustes</h2>
     <div className="overflow-hidden rounded-2xl border border-line bg-paper divide-y divide-line">
      <button type="button" className="flex min-h-14 w-full items-center justify-between px-4 text-sm font-semibold text-ink-strong" onClick={()=>setSection('preparation')}>Preparação N5 <span aria-hidden="true">→</span></button>
      <button type="button" className="flex min-h-14 w-full items-center justify-between px-4 text-sm font-semibold text-ink-strong" onClick={()=>setSection('exam')}>Simulados <span aria-hidden="true">→</span></button>
      <button type="button" className="flex min-h-14 w-full items-center justify-between px-4 text-sm font-semibold text-ink-strong" onClick={()=>go('settings')}>Preferências <span aria-hidden="true">→</span></button>
     </div>
    </section>
    <details className="rounded-2xl border border-line bg-paper p-4">
     <summary className="min-h-11 cursor-pointer font-semibold text-ink-strong">Ver mais números</summary>
     <div className="pt-3 space-y-3">
    <section className="grid grid-cols-2 gap-3" aria-label="Indicadores complementares">
      <div className="rounded-2xl border border-line bg-paper p-4"><p className="text-xs text-muted">Atividades hoje</p><p className="font-black text-2xl text-ink-strong">{today}<span className="text-sm text-muted">/{goal}</span></p><p className="text-xs text-muted">Concluídas, não tempo de tela</p></div>
      <div className="rounded-2xl border border-line bg-paper p-4"><p className="text-xs text-muted">Precisão em revisões</p><p className="font-black text-2xl text-ink-strong">{reviews?Math.round(correct/reviews*100):0}%</p><p className="text-xs text-muted">Em {reviews} avaliações de cartões</p></div>
      <div className="rounded-2xl border border-line bg-paper p-4"><p className="text-xs text-muted">Revisões vencidas</p><p className="font-black text-2xl text-ink-strong">{due}</p><p className="text-xs text-muted">Cartões aguardando prática</p></div>
      <div className="rounded-2xl border border-line bg-paper p-4"><p className="text-xs text-muted">Tempo ativo hoje</p><p className="font-black text-2xl text-ink-strong">{Math.floor(todaySeconds/60)} <span className="text-sm">min</span></p><p className="text-xs text-muted">Indicador complementar</p></div>
    </section>
    <details className="rounded-2xl border border-line bg-paper p-4">
      <summary className="min-h-11 flex cursor-pointer items-center font-bold text-ink-strong">Estatísticas detalhadas e tempo de estudo</summary>
      <div className="pt-3"><JlptDiagnostic state={state} update={update} toast={toast}/></div>
    </details>
     </div>
    </details>
    </>}
    {section==="preparation"&&<>
    <N5Readiness state={state} go={go} update={update}/>
    <section className="rounded-2xl border border-line bg-paper p-5 space-y-2"><h2 className="font-bold text-ink-strong">Próximos níveis</h2><p className="text-sm text-muted">{hasUnlockedN4(state) ? 'N5 validado internamente. O N4 introdutório está disponível; o currículo completo N4–N1 ainda está em construção.' : 'Checkpoints concluídos não equivalem à aprovação no N5. Continue estudando e acompanhe a preparação para a prova de passagem.'}</p></section>
    </>}
    {section==="exam"&&<SimuladosHub state={state} update={update} toast={toast}/>}

  </div>;
}
