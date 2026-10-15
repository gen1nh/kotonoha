import React,{useState} from 'react';
import Icon from '../../../shared/ui/Icon.jsx';
import {N5_UNITS,unitAccessible,guidedSamples,hasCompletedN5Basics} from '../../../entities/study/index.js';
import {Button} from '../../../shared/ui/index.jsx';
import N5ListeningPractice from './N5ListeningPractice.jsx';
import KanaTypingPractice from './KanaTypingPractice.jsx';
const TOOLS=[
 {id:'learn',name:'Biblioteca e escrita',detail:'Consultar kana, palavras e gramática; praticar caligrafia.',icon:'learn',kind:'consulta'},
 {id:'notebook',name:'Caderno e erros',detail:'Notas, dúvidas, erros e cartões pessoais em um só lugar.',icon:'academic',kind:'apoio'},
 {id:'syntax',name:'Laboratório de frases',detail:'Montar frases e praticar partículas.',icon:'puzzle',kind:'labs'},
 {id:'line',name:'Conversação',detail:'Simular diálogos cotidianos; requer base N5.',icon:'phone',kind:'labs',advanced:true},
 {id:'pitch',name:'Pronúncia',detail:'Explorar acento e gravar a própria voz; requer base N5.',icon:'mic',kind:'labs',advanced:true},
];
export default function PracticeHub({state,go,openSpeedQuiz}){
 const unlocked=hasCompletedN5Basics(state);
 const typingUnits=N5_UNITS.filter(unit=>['kana','vocabulary','kanji'].includes(unit.kind)&&unitAccessible(state,unit.id));
 const [typingId,setTypingId]=useState('');
 const typingUnit=typingUnits.find(unit=>unit.id===typingId)||typingUnits.at(-1);
 return <div className="mx-auto max-w-3xl space-y-5">
  <header className="space-y-1"><p className="text-xs font-black text-primary-strong">EXERCÍCIOS COMPLEMENTARES</p><h1 className="text-2xl font-black text-ink-strong">Praticar</h1><p className="text-sm text-muted">Reforce o que já estudou. Para aprender conteúdo novo na ordem certa, continue pela Trilha.</p></header>
  <section className="rounded-3xl border-2 border-primary bg-paper p-5 space-y-3"><h2 className="text-lg font-black">Sua revisão espaçada</h2><p className="text-sm text-muted">Tente lembrar, revele a resposta e avalie sua lembrança. A revisão usa seus cartões disponíveis, inclusive os criados no Caderno; ela não aprova lições.</p><Button variant="primary" className="w-full" onClick={()=>go('review')}>Começar revisão →</Button></section>
  <button type="button" className="min-h-11 text-sm font-bold text-primary-strong underline" onClick={()=>go('path')}>Quero aprender algo novo · ir à Trilha</button>
  <details className="rounded-3xl border border-line bg-paper p-4"><summary className="min-h-11 flex items-center font-black cursor-pointer">Prática de escuta N5 · voz do aparelho</summary><div className="pt-3"><N5ListeningPractice /></div></details>
  <details className="rounded-3xl border border-line bg-paper p-4"><summary className="min-h-11 flex items-center font-black cursor-pointer">Consultar e organizar</summary><div className="grid sm:grid-cols-2 gap-3 pt-3">{TOOLS.filter(t=>t.kind!=='labs').map(tool=><ToolCard key={tool.id} tool={tool} go={go}/>)}</div></details>
  <details className="rounded-3xl border border-line bg-paper p-4"><summary className="min-h-11 flex items-center font-black cursor-pointer">Laboratórios opcionais</summary><div className="grid sm:grid-cols-2 gap-3 pt-3">{TOOLS.filter(t=>t.kind==='labs').map(tool=><ToolCard key={tool.id} tool={tool} go={go} locked={tool.advanced&&!unlocked}/>)}</div></details>
  <details className="rounded-3xl border border-line bg-paper p-4"><summary className="min-h-11 flex items-center font-black cursor-pointer">Treinos extras</summary><p className="text-xs text-muted py-2">Estes exercícios são opcionais e não aprovam etapas.</p><Button variant="secondary" onClick={openSpeedQuiz}>Abrir desafio rápido</Button><details className="mt-4 border-t border-line pt-3"><summary className="min-h-11 cursor-pointer font-bold">Treino de teclado japonês</summary>{typingUnit&&<div className="space-y-3 pt-3"><label className="block text-sm font-bold" htmlFor="typing-unit">Conteúdo para praticar</label><select id="typing-unit" value={typingUnit.id} onChange={event=>setTypingId(event.target.value)} className="w-full min-h-12 rounded-xl border border-line bg-paper p-3 text-base">{typingUnits.map(unit=><option key={unit.id} value={unit.id}>{unit.title}</option>)}</select><KanaTypingPractice key={typingUnit.id} samples={guidedSamples(typingUnit.id)} kind={typingUnit.kind}/></div>}</details></details>
 </div>;
}
function ToolCard({tool,go,locked}){return <article className="rounded-2xl border border-line p-4 space-y-3"><div className="flex gap-3"><span className="h-10 w-10 flex items-center justify-center bg-accent-soft text-primary-strong rounded-xl"><Icon name={tool.icon}/></span><div><h3 className="font-bold text-ink-strong">{tool.name}</h3><p className="text-xs text-muted mt-1">{tool.detail}</p></div></div>{locked?<p className="text-xs text-muted flex gap-2"><Icon name="lock"/> Conclua os fundamentos N5.</p>:null}<Button variant="secondary" className="w-full" disabled={locked} onClick={()=>go(tool.id)}>{locked?'Bloqueado':'Abrir ferramenta →'}</Button></article>}
