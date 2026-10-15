import React, { useState } from 'react';
import { useSubpageNavigation } from '../../../shared/lib/useSubpageNavigation.js';
import { hasCompletedN5Basics, nextGuidedAction, courseLevel, N5_UNITS, unitAccessible, guidedSamples } from '../../../entities/study/index.js';
import { Button, NavigationTile } from '../../../shared/ui/index.jsx';
import N5ListeningPractice from './N5ListeningPractice.jsx';
import KanaTypingPractice from './KanaTypingPractice.jsx';

const LABS = [
  { id: 'syntax', title: 'Laboratório de frases', description: 'Monte frases e pratique partículas.', icon: 'puzzle' },
  { id: 'line', title: 'Conversação', description: 'Treine diálogos do cotidiano.', icon: 'phone', advanced: true },
  { id: 'pitch', title: 'Pronúncia', description: 'Explore o acento do japonês.', icon: 'mic', advanced: true },
];

export default function PracticeHub({ state, go, openSpeedQuiz, openGuidedLesson, openCheckpoint }) {
  const [screen, setScreen, backScreen] = useSubpageNavigation('practice', 'menu', ['menu', 'listening', 'labs']);
  const unlocked = hasCompletedN5Basics(state);
  const next = nextGuidedAction(state), level = courseLevel(state);
  const goNext = () => !next.lesson ? go('path') : next.kind === 'checkpoint' ? openCheckpoint(next.lesson.id) : openGuidedLesson(next.lesson.id, level);
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
        <NavigationTile title="Escuta" description="Ouvir e entender frases N5." icon="sound" onClick={() => setScreen('listening')} />
        <NavigationTile title="Biblioteca e escrita" description="Kana, kanji e leitura." icon="learn" onClick={() => go('learn')} />
        <NavigationTile title="Caderno" description="Anotações, erros e dúvidas." icon="academic" onClick={() => go('notebook')} />
        <NavigationTile title="Laboratórios opcionais" description="Frases, fala e pronúncia." icon="puzzle" onClick={() => setScreen('labs')} />
        <NavigationTile title="Desafio rápido" description="Treino livre, sem nota na Trilha." icon="review" onClick={openSpeedQuiz} />
      </div>
      <details className="rounded-2xl border border-line bg-paper p-4">
        <summary className="min-h-11 flex items-center font-black cursor-pointer">Treinos extras</summary>
        <p className="text-xs text-muted py-2">Estes exercícios são opcionais e não aprovam etapas.</p>
        <Button variant="secondary" onClick={openSpeedQuiz}>Abrir desafio rápido</Button>
        <details className="mt-4 border-t border-line pt-3">
          <summary className="min-h-11 cursor-pointer font-bold">Treino de teclado japonês</summary>
          {typingUnit && <div className="space-y-3 pt-3">
            <label className="block text-sm font-bold" htmlFor="typing-unit">Conteúdo para praticar</label>
            <select id="typing-unit" value={typingUnit.id} onChange={event => setTypingId(event.target.value)} className="w-full min-h-12 rounded-xl border border-line bg-paper p-3 text-base">
              {typingUnits.map(unit => <option key={unit.id} value={unit.id}>{unit.title}</option>)}
            </select>
            <KanaTypingPractice key={typingUnit.id} samples={guidedSamples(typingUnit.id)} kind={typingUnit.kind} />
          </div>}
        </details>
      </details>
      <section className="rounded-2xl border border-line bg-paper p-4 space-y-2">
        <h2 className="font-bold text-ink-strong">Continue sua Trilha</h2>
        <p className="text-sm text-muted">Prossiga de onde parou sem iniciar um currículo diferente.</p>
        <Button variant="secondary" className="w-full" onClick={goNext}>Continuar {next.lesson?.title || 'etapa atual'} →</Button>
      </section>
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
  </div>;
}
