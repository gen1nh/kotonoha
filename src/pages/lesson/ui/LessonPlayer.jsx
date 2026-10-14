import React,{useState,useEffect} from 'react';
import Icon from '../../../shared/ui/Icon.jsx';
import KanaTypingPractice from './KanaTypingPractice.jsx';
import {Button} from '../../../shared/ui/index.jsx';
import {guidedLesson,guidedLessonProgress,guidedSamples,advancedLessonScore} from '../../../entities/study/index.js';
import {checkpointPassed} from '../../../entities/study/index.js';
import {unitById,cardIdsForUnit,unitPracticed} from '../../../entities/study/index.js';
import {lessonsFor} from '../../../entities/study/index.js';
import {KANA_PRONUNCIATION_NOTES} from '../../../entities/study/index.js';
import {GRAMMAR} from '../../../entities/study/index.js';

/** Tela focada em uma microlição; a Biblioteca não decide o currículo. */
export default function LessonPlayer({state,level='N5',topic,update,go,studyUnit,speak,openCheckpoint,openGuidedLesson}){
 const unit=unitById(topic);
 const lesson=guidedLesson(state,topic,level);
 const [result,setResult]=useState(null);
 const [revealed,setRevealed]=useState({});
 useEffect(()=>setRevealed({}),[topic]);
 if(!lesson)return <p role="alert">Lição indisponível. <button type="button" onClick={()=>go('path')}>Voltar à Trilha</button></p>;
 const draftKey=`lesson:${topic}`;
 const answers=state.drafts?.[draftKey]?.answers||{};
 const progress=guidedLessonProgress(state,topic);
 const ready=Boolean(unit)&&unitPracticed(state,topic);
 const passed=Boolean(unit)&&checkpointPassed(state,topic);
 const samples=unit?guidedSamples(topic):[];
 const quiz=unit?.kind==='grammar';
 const g=quiz?unit.items[0]:null;
 const grammarChoices=quiz?[g.meaning,...GRAMMAR.filter(row=>row!==g&&row.meaning!==g.meaning).slice((unit.index*3)%Math.max(1,GRAMMAR.length-4)).slice(0,3).map(row=>row.meaning)]:[];
 const chosen=answers.practice;
 const updateAnswer=(key,value)=>update(s=>{s.drafts||={};s.drafts[draftKey]={answers:{...(s.drafts[draftKey]?.answers||{}),[key]:value}};});
 const questionScore=level!=='N5'?advancedLessonScore(lesson,answers):null;
 const completeAdvanced=()=>{
  if(questionScore===null)return;
  setResult(questionScore);
  update(s=>{
   if(questionScore>=80){s.lessons[topic]=true;delete s.drafts?.[draftKey];}
   else {s.attempts||={};s.attempts[draftKey]=(s.attempts[draftKey]||0)+1;}
  });
 };
 const next=lessonsFor(level)[lessonsFor(level).findIndex(item=>item.id===topic)+1];
 if(unit && (unit.kind==='reading'||unit.kind==='listening')){
  const listening=unit.kind==='listening';
  return <div className="mx-auto max-w-2xl space-y-4 pb-8">
   <header className="rounded-3xl border-2 border-line bg-paper p-5 space-y-2">
    <p className="text-xs font-black text-primary-strong">MICROLIÇÃO · N5 · {listening?'ESCUTA':'LEITURA'}</p>
    <h1 className="text-2xl font-black text-ink-strong">{unit.title}</h1>
    <p className="text-sm text-muted">{unit.detail}</p>
    {listening&&<p className="text-xs text-muted">Voz sintética do navegador: adequada para prática, não equivalente à prova oficial JLPT. Se a voz não funcionar, revele a transcrição e use como leitura.</p>}
   </header>
   {unit.items.map((item,i)=><article key={item.id} className="rounded-2xl border border-line bg-paper p-4 space-y-3">
     <p className="text-xs font-black text-primary-strong">EXEMPLO {i+1} DE {unit.items.length}</p>
     <p className="text-sm font-bold text-ink-strong">{listening?item.context:item.title}</p>
     {listening?<>
       <Button variant="secondary" onClick={()=>speak(item.spokenText)}>▶ Ouvir japonês</Button>
       <button type="button" className="block min-h-11 text-xs text-primary-strong font-bold underline" onClick={()=>setRevealed(prev=>({...prev,[item.id]:!prev[item.id]}))}>{revealed[item.id]?'Esconder':'Revelar'} transcrição</button>
       {revealed[item.id]&&<p lang="ja" className="font-jp text-xl rounded-xl bg-raised p-3">{item.spokenText}</p>}
     </>:<p lang="ja" className="font-jp text-xl leading-relaxed rounded-xl bg-raised p-4">{item.text}</p>}
     <p className="text-sm text-muted">{item.prompt}</p>
     <p className="text-xs text-muted">Depois de estudar este exemplo, responda à questão na avaliação do bloco.</p>
   </article>)}
   <section className="rounded-3xl border-2 border-primary bg-paper p-5 space-y-3">
    <h2 className="text-lg font-black text-ink-strong">Próxima etapa</h2>
    <p className="text-sm text-muted">{passed?'Avaliação concluída.':ready?'Os exemplos foram estudados. Resolva o checkpoint.':'Estude os cinco exemplos e confirme quando estiver preparado para responder às questões.'}</p>
    {passed?<Button variant="primary" className="w-full" onClick={()=>next?openGuidedLesson(next.id,'N5'):go('path')}>{next?'Próxima microlição →':'Ver trilha →'}</Button>:
      ready?<Button variant="primary" className="w-full" onClick={()=>openCheckpoint(topic)}>Fazer checkpoint →</Button>:
      <Button variant="primary" className="w-full" onClick={()=>update(st=>{st.lessons[topic]=true;})}>Estudei os exemplos · continuar →</Button>}
   </section>
   <button type="button" className="min-h-11 text-sm font-bold text-primary-strong" onClick={()=>go('path')}>← Voltar à Trilha</button>
  </div>;
 }
 return <div className="mx-auto max-w-2xl space-y-4 pb-8">
  <header className="rounded-3xl border-2 border-line bg-paper p-5 space-y-3">
   <p className="text-xs font-black text-primary-strong">{level==='N5'?'MICROLIÇÃO':'PRÉVIA INTRODUTÓRIA'} · {level}</p>
   <h1 className="text-2xl font-black text-ink-strong">{lesson.title}</h1>
   <p className="text-sm text-muted">{lesson.detail||lesson.explanation||lesson.focus}</p>
   {unit&&<><div className="flex justify-between text-xs font-bold text-muted"><span>{progress.studied} de {progress.total} itens praticados</span><span>{passed?'Aprovada':ready?'Pronta para avaliar':'Estudando'}</span></div>
   <div className="h-3 rounded-full bg-raised overflow-hidden" role="progressbar" aria-label="Itens praticados" aria-valuemin={0} aria-valuemax={progress.total} aria-valuenow={progress.studied}><div className="h-full bg-primary rounded-full" style={{width:`${100*progress.studied/Math.max(1,progress.total)}%`}} /></div></>}
  </header>
  {level!=='N5'?<section className="rounded-3xl border border-line bg-paper p-5 space-y-4">
   <h2 className="font-black text-ink-strong">Leia e responda</h2><p className="text-sm text-ink">{lesson.explanation}</p>
   {lesson.example&&<div className="rounded-2xl bg-raised p-4"><p className="font-jp text-xl text-ink-strong" lang="ja">{lesson.example}</p><p className="text-sm text-muted">{lesson.translation}</p><button className="min-h-11 text-primary-strong font-bold" type="button" onClick={()=>speak(lesson.example)}>Ouvir exemplo <Icon name="sound"/></button></div>}
   <p className="text-xs text-muted">Conteúdo autoral introdutório. Não cobre integralmente o exame JLPT.</p>
   {lesson.questions.map((q,i)=><fieldset key={q.id} className="rounded-2xl border border-line p-3 space-y-2" disabled={result!==null||Boolean(state.lessons?.[topic])}><legend className="font-bold text-ink-strong">{i+1}. {q.prompt}</legend>{q.sentence&&<p lang="ja" className="font-jp">{q.sentence}</p>}{q.choices.map((c,j)=><label key={j} className="min-h-12 flex items-center gap-3 rounded-xl border border-line p-2"><input type="radio" name={`advanced-${q.id}`} checked={answers[q.id]===j} onChange={()=>updateAnswer(q.id,j)}/>{c}</label>)}{result!==null&&<p className="text-xs text-muted">{q.explanation}</p>}</fieldset>)}
   {result!==null&&<p role="status" className="font-bold">{result}% · {result>=80?'Aprovada':'Revise os exemplos e tente novamente'}</p>}
   {state.lessons?.[topic]||result>=80?<Button variant="primary" className="w-full" onClick={()=>next?openGuidedLesson(next.id,level):go('path')}>{next?'Próxima lição →':'Voltar à trilha →'}</Button>:<Button variant="primary" className="w-full" disabled={questionScore===null} onClick={completeAdvanced}>Corrigir exercícios · mínimo 80%</Button>}
   {result!==null&&result<80&&<Button variant="secondary" className="w-full" onClick={()=>{update(s=>{delete s.drafts?.[draftKey];});setResult(null);}}>Tentar novamente</Button>}
  </section>:<>
   <section className="rounded-3xl border border-line bg-paper p-4 sm:p-5 space-y-3">
    <h2 className="text-lg font-black text-ink-strong">{quiz?'Entenda a regra':unit.kind==='kanji'?'Reconheça o kanji na palavra':'Aprenda e escute'}</h2>
    {quiz?<div className="rounded-2xl bg-raised p-4 space-y-3"><h3 className="font-bold text-ink-strong">{g.title}</h3><p className="text-sm text-ink">{g.text}</p><p className="font-jp text-2xl" lang="ja">{g.example}</p><p className="text-sm text-muted">{g.meaning}</p><Button variant="secondary" onClick={()=>speak(g.example)}>Ouvir frase <Icon name="sound"/></Button></div>:
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">{samples.map(sample=><button type="button" key={sample.glyph} onClick={()=>speak(sample.spoken||sample.kana||sample.glyph)} className="min-h-32 rounded-2xl border-2 border-line bg-surface p-3 flex flex-col items-center justify-center gap-1 text-center focus-visible:outline-2 focus-visible:outline-primary"><span className="font-jp text-3xl font-black" lang="ja">{sample.glyph}</span><span className="text-sm font-bold">{sample.reading}</span><span className="text-xs text-muted">{sample.meaning}</span>{sample.example&&<span className="text-xs font-jp text-muted">{sample.example} · {sample.exampleReading}</span>}<span className="text-xs text-primary-strong">Ouvir <Icon name="sound"/></span></button>)}</div>}
   </section>
   {!quiz && ['kana','vocabulary','kanji'].includes(unit.kind) && <KanaTypingPractice key={unit.id} samples={samples} kind={unit.kind} />}
   {unit.kind==='kana'&&unit.index>=8&&<p className="rounded-2xl bg-raised p-4 text-xs text-muted">Combinações com sons sonoros e yōon (ゃ・ゅ・ょ). Lembre-se: っ/ッ indica uma pausa/consoante dupla, enquanto ー alonga uma vogal no katakana. {KANA_PRONUNCIATION_NOTES[3].detail}</p>}
   {quiz&&!ready&&<section className="rounded-3xl border border-line p-5 bg-paper space-y-3"><h2 className="font-black">Confira a compreensão</h2><p className="text-sm">Qual é o significado do exemplo apresentado?</p><div className="space-y-2">{grammarChoices.map(c=><label key={c} className="min-h-12 flex items-center gap-3 rounded-xl border-2 border-line p-3"><input type="radio" name="grammar-practice" checked={chosen===c} onChange={()=>updateAnswer('practice',c)}/><span className="text-sm">{c}</span></label>)}</div>{chosen&&<p role="status" className="text-sm">{chosen===g.meaning?'Certo! Agora valide seu aprendizado no checkpoint.':'Revise a frase e tente novamente.'}</p>}<Button variant="primary" className="w-full" disabled={chosen!==g.meaning} onClick={()=>update(s=>{s.lessons[topic]=true;delete s.drafts?.[draftKey];})}>Concluir prática →</Button></section>}
   <section className="rounded-3xl border-2 border-primary bg-paper p-5 space-y-3"><p className="text-xs font-black text-primary-strong">PRÓXIMA AÇÃO</p><h2 className="text-lg font-black text-ink-strong">{passed?'Microlição validada!':ready?'Faça o checkpoint':'Pratique os cartões desta microlição'}</h2><p className="text-sm text-muted">{passed?'Você pode avançar. A revisão espaçada continuará cuidando da memorização.':ready?'Mostre o que aprendeu para desbloquear a próxima microlição.':quiz?'Responda a prática acima antes da avaliação.':'São poucos cartões. Eles não misturam conteúdo de outras etapas.'}</p>
    {passed?<Button variant="primary" className="w-full" onClick={()=>next?openGuidedLesson(next.id,'N5'):go('path')}>{next?'Próxima microlição →':'Ver Trilha →'}</Button>:ready?<Button variant="primary" className="w-full" onClick={()=>openCheckpoint(topic)}>Fazer checkpoint →</Button>:!quiz?<Button variant="primary" className="w-full" onClick={()=>studyUnit(topic)}>Praticar {progress.total} cartões →</Button>:null}
   </section>
  </>}
  <button type="button" onClick={()=>go('path')} className="min-h-11 text-sm font-bold text-primary-strong">← Voltar à Trilha</button>
 </div>;
}
