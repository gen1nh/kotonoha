import React from 'react';
import Icon from './Icon.jsx';
import {hasUnlockedN4} from '../routeAccess.js';
import {nextGuidedAction,courseLevel} from '../learning.js';
import {Button} from './ui/index.jsx';
import N5ListeningPractice from './N5ListeningPractice.jsx';
const TOOLS=[
 {id:'learn',name:'Biblioteca e escrita',detail:'Consultar kana, palavras e gramática; praticar caligrafia.',icon:'learn',kind:'consulta'},
 {id:'notebook',name:'Caderno e erros',detail:'Notas, dúvidas, erros e cartões pessoais em um só lugar.',icon:'academic',kind:'apoio'},
 {id:'syntax',name:'Laboratório de frases',detail:'Montar frases e praticar partículas.',icon:'puzzle',kind:'labs'},
 {id:'line',name:'Conversação',detail:'Simular diálogos cotidianos; requer base N5.',icon:'phone',kind:'labs',advanced:true},
 {id:'pitch',name:'Pronúncia',detail:'Explorar acento e gravar a própria voz; requer base N5.',icon:'mic',kind:'labs',advanced:true},
];
export default function PracticeHub({state,go,openSpeedQuiz,openGuidedLesson,openCheckpoint}){
 const unlocked=hasUnlockedN4(state);
 const next=nextGuidedAction(state),level=courseLevel(state);
 return <div className="mx-auto max-w-3xl space-y-5">
  <header className="space-y-1"><p className="text-xs font-black text-primary-strong">EXERCÍCIOS COMPLEMENTARES</p><h1 className="text-2xl font-black text-ink-strong">Praticar</h1><p className="text-sm text-muted">Aqui você reforça habilidades. A Trilha é o único percurso oficial do curso.</p></header>
  <section className="rounded-3xl border-2 border-primary bg-paper p-5 space-y-3"><h2 className="text-lg font-black">Sua revisão espaçada</h2><p className="text-sm text-muted">Reveja cartões no momento certo, inclusive os criados no Caderno.</p><Button variant="primary" className="w-full" onClick={()=>go('review')}>Começar revisão →</Button></section>
  <section className="rounded-3xl border border-line bg-paper p-4 space-y-3"><h2 className="font-black">Continue no seu ritmo</h2><p className="text-sm text-muted">Uma atividade curta da <strong>mesma Trilha</strong>, sem sorteio de lições nem um segundo currículo.</p><Button variant="secondary" className="w-full" onClick={()=>!next.lesson?go('path'):next.kind==='checkpoint'?openCheckpoint(next.lesson.id):openGuidedLesson(next.lesson.id,level)}>Continuar etapa {next.lesson?.title||'atual'} →</Button></section>
  <details className="rounded-3xl border border-line bg-paper p-4"><summary className="min-h-11 flex items-center font-black cursor-pointer">Prática de escuta N5 · voz do aparelho</summary><div className="pt-3"><N5ListeningPractice /></div></details>
  <details className="rounded-3xl border border-line bg-paper p-4" open><summary className="min-h-11 flex items-center font-black cursor-pointer">Consultar e organizar</summary><div className="grid sm:grid-cols-2 gap-3 pt-3">{TOOLS.filter(t=>t.kind!=='labs').map(tool=><ToolCard key={tool.id} tool={tool} go={go}/>)}</div></details>
  <details className="rounded-3xl border border-line bg-paper p-4"><summary className="min-h-11 flex items-center font-black cursor-pointer">Laboratórios opcionais</summary><div className="grid sm:grid-cols-2 gap-3 pt-3">{TOOLS.filter(t=>t.kind==='labs').map(tool=><ToolCard key={tool.id} tool={tool} go={go} locked={tool.advanced&&!unlocked}/>)}</div></details>
  <details className="rounded-3xl border border-line bg-paper p-4"><summary className="min-h-11 flex items-center font-black cursor-pointer">Treinos extras</summary><p className="text-xs text-muted py-2">O desafio rápido é recreativo e não aprova etapas.</p><Button variant="secondary" onClick={openSpeedQuiz}>Abrir desafio rápido</Button></details>
 </div>;
}
function ToolCard({tool,go,locked}){return <article className="rounded-2xl border border-line p-4 space-y-3"><div className="flex gap-3"><span className="h-10 w-10 flex items-center justify-center bg-accent-soft text-primary-strong rounded-xl"><Icon name={tool.icon}/></span><div><h3 className="font-bold text-ink-strong">{tool.name}</h3><p className="text-xs text-muted mt-1">{tool.detail}</p></div></div>{locked?<p className="text-xs text-muted flex gap-2"><Icon name="lock"/> Conclua os fundamentos N5.</p>:null}<Button variant="secondary" className="w-full" disabled={locked} onClick={()=>go(tool.id)}>{locked?'Bloqueado':'Abrir ferramenta →'}</Button></article>}
