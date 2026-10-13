import React from 'react';
import { todayKey, cardMatchesLevel } from '../../../entities/study/index.js';
import { lessonsFor, isDone, nextGuidedAction, courseLevel } from '../../../entities/study/index.js';
import { dailyActivityCount, dailyGoal } from '../../../entities/study/index.js';
import DailyQuestion from './DailyQuestion.jsx';
import Icon from '../../../shared/ui/Icon.jsx';
import { Button } from '../../../shared/ui/index.jsx';

export default function Home({state,update,go,speak,openGuidedLesson,openCheckpoint}) {
  const level=courseLevel(state);
  const lessons=lessonsFor(level);
  const completed=lessons.filter(l=>isDone(state,level,l)).length;
  const action=nextGuidedAction(state,level);
  const due=Object.values(state.cards).filter(c=>c.seen&&c.due<=Date.now()&&cardMatchesLevel(c,level)).length;
  const activities=dailyActivityCount(state);
  const goal=dailyGoal(state);
  const dailyDone=Number.isInteger(state.dailyAnswers?.[`${todayKey()}:${level}`]);
  const continueLearning=()=>!action.lesson?go(action.kind==='assessment-pending'?'progress':'path'):action.kind==='checkpoint'?openCheckpoint(action.lesson.id):openGuidedLesson(action.lesson.id,level);
  return <div className="mx-auto max-w-3xl space-y-5 pb-6">
    <header className="pt-1 space-y-1"><p className="text-xs font-bold text-primary-strong">JORNADA DE JAPONÊS · {level}</p><h1 className="text-2xl sm:text-3xl font-black text-ink-strong">Seu próximo passo</h1><p className="text-sm text-muted">Continue de onde parou. Você não precisa escolher entre várias ferramentas.</p></header>
    <section className="rounded-2xl border border-line bg-paper p-5 sm:p-6 space-y-4" aria-labelledby="next-step-title">
      <div className="flex justify-between gap-2 text-xs font-semibold"><span className="text-primary-strong">TRILHA {level}</span><span className="text-muted">{completed}/{lessons.length} etapas</span></div>
      <div role="progressbar" aria-label="Progresso do nível" aria-valuemin={0} aria-valuemax={lessons.length} aria-valuenow={completed} className="h-2.5 rounded-full bg-raised overflow-hidden"><div className="h-full rounded-full bg-primary" style={{width:`${100*completed/Math.max(1,lessons.length)}%`}} /></div>
      <div className="flex gap-3 items-start"><span className="h-12 w-12 shrink-0 rounded-xl bg-accent-soft text-primary-strong flex items-center justify-center"><Icon name="learn" className="w-6 h-6"/></span><div><h2 id="next-step-title" className="text-xl font-black text-ink-strong">{action.lesson?.title || (action.kind==='assessment-pending'?'Base N5 concluída — prova pendente':'Base concluída!')}</h2><p className="text-sm text-muted mt-1">{action.lesson?.detail||(action.kind==='assessment-pending'?'Os checkpoints validam microlições. A passagem N5 → N4 exige uma prova abrangente com áudio e conteúdo revisado.':'Sua trilha está completa. Continue revisando para manter o conhecimento.')}</p></div></div>
      {action.kind==='checkpoint' && <p className="rounded-xl bg-raised p-3 text-sm text-ink-strong">Você praticou os cartões desta etapa. Agora é hora de demonstrar o que aprendeu.</p>}
      <Button variant="primary" size="lg" className="w-full" onClick={continueLearning}>{action.label} →</Button>
      <button onClick={()=>go('path')} type="button" className="min-h-11 text-sm text-primary-strong font-bold w-full">Ver trilha completa</button>
    </section>
    <section className="grid grid-cols-2 gap-3" aria-label="Atalhos de estudo">
      <button onClick={()=>go('review')} className="rounded-2xl border border-line bg-paper p-4 min-h-28 text-left flex flex-col justify-between"><Icon name="review" className="w-6 h-6 text-primary-strong"/><span><strong className="block text-ink-strong text-sm">Revisões</strong><span className="text-xs text-muted">{due?`${due} aguardando`:'Em dia'}</span></span></button>
      <button onClick={()=>go('progress')} className="rounded-2xl border border-line bg-paper p-4 min-h-28 text-left flex flex-col justify-between"><Icon name="trophy" className="w-6 h-6 text-primary-strong"/><span><strong className="block text-ink-strong text-sm">Meu progresso</strong><span className="text-xs text-muted">{activities}/{goal} atividades hoje</span></span></button>
    </section>
    <section className="rounded-2xl border border-line bg-paper p-5 space-y-3" aria-labelledby="daily-title">
      <div className="flex flex-wrap justify-between items-center gap-2"><h2 id="daily-title" className="font-black text-ink-strong">Meta diária</h2><span className="text-sm font-bold text-ink-strong">{activities} de {goal}</span></div>
      <div role="progressbar" aria-label="Meta diária" aria-valuemin={0} aria-valuemax={goal} aria-valuenow={Math.min(activities,goal)} className="h-2.5 rounded-full bg-raised overflow-hidden"><div className="h-full bg-primary" style={{width:`${Math.min(100,100*activities/goal)}%`}} /></div>
      <button type="button" onClick={()=>go("settings")} className="min-h-11 text-sm text-primary-strong font-bold">Editar meta nas Preferências →</button>
      <p className="text-xs text-muted">Contamos checkpoints aprovados, lições avançadas concluídas e sessões de revisão completas. Tempo de tela e tentativas isoladas não aumentam a meta.</p>
      <details className="rounded-xl border border-line p-3"><summary className="cursor-pointer text-sm text-primary-strong font-bold">{dailyDone?'Rever questão diária':'Questão diária (opcional)'}</summary><div className="mt-3"><DailyQuestion state={state} update={update} speak={speak} go={go} level={level}/></div></details>
    </section>
  </div>;
}
