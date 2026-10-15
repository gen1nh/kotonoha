import React, { useState } from 'react';
import { useSubpageNavigation } from '../../../shared/lib/useSubpageNavigation.js';
import { hasCompletedN5Basics, N5_UNITS, unitAccessible, guidedSamples } from '../../../entities/study/index.js';
import { Button, NavigationTile } from '../../../shared/ui/index.jsx';
import N5ListeningPractice from './N5ListeningPractice.jsx';
import KanaTypingPractice from './KanaTypingPractice.jsx';

const LABS = [
  { id: 'syntax', title: 'Laboratório de frases', description: 'Monte frases e pratique partículas.', icon: 'puzzle' },
  { id: 'line', title: 'Conversação', description: 'Treine diálogos do cotidiano.', icon: 'phone', advanced: true },
  { id: 'pitch', title: 'Pronúncia', description: 'Explore o acento do japonês.', icon: 'mic', advanced: true },
];

export default function PracticeHub({ state, go, openSpeedQuiz }) {
  const [screen, setScreen, backScreen] = useSubpageNavigation('practice', 'menu', ['menu', 'listening', 'labs', 'typing', 'resources']);
  const unlocked = hasCompletedN5Basics(state);
  const typingUnits = N5_UNITS.filter(unit => ['kana', 'vocabulary', 'kanji'].includes(unit.kind) && unitAccessible(state, unit.id));
  const [typingId, setTypingId] = useState('');
  const typingUnit = typingUnits.find(unit => unit.id === typingId) || typingUnits.at(-1);

  return <div className="mx-auto max-w-3xl space-y-5">
    <header className="space-y-1">
      <p className="text-xs font-black text-primary-strong">EXERCÍCIOS COMPLEMENTARES</p>
      <h1 className="text-2xl font-black text-ink-strong">Praticar</h1>
      <p className="text-sm text-muted">{screen === 'menu' ? 'Escolha uma habilidade. Cada atividade tem seu próprio espaço.' : 'Uma atividade por vez, no seu ritmo.'}</p>
    </header>
    {screen !== 'menu' && <button type="button" className="min-h-11 font-bold text-sm text-primary-strong" onClick={backScreen}>← Voltar para Praticar</button>}
    {screen === 'menu' && <>
      <section className="rounded-2xl border-2 border-primary bg-paper p-4 space-y-3">
        <h2 className="text-base font-black text-ink-strong">Sua revisão espaçada</h2>
        <p className="text-sm text-muted">Reforce os cartões que está aprendendo.</p>
        <Button variant="primary" className="w-full" onClick={() => go('review')}>Começar revisão →</Button>
      </section>
      <div className="grid grid-cols-2 gap-3" aria-label="Escolher prática">
        <NavigationTile title="Escuta" description="Treine compreender frases curtas." icon="sound" onClick={() => setScreen('listening')} />
        <NavigationTile title="Desafio rápido" description="Teste o que lembra, sem nota na Trilha." icon="review" onClick={openSpeedQuiz} />
        <NavigationTile title="Laboratórios" description="Exercícios opcionais de frases e fala." icon="puzzle" onClick={() => setScreen('labs')} />
        <NavigationTile title="Digitação japonesa" description="Treino extra, sem obrigatoriedade." icon="learn" onClick={() => setScreen('typing')} />
      </div>
      <button type="button" className="min-h-11 text-sm font-bold text-primary-strong underline" onClick={()=>setScreen('resources')}>Consultar Biblioteca e Caderno →</button>
    </>}
    {screen === 'listening' && <N5ListeningPractice />}
    {screen === 'labs' && <section className="space-y-3" aria-label="Laboratórios opcionais">
      <h2 className="text-lg font-black text-ink-strong">Laboratórios opcionais</h2>
      <div className="grid grid-cols-2 gap-3">
        {LABS.map(tool => <NavigationTile key={tool.id} title={tool.title} description={tool.description} icon={tool.icon}
          disabled={tool.advanced && !unlocked} meta={tool.advanced && !unlocked ? 'Conclua os fundamentos N5' : null} onClick={() => go(tool.id)} />)}
      </div>
      {!unlocked && <p className="text-sm text-muted">Conversação e pronúncia são liberadas após os fundamentos N5.</p>}
    </section>}
    {screen === 'typing' && <section className="space-y-3" aria-label="Treino opcional de teclado">
      <h2 className="text-lg font-black text-ink-strong">Digitação japonesa</h2>
      <p className="text-sm text-muted">Use o teclado para escrever a leitura em kana ou romaji. Este treino é opcional e não interfere nos checkpoints.</p>
      {typingUnit ? <div className="space-y-3">
        <label className="block text-sm font-bold" htmlFor="typing-unit">Conteúdo já disponível na sua Trilha</label>
        <select id="typing-unit" value={typingUnit.id} onChange={event=>setTypingId(event.target.value)} className="w-full min-h-12 rounded-xl border border-line bg-paper p-3 text-base">
          {typingUnits.map(unit=><option key={unit.id} value={unit.id}>{unit.title}</option>)}
        </select>
        <KanaTypingPractice key={typingUnit.id} samples={guidedSamples(typingUnit.id)} kind={typingUnit.kind}/>
      </div> : <p className="text-sm text-muted">Conclua o primeiro conteúdo de kana na Trilha para liberar exemplos.</p>}
    </section>}
    {screen === 'resources' && <section className="space-y-3" aria-label="Materiais de consulta">
      <h2 className="text-lg font-black text-ink-strong">Consultar conteúdos</h2>
      <p className="text-sm text-muted">Estes materiais ajudam a estudar, mas não são uma segunda trilha.</p>
      <div className="grid grid-cols-2 gap-3">
        <NavigationTile title="Biblioteca" description="Consulte kana, kanji e vocabulário." icon="learn" onClick={()=>go('learn')}/>
        <NavigationTile title="Caderno" description="Veja suas anotações e dúvidas." icon="academic" onClick={()=>go('notebook')}/>
      </div>
    </section>}
  </div>;
}
