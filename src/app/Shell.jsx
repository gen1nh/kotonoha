import React,{useState,useEffect} from 'react';
import {useThemePreference} from './model/useThemePreference.js';
import {Learn} from '../pages/library/index.js';
import {Review} from '../pages/review/index.js';
import {Settings} from '../pages/settings/index.js';
import Home from '../pages/home/index.js';
import PathTimeline from '../pages/learning-path/index.js';
import PracticeHub from '../pages/practice/index.js';
import ProgressOverview from '../pages/progress/index.js';
import LessonPlayer from '../pages/lesson/index.js';
import CheckpointPlayer from '../pages/checkpoint/index.js';
import Icon from '../shared/ui/Icon.jsx';
import {Brand,NAVIGATION,NavItem} from '../shared/ui/index.jsx';
import OnboardingModal from './ui/OnboardingModal.jsx';
import StreakPopover from './ui/StreakPopover.jsx';
import SpeedQuiz from './ui/SpeedQuiz.jsx';
import SyntaxLab from '../pages/syntax/index.js';
import LineSimulator from '../pages/conversation/index.js';
import PitchAccentLab from '../pages/pronunciation/index.js';
import Notebook from '../pages/notebook/index.js';

const PAGE_TITLES={home:'Início',path:'Trilha',practice:'Praticar',progress:'Progresso',learn:'Biblioteca',lesson:'Lição',checkpoint:'Checkpoint',review:'Revisão',notebook:'Caderno',errors:'Diário de erros',syntax:'Laboratório de frases',line:'Conversação',pitch:'Pronúncia',settings:'Preferências'};
const PRACTICE_VIEWS=['learn','review','notebook','errors','syntax','line','pitch'];
const IMMERSIVE_VIEWS=['lesson','review','checkpoint'];

export default function Shell({view,state,shared,message,install,installPrompt}) {
  const [theme,setTheme]=useThemePreference();
  const [online,setOnline]=useState(()=>typeof navigator!=='undefined'?navigator.onLine:true);
  useEffect(()=>{const on=()=>setOnline(true);const off=()=>setOnline(false);window.addEventListener('online',on);window.addEventListener('offline',off);return()=>{window.removeEventListener('online',on);window.removeEventListener('offline',off);};},[]);
  const [streakOpen,setStreakOpen]=useState(false);
  const [speedQuizOpen,setSpeedQuizOpen]=useState(false);
  const [onboardingOpen,setOnboardingOpen]=useState(()=>!state.onboardingCompleted);
  const immersive=IMMERSIVE_VIEWS.includes(view);
  const xp=(state.stats?.correct||0)*15;
  const navActive=id=>view===id||(id==='practice'&&PRACTICE_VIEWS.includes(view));
  const onCloseOnboarding=()=>{setOnboardingOpen(false);shared.update(s=>{s.onboardingCompleted=true;});};
  const onFinishOnboarding=()=>{setOnboardingOpen(false);shared.go('path');};
  const back=()=>shared.goBack();
  return <>
    <div className="min-h-[100dvh] flex flex-col lg:flex-row bg-paper text-ink w-full">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:p-3 focus:bg-paper focus:border focus:border-primary focus:rounded-xl">Pular para o conteúdo</a>
      {!immersive && <aside className="hidden lg:flex flex-col justify-between w-64 xl:w-72 shrink-0 bg-paper border-r border-line p-6 sticky top-0 h-screen z-30" aria-label="Navegação principal">
        <div className="space-y-7"><Brand onClick={()=>shared.go('home')}/><nav className="flex flex-col gap-1" aria-label="Áreas de estudo">{NAVIGATION.map(item=><NavItem key={item.id} item={item} active={navActive(item.id)} onClick={()=>shared.go(item.id)} />)}</nav></div>
        <div className="border-t border-line pt-3 space-y-2"><button type="button" onClick={()=>setOnboardingOpen(true)} className="flex w-full items-center gap-3 min-h-11 px-4 text-sm font-semibold text-muted rounded-xl hover:bg-raised"><Icon name="academic"/> Guia inicial</button><NavItem item={{id:'settings',label:'Preferências',icon:'settings'}} active={view==='settings'} onClick={()=>shared.go('settings')} /></div>
      </aside>}
      <div className="flex-1 min-w-0 w-full flex flex-col">
        {immersive ? <header className="sticky top-0 z-30 border-b border-line bg-paper px-4 py-3 pt-[calc(0.75rem+env(safe-area-inset-top))] flex items-center gap-3"><button type="button" onClick={back} aria-label="Voltar" className="h-11 w-11 flex items-center justify-center rounded-xl border border-line bg-surface text-ink-strong"><Icon name="arrow" className="w-5 h-5 rotate-180"/></button><div className="flex-1 min-w-0"><p className="text-xs font-bold text-primary-strong">SESSÃO DE ESTUDO</p><p className="font-bold text-ink-strong truncate">{PAGE_TITLES[view]}</p></div><span className="text-xs text-muted">{shared.route.level||"N5"}</span></header>
        : <header className="sticky top-0 z-20 border-b border-line bg-paper/95 backdrop-blur-sm min-h-16 px-4 sm:px-7 lg:px-10 pt-[env(safe-area-inset-top)] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0 lg:hidden"><img src="/icon.svg" alt="" aria-hidden="true" className="h-8 w-8 shrink-0 select-none pointer-events-none" /><strong className="text-base text-ink-strong truncate">{PAGE_TITLES[view]||'Kotonoha'}</strong></div>
          <div className="hidden lg:flex items-center gap-2 text-sm text-muted"><span>Kotonoha</span><span aria-hidden="true">/</span><strong className="text-ink-strong">{PAGE_TITLES[view]||'Início'}</strong></div>
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${online?'bg-primary':'bg-flame'}`} role="status" aria-label={online?'Conectado':'Sem conexão'} title={online?'Conectado':'Offline'}/>
            <span className="text-xs text-muted hidden sm:inline">{online?'Online':'Offline'}</span>
            <button type="button" onClick={()=>setStreakOpen(true)} aria-label={`Sequência: ${state.streak?.days||0} dias`} className="min-h-11 px-2 flex items-center gap-1 font-bold text-flame-ink rounded-xl hover:bg-raised"><Icon name="flame" className="w-5 h-5"/><span>{state.streak?.days||0}</span></button>
            <span className="hidden lg:flex items-center text-sm font-bold text-muted">{xp} XP</span>
            <button type="button" onClick={()=>shared.go('settings')} className="min-h-11 min-w-11 rounded-xl flex items-center justify-center border border-line text-ink-strong" aria-label="Abrir preferências"><Icon name="settings"/></button>
          </div>
        </header>}
        <main id="main-content" tabIndex={-1} className={`flex-1 w-full min-w-0 px-4 sm:px-7 lg:px-10 py-5 lg:py-8 ${immersive?'pb-[calc(2rem+env(safe-area-inset-bottom))]':'pb-[calc(6.5rem+env(safe-area-inset-bottom))] lg:pb-10'}`}>
          <section id={`view-${view}`} className="w-full min-w-0">
            {view==='home'&&<Home {...shared}/>}
            {view==='path'&&<PathTimeline {...shared}/>}
            {view==='lesson'&&<LessonPlayer {...shared} topic={shared.route.topic} level={shared.route.level}/>}
            {view==='checkpoint'&&<CheckpointPlayer {...shared} topic={shared.route.topic}/>}
            {view==='practice'&&<PracticeHub state={state} go={shared.go} openSpeedQuiz={()=>setSpeedQuizOpen(true)} openGuidedLesson={shared.openGuidedLesson} openCheckpoint={shared.openCheckpoint}/>}
            {view==='progress'&&<ProgressOverview {...shared}/>}
            {view==='learn'&&<Learn {...shared}/>}
            {view==='review'&&<Review {...shared} returnToLesson={shared.reviewContext?.view==='lesson'?()=>shared.openGuidedLesson(shared.reviewContext.topic,shared.reviewContext.level):null} openGuidedCheckpoint={shared.openCheckpoint}/>}
            {view==='notebook'&&<Notebook {...shared}/>}
            {view==='syntax'&&<SyntaxLab {...shared}/>}
            {view==='line'&&<LineSimulator {...shared}/>}
            {view==='pitch'&&<PitchAccentLab {...shared}/>}
            {view==='settings'&&<Settings {...shared} theme={theme} setTheme={setTheme} install={install} installPrompt={installPrompt} onOpenOnboarding={()=>setOnboardingOpen(true)}/>}
          </section>
        </main>
        {!immersive&&<nav aria-label="Navegação móvel" className="lg:hidden fixed inset-x-0 bottom-0 z-30 bg-paper/95 backdrop-blur-md border-t border-line grid grid-cols-4 px-2 pt-1 pb-[calc(0.5rem+env(safe-area-inset-bottom))] mobile-tabbar">{NAVIGATION.map(item=><NavItem mobile key={item.id} item={item} active={navActive(item.id)} onClick={()=>shared.go(item.id)}/>)}</nav>}
      </div>
    </div>
    {onboardingOpen&&<OnboardingModal state={state} update={shared.update} onClose={onCloseOnboarding} onComplete={onFinishOnboarding}/>}
    {streakOpen&&<StreakPopover state={state} onClose={()=>setStreakOpen(false)}/>}
    {speedQuizOpen&&<SpeedQuiz state={state} update={shared.update} onClose={()=>setSpeedQuizOpen(false)}/>}
    <div id="toast" role="status" aria-live="polite" className={`fixed z-50 left-4 right-4 mx-auto max-w-md bottom-[calc(6rem+env(safe-area-inset-bottom))] lg:bottom-5 rounded-xl border border-line bg-paper px-4 py-3 text-sm font-semibold text-ink-strong transition-all ${message?'opacity-100':'opacity-0 pointer-events-none'}`}>{message}</div>
  </>;
}
