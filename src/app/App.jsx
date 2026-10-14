import React, {useState,useEffect,useCallback,useRef} from 'react';
import Shell from './Shell.jsx';
import {
  KEY, initialState, normalizeState, selectReview,
  startTracker, setTrackingEnabled, takePendingSeconds, addStudySeconds,
  collectActivityChanges, resolveView, viewFromSearch,
  isAccessibleLesson, isAccessibleCheckpoint, courseLevel,
  cardIdsForUnit, unitById, unitsForTopic, unitPassed,
  speakJapanese, warmJapaneseVoices, stopSpeech
} from '../entities/study/index.js';

/** All screen transitions go through this router; each user action writes one history entry. */
function parseRoute(state) {
  const result=viewFromSearch(window.location.search,state);
  const params=new URLSearchParams(window.location.search);
  const originalTopic=params.get('topic');
  const topic=['hiragana','katakana','words','grammar'].includes(originalTopic) ? (unitsForTopic(originalTopic).find(unit=>!unitPassed(state,unit.id))||unitsForTopic(originalTopic)[0])?.id : originalTopic;
  const level=params.get('level')||'N5';
  if(topic!==originalTopic&&topic&&['lesson','checkpoint'].includes(result.view))history.replaceState(history.state,'',routeUrl(result.view,topic,'N5'));
  if (result.view==='lesson' && !isAccessibleLesson(state,topic,level)) return {view:'path',topic:null,level:'N5',blocked:true};
  if (result.view==='checkpoint' && !isAccessibleCheckpoint(state,topic)) return {view:'path',topic:null,level:'N5',blocked:true};
  return {...result,topic:result.view==='lesson'||result.view==='checkpoint'?topic:null,level};
}
function routeUrl(view,topic,level) {
  const url=new URL(window.location.href);
  url.search='';
  if(view!=='home') url.searchParams.set('view',view);
  if(topic && ['lesson','checkpoint'].includes(view)) url.searchParams.set('topic',topic);
  if(view==='lesson' && level && level!=='N5') url.searchParams.set('level',level);
  return url.pathname+url.search;
}

export default function App(){
  const [message,setMessage]=useState('');
  const toast=useCallback(text=>setMessage(text),[]);
  const [state,setState]=useState(()=>{try{const raw=localStorage.getItem(KEY);return raw?normalizeState(JSON.parse(raw)):initialState();}catch{return initialState();}});
  const [storageBlocked,setStorageBlocked]=useState(()=>{try{const raw=localStorage.getItem(KEY);if(raw)normalizeState(JSON.parse(raw));return false;}catch{return true;}});
  const [route,setRoute]=useState(()=>parseRoute(state));
  const [reviewContext,setReviewContext]=useState(()=>history.state?.reviewOrigin||null);
  const [saveError,setSaveError]=useState(false);
  const stateSnapshot=useRef(state);
  const [learnTopic,setLearnTopic]=useState('hiragana');
  const [queue,setQueue]=useState(()=>route.view==='review'?selectReview({...state,selectedLevel:courseLevel(state)}):[]);
  const [installPrompt,setInstallPrompt]=useState(null);

  const update=useCallback(fn=>setState(previous=>{const next=structuredClone(previous);fn(next);collectActivityChanges(previous,next);return next;}),[]);

  useEffect(()=>{
    const onPop=()=>{const next=parseRoute(state);if(next.blocked){history.replaceState(null,'',routeUrl(next.view));toast('Conclua os pré-requisitos da trilha para acessar esta etapa.');}setRoute(next);setReviewContext(history.state?.reviewOrigin||null);if(next.view==='review')setQueue(selectReview({...state,selectedLevel:courseLevel(state)}));};
    window.addEventListener('popstate',onPop);
    return ()=>window.removeEventListener('popstate',onPop);
  },[state,toast]);
  useEffect(()=>{
    // Guard restored URLs, including bookmarks opened after a level filter was changed.
    const next=parseRoute(state);
    if(next.blocked){history.replaceState(null,'',routeUrl(next.view));setRoute(next);}
  },[state]);
  useEffect(()=>{
    const heading=document.querySelector(`#view-${route.view} h1`);
    heading?.setAttribute('tabindex','-1');
    heading?.focus({preventScroll:true});
    window.scrollTo({top:0,behavior:'instant'});
  },[route.view,route.topic]);
  useEffect(()=>{
    stateSnapshot.current=state;
    if(storageBlocked)return;
    const timer=setTimeout(()=>{
      try{localStorage.setItem(KEY,JSON.stringify(stateSnapshot.current));setSaveError(false);}
      catch{setSaveError(true);}
    },250);
    return()=>clearTimeout(timer);
  },[state,storageBlocked]);
  useEffect(()=>{
    const flush=()=>{if(!storageBlocked){try{localStorage.setItem(KEY,JSON.stringify(stateSnapshot.current));}catch{setSaveError(true);}}};
    window.addEventListener('pagehide',flush);
    return()=>window.removeEventListener('pagehide',flush);
  },[storageBlocked]);
  useEffect(()=>{if(!message)return;const id=setTimeout(()=>setMessage(''),3500);return()=>clearTimeout(id);},[message]);
  useEffect(()=>setTrackingEnabled(!['settings'].includes(route.view)),[route.view]);
  useEffect(()=>{
    const stop=startTracker();
    const flush=()=>{const seconds=takePendingSeconds();if(seconds>0)setState(prev=>{const next=structuredClone(prev);addStudySeconds(next,seconds);return next;});};
    const id=setInterval(flush,10_000);
    const onHide=()=>document.visibilityState==='hidden'&&flush();
    document.addEventListener('visibilitychange',onHide);
    return ()=>{flush();clearInterval(id);document.removeEventListener('visibilitychange',onHide);stop();};
  },[]);
  useEffect(()=>{const listener=e=>{e.preventDefault();setInstallPrompt(e);};window.addEventListener('beforeinstallprompt',listener);return()=>window.removeEventListener('beforeinstallprompt',listener);},[]);

  const navigateTo=(target,topic=null,level='N5')=>{
    const access=resolveView(target,state);
    if(access.blocked){toast('Conclua os checkpoints N5 antes de acessar este laboratório.');target='practice';topic=null;}
    else target=access.view;
    if(target==='lesson'&&!isAccessibleLesson(state,topic,level)){toast('Esta lição ainda está bloqueada.');target='path';topic=null;}
    if(target==='checkpoint'&&!isAccessibleCheckpoint(state,topic)){toast('Primeiro pratique o conteúdo desta etapa.');target='path';topic=null;}
    if(target==='review')setQueue(selectReview({...state,selectedLevel:courseLevel(state)}));
    const url=routeUrl(target,topic,level);
    if(location.pathname+location.search!==url)history.pushState({from:location.pathname+location.search,reviewOrigin:target==='review'?reviewContext:null},'',url);
    setRoute({view:target,topic,level,blocked:false});
  };
  const go=view=>{if(view==='review')setReviewContext(null);navigateTo(view);};
  const goBack=()=>{if(route.view==='review'&&reviewContext?.view==='lesson')navigateTo('lesson',reviewContext.topic,reviewContext.level);else if(route.view==='lesson'||route.view==='checkpoint')navigateTo('path');else if(route.view==='review')navigateTo(reviewContext?.view||'practice');else if(['home','path','practice','progress'].includes(route.view))navigateTo('home');else navigateTo('practice');};
  const openGuidedLesson=(topic,level=courseLevel(state))=>navigateTo('lesson',topic,level);
  const openCheckpoint=topic=>navigateTo('checkpoint',topic);
  const study=(type=null)=>{
    const origin={view:route.view,topic:route.topic,level:route.level};
    setReviewContext(origin);
    navigateTo('review');
    history.replaceState({...history.state,reviewOrigin:origin},'');
    setQueue(selectReview(type?state:{...state,selectedLevel:courseLevel(state)},type));
  };
  const studyUnit=id=>{
    const unit=unitById(id);if(!unit)return;
    setReviewContext({view:'lesson',topic:id,level:'N5'});
    navigateTo('review');
    history.replaceState({...history.state,reviewOrigin:{view:'lesson',topic:id,level:'N5'}},'');
    setQueue(cardIdsForUnit(unit).filter(cid=>Boolean(state.cards[cid])));
  };
  const openLearn=(topic='hiragana')=>{setLearnTopic(topic);navigateTo('learn');};
  const openLesson=id=>openGuidedLesson(id);
  const changeLevel=level=>{if(level===state.selectedLevel)return;update(s=>{s.selectedLevel=level;});toast(`Mostrando conteúdos ${level}. O nível desbloqueado não muda.`);};

  useEffect(()=>{const stopWatching=warmJapaneseVoices();return()=>{stopWatching();stopSpeech();};},[]);
  const speak=text=>speakJapanese(text,toast);
  const install=async()=>{if(!installPrompt)return;await installPrompt.prompt();await installPrompt.userChoice;setInstallPrompt(null);};
  const shared={state,update,toast,go,goBack,speak,queue,setState,changeLevel,study,studyUnit,openLearn,openLesson,openGuidedLesson,openCheckpoint,route,reviewContext,learnTopic};
  return <>
    {storageBlocked&&<div role="alert" className="fixed z-[100] top-2 left-2 right-2 mx-auto max-w-xl bg-paper border-2 border-danger rounded-xl p-4 text-sm text-ink-strong"><strong>Progresso salvo não pôde ser lido.</strong><p>Os dados originais foram preservados. Baixe o arquivo bruto antes de restaurar um backup; novas alterações não serão salvas até isso ser corrigido.</p><button className="underline font-bold mt-2" onClick={()=>{let raw='';try{raw=localStorage.getItem(KEY)||'';}catch{toast('Armazenamento bloqueado pelo navegador. Libere o acesso nas configurações.');return;}const a=document.createElement('a');const u=URL.createObjectURL(new Blob([raw],{type:'application/json'}));a.href=u;a.download='kotonoha-recuperacao.json';a.click();URL.revokeObjectURL(u);}}>Baixar dados para recuperação</button><label className="block mt-3 font-bold">Restaurar backup válido<input type="file" accept="application/json,.json" className="block mt-1" onChange={async e=>{const file=e.target.files?.[0];if(!file)return;try{const next=normalizeState(JSON.parse(await file.text()));if(window.confirm('Substituir dados locais danificados? Baixe primeiro o arquivo de recuperação.')){localStorage.setItem(KEY,JSON.stringify(next));setState(next);setStorageBlocked(false);}}catch{alert('Backup inválido. Dados originais preservados.');}}}/></label></div>}
    {saveError&&<div role="alert" className="fixed top-[env(safe-area-inset-top)] left-3 right-3 z-[110] mx-auto max-w-xl rounded-2xl border-2 border-danger bg-paper p-4 text-sm text-ink-strong"><strong>Seu progresso ainda não foi salvo.</strong> Exporte agora um backup em Preferências ou libere espaço no dispositivo. <button className="underline font-bold" type="button" onClick={()=>{const blob=new Blob([JSON.stringify(stateSnapshot.current,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='kotonoha-backup-emergencia.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}}>Exportar dados atuais</button></div>}
    <Shell view={route.view} state={state} shared={shared} message={message} install={install} installPrompt={installPrompt} />
  </>;
}
