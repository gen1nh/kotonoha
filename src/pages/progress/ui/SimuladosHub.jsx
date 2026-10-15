import React,{useState} from 'react';
import {LEVELS} from '../../../entities/study/index.js';
import {Button} from '../../../shared/ui/index.jsx';
import DiagnosticPractice from './DiagnosticPractice.jsx';
import PaperPractice from './PaperPractice.jsx';

const OPTIONS = [
  {id:'diagnostic',title:'Fazer autoavaliação',detail:'Responda questões uma por vez e descubra o que revisar.'},
  {id:'paper',title:'Praticar no papel',detail:'Exercícios de leitura e escrita para fazer à mão.'},
  {id:'history',title:'Meus resultados',detail:'Registre notas pessoais e consulte tentativas anteriores.'},
  {id:'resources',title:'Material oficial JLPT',detail:'Acesse exemplos e áudios disponibilizados pelo JLPT.'},
];
const PAGE_SIZE=3;

/** Um objetivo por tela. Simulados não misturam avaliação, estatísticas e materiais. */
export default function SimuladosHub({state,update,toast,changeLevel}) {
  const [screen,setScreen]=useState('menu');
  const [score,setScore]=useState('');
  const [error,setError]=useState('');
  const [page,setPage]=useState(0);
  const level=state.selectedLevel||'N5';
  const mocks=(state.mocks||[]).filter(entry=>entry.level===level);
  const attempts=(state.diagnosticHistory||[]).filter(entry=>entry.level===level);
  const selected=OPTIONS.find(option=>option.id===screen);
  const save=event=>{
    event.preventDefault();
    const value=Number(score);
    if(!score.trim() || !Number.isInteger(value) || value<0 || value>100) {
      setError('Informe um percentual inteiro entre 0 e 100.');
      return;
    }
    update(s=>{
      s.mocks ||= [];
      s.mocks.unshift({level,score:value,date:new Date().toISOString().slice(0,10)});
      s.mocks=s.mocks.slice(0,200);
    });
    setScore('');setError('');setPage(0);
    toast?.('Resultado pessoal salvo.');
  };
  return <div className="space-y-4" aria-label="Área de simulados">
    <header className="rounded-2xl border border-line bg-paper p-4 space-y-3">
      {screen==='menu' ? <>
        <h2 className="text-xl font-black text-ink-strong">Simulados e prática</h2>
        <p className="text-sm text-muted">Escolha o que deseja fazer. Sua trilha e seus checkpoints não mudam aqui.</p>
      </> : <>
        <button type="button" className="min-h-11 text-sm font-bold text-primary-strong" onClick={()=>setScreen('menu')}>← Voltar para Simulados</button>
        <h2 className="text-xl font-black text-ink-strong">{selected.title}</h2>
        <p className="text-sm text-muted">{selected.detail}</p>
      </>}
      <label className="block text-sm font-bold text-ink-strong">Nível para consulta
        <select aria-label="Nível dos simulados" value={level} onChange={e=>{changeLevel(e.target.value);setPage(0);setScreen('menu');}} className="block mt-2 min-h-11 w-full rounded-xl border border-line bg-paper px-3 text-ink-strong">
          {LEVELS.map(([id,label])=><option key={id} value={id}>{id} · {label}</option>)}
        </select>
      </label>
    </header>
    {screen==='menu'&&<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {OPTIONS.map(option=><article key={option.id} className="rounded-2xl border border-line bg-paper p-4 space-y-3">
        <div className="space-y-1"><h3 className="text-base font-bold text-ink-strong">{option.title}</h3><p className="text-sm text-muted">{option.detail}</p></div>
        <Button variant={option.id==='diagnostic'?'primary':'secondary'} className="w-full" onClick={()=>setScreen(option.id)}>Abrir {option.title.toLowerCase()} →</Button>
      </article>)}
    </div>}
    {screen==='diagnostic'&&<DiagnosticPractice key={level} level={level} update={update}/>}
    {screen==='paper'&&<PaperPractice level={level}/>}
    {screen==='history'&&<section className="rounded-2xl border border-line bg-paper p-4 space-y-4" aria-label="Registro de simulados">
      <div className="space-y-1"><h3 className="font-bold text-ink-strong">Registrar resultado</h3><p className="text-sm text-muted">Guarde sua nota de uma prova feita fora do app. Não é uma certificação JLPT.</p></div>
      <form className="space-y-3" onSubmit={save}>
        <label htmlFor="mock-score" className="block text-sm font-bold text-ink-strong">Percentual de acertos
          <input id="mock-score" type="number" min="0" max="100" step="1" value={score} onChange={e=>setScore(e.target.value)} placeholder="Ex.: 75" className="mt-2 min-h-11 w-full rounded-xl border border-line bg-paper px-3 text-ink-strong"/>
        </label>
        {error&&<p role="alert" className="text-sm text-danger">{error}</p>}
        <Button variant="primary" submit={false} className="w-full" type="submit">Salvar resultado</Button>
      </form>
      <div className="border-t border-line pt-3 space-y-2">
        <h3 className="font-bold text-ink-strong">Notas registradas</h3>
        {mocks.length===0?<p className="text-sm text-muted">Você ainda não registrou resultados neste nível.</p>:
          <><ul className="space-y-2">{mocks.slice(page*PAGE_SIZE,(page+1)*PAGE_SIZE).map((entry,i)=><li key={`${entry.date}-${page*PAGE_SIZE+i}`} className="rounded-xl bg-raised p-3 flex items-center justify-between gap-3 text-sm"><span className="text-ink-strong">{entry.date}</span><strong className="text-primary-strong">{entry.score}%</strong></li>)}</ul>
          {mocks.length>PAGE_SIZE&&<nav aria-label="Páginas dos resultados" className="flex items-center justify-between gap-3"><Button variant="secondary" disabled={page===0} onClick={()=>setPage(n=>Math.max(0,n-1))}>Anterior</Button><span className="text-xs text-muted">Página {page+1} de {Math.ceil(mocks.length/PAGE_SIZE)}</span><Button variant="secondary" disabled={(page+1)*PAGE_SIZE>=mocks.length} onClick={()=>setPage(n=>n+1)}>Próxima</Button></nav>}</>}
      </div>
      {attempts.length>0&&<details className="border-t border-line pt-3"><summary className="min-h-11 cursor-pointer font-bold text-ink-strong">Últimas autoavaliações</summary><ul className="space-y-2 pt-2">{attempts.slice(-3).reverse().map((item,i)=><li className="text-sm text-ink-strong" key={`${item.date}-${i}`}>{item.correct}/{item.total} acertos · {new Date(item.date).toLocaleDateString('pt-BR')}</li>)}</ul></details>}
    </section>}
    {screen==='resources'&&<section className="rounded-2xl border border-line bg-paper p-4 space-y-3" aria-label="Materiais JLPT">
      <h3 className="font-bold text-ink-strong">Praticar com exemplos oficiais</h3>
      <p className="text-sm text-muted">Os materiais abrem no site do JLPT. A disponibilidade de áudios e níveis depende do site oficial.</p>
      <a href="https://www.jlpt.jp/e/samples/sampleindex.html" target="_blank" rel="noreferrer" className="block min-h-11 rounded-xl border border-line p-3 font-bold text-primary-strong">Exemplos de provas ↗</a>
      <a href="https://www.jlpt.jp/e/samples/forlearners.html" target="_blank" rel="noreferrer" className="block min-h-11 rounded-xl border border-line p-3 font-bold text-primary-strong">Questões e áudios ↗</a>
    </section>}
  </div>;
}
