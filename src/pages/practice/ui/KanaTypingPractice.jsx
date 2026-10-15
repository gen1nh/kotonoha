import { playSound } from '../../../shared/audio/index.js';
import React,{useState} from 'react';
import { Button } from '../../../shared/ui/index.jsx';
import { checkKanaTyping, normalizeKanaAnswer } from '../../../entities/study/index.js';

/** Additional free-response practice; never modifies legacy cards or checkpoint unlocks. */
export default function KanaTypingPractice({samples,kind}) {
  const items=(samples||[]).filter(row=>kind==='kanji'?row.exampleReading&&row.example:(row.kana||row.glyph)).slice(0,5);
  const [index,setIndex]=useState(0),[typed,setTyped]=useState(''),[checked,setChecked]=useState(false),[completed,setCompleted]=useState(false);
  if (!items.length) return null;
  const item=items[Math.min(index,items.length-1)];
  const target=kind==='kanji'?item.exampleReading:(item.kana||item.glyph);
  const prompt=kind==='kanji'?item.example:item.glyph;
  const correct=checkKanaTyping(typed,target);
  const next=()=>{
    if (index+1===items.length) { playSound('complete'); setCompleted(true); return; }
    setIndex(n=>n+1); setTyped(''); setChecked(false);
  };
  const reset=()=>{setIndex(0);setTyped('');setChecked(false);setCompleted(false);};
  return <section className="rounded-3xl border border-line bg-paper p-4 sm:p-5 space-y-3" aria-label="Treino de digitação japonesa">
    <div className="flex items-start justify-between gap-2">
      <div><h2 className="text-lg font-black text-ink-strong">Digite em japonês</h2>
        <p className="text-xs text-muted">Treino de teclado opcional: aceita romaji ou kana. Não altera seu progresso nos checkpoints.</p></div>
      <span className="shrink-0 text-xs text-muted font-bold">{completed?items.length:index+1}/{items.length}</span>
    </div>
    {completed ? <div className="space-y-2"><p role="status" className="text-sm font-bold text-primary-strong">Você praticou {items.length} leituras.</p><Button variant="secondary" onClick={reset}>Refazer treino</Button></div> : <>
      <p lang="ja" className="text-center font-jp text-3xl sm:text-4xl font-black text-ink-strong bg-raised rounded-2xl p-4">{prompt}</p>
      <form className="space-y-3" onSubmit={e=>{e.preventDefault();if(!checked){playSound(correct?'correct':'incorrect');setChecked(true);}else if(correct)next();}}>
        <label htmlFor="kana-typing-answer" className="block text-sm font-bold text-ink-strong">{kind==='kanji'?'Digite a leitura da palavra':'Digite a leitura deste item'}</label>
        <input id="kana-typing-answer" type="text" lang="ja" autoCapitalize="off" autoComplete="off" autoCorrect="off" spellCheck={false} value={typed} onChange={e=>{setTyped(e.target.value);setChecked(false);}} placeholder="Ex.: nihongo → にほんご" className="min-h-12 w-full rounded-xl border-2 border-line bg-paper px-4 text-base text-ink-strong focus-visible:outline-2 focus-visible:outline-primary" />
        {typed&&<p className="text-xs text-muted">Conversão: <span lang="ja" className="font-jp text-base font-bold text-ink-strong">{normalizeKanaAnswer(typed)}</span></p>}
        {checked&&<p role="status" className="rounded-xl bg-raised p-3 text-sm text-ink-strong">{correct?'Correto!':'Confira a leitura e tente novamente.'}{!correct&&<span lang="ja" className="block mt-1 font-jp font-bold">Leitura esperada: {target}</span>}</p>}
        <Button variant="primary" className="w-full" type="submit" disabled={!typed.trim()}>{checked&&correct?'Próximo →':'Conferir resposta'}</Button>
      </form>
    </>}
  </section>;
}
