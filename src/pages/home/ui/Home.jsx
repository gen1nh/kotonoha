import React from 'react';
import { todayKey, cardMatchesLevel, lessonsFor, isDone, nextGuidedAction, courseLevel, dailyActivityCount, dailyGoal } from '../../../entities/study/index.js';
import DailyQuestion from './DailyQuestion.jsx';
import { Button } from '../../../shared/ui/index.jsx';

/** The next learning action comes from the existing guided engine, never from a duplicate curriculum. */
export default function Home({state,update,go,speak,openGuidedLesson,openCheckpoint}) {
 const level=courseLevel(state);
 const lessons=lessonsFor(level);
 const completed=lessons.filter(l=>isDone(state,level,l)).length;
 const action=nextGuidedAction(state,level);
 const due=Object.values(state.cards||{}).filter(c=>c.seen&&c.due<=Date.now()&&cardMatchesLevel(c,level)).length;
 const activities=dailyActivityCount(state);
 const goal=dailyGoal(state);
 const dailyDone=Number.isInteger(state.dailyAnswers?.[`${todayKey()}:${level}`]);
 const recommendReview=due>=5&&activities===0&&action.kind!=='checkpoint';
 const continueLearning=()=>{
  if(recommendReview){go('review');return;}
  if(!action.lesson){go(action.kind==='assessment-pending'?'progress':'path');return;}
  if(action.kind==='checkpoint')openCheckpoint(action.lesson.id);
  else openGuidedLesson(action.lesson.id,level);
 };
 const title=recommendReview?'Vamos relembrar o que você aprendeu':action.lesson?.title||
  (action.kind==='assessment-pending'?'Você concluiu as lições N5':'Sua trilha está em dia!');
 const description=recommendReview?`${due} cartões precisam de revisão. Depois, você continua suas lições.`:
  action.lesson?.detail||
  (action.kind==='assessment-pending'?'Continue revisando enquanto a avaliação final é preparada.':'Você pode reforçar o que aprendeu quando quiser.');
 const label=recommendReview?'Começar revisão':action.kind==='checkpoint'?'Fazer teste rápido':action.lesson?'Continuar aprendendo':action.kind==='assessment-pending'?'Ver minha evolução':'Ver minha trilha';
 return <div className="mx-auto max-w-3xl space-y-5 pb-6">
  <header className="pt-1 space-y-1">
   <p className="text-xs font-semibold text-muted">Seu japonês · {level}</p>
   <h1 className="text-2xl sm:text-3xl font-black text-ink-strong">Seu próximo passo</h1>
   <p className="text-sm text-muted">Preparamos a próxima atividade para você.</p>
  </header>
  <section className="rounded-2xl border border-line bg-paper p-5 sm:p-6 space-y-4" aria-labelledby="next-step-title">
   <div className="flex items-center justify-between gap-3 text-sm">
    <span className="font-semibold text-ink-strong">Sua jornada {level}</span>
    <span className="text-muted">{completed} de {lessons.length} lições</span>
   </div>
   <div role="progressbar" aria-label="Lições concluídas" aria-valuemin={0} aria-valuemax={lessons.length} aria-valuenow={completed} className="h-2 rounded-full bg-raised overflow-hidden">
    <div className="h-full bg-primary" style={{width:`${100*completed/Math.max(1,lessons.length)}%`}}/>
   </div>
   <div className="space-y-2">
    <h2 id="next-step-title" className="text-xl font-black text-ink-strong">{title}</h2>
    <p className="text-sm text-muted">{description}</p>
   </div>
   <Button variant="primary" size="lg" className="w-full" onClick={continueLearning}>{label} →</Button>
  </section>
  <section className="rounded-2xl border border-line bg-paper p-4 sm:p-5 space-y-3" aria-labelledby="daily-title">
   <div className="flex items-center justify-between gap-2">
    <h2 id="daily-title" className="font-bold text-ink-strong">Sua meta de hoje</h2>
    <span className="text-sm font-bold text-ink-strong">{Math.min(activities,goal)} de {goal}</span>
   </div>
   <div role="progressbar" aria-label="Meta diária" aria-valuemin={0} aria-valuemax={goal} aria-valuenow={Math.min(activities,goal)} className="h-2 rounded-full bg-raised overflow-hidden">
    <div className="h-full bg-primary" style={{width:`${Math.min(100,100*activities/goal)}%`}}/>
   </div>
   <p className="text-xs text-muted">{activities>=goal?'Meta alcançada! Volte amanhã ou continue no seu ritmo.':'Cada lição concluída ou revisão completa conta para sua meta.'}</p>
  </section>
  {due>0&&!recommendReview&&<div className="flex items-center justify-between gap-2 rounded-xl border border-line bg-paper p-4">
   <p className="text-sm text-ink-strong">{due} {due===1?'cartão para revisar':'cartões para revisar'}</p>
   <button type="button" className="min-h-11 text-sm font-semibold text-ink-strong underline" onClick={()=>go('review')}>Revisar</button>
  </div>}
  <details className="rounded-2xl border border-line bg-paper p-4">
   <summary className="min-h-11 cursor-pointer font-semibold text-ink-strong">{dailyDone?'Rever desafio do dia':'Desafio do dia · opcional'}</summary>
   <div className="pt-3"><DailyQuestion state={state} update={update} speak={speak} go={go} level={level}/></div>
  </details>
 </div>;
}
