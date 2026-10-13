import React, { useEffect, useState } from 'react';
import { FORMATIVE_LISTENING_N5, gradeFormativeListening } from '../pedagogy/formativeListening.js';
import { japaneseVoices, speakJapanese, stopSpeech, warmJapaneseVoices } from '../speech.js';
import { Button } from './ui/index.jsx';

/** Small, optional, no-API listening practice. Scores never unlock N4. */
export default function N5ListeningPractice() {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState(null);
  const [result, setResult] = useState(null);
  const [heardAudio, setHeardAudio] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [notice, setNotice] = useState('');
  const [voices, setVoices] = useState(() => japaneseVoices());
  const [voiceURI, setVoiceURI] = useState('');
  const [rate, setRate] = useState(0.85);
  const question = FORMATIVE_LISTENING_N5[index];

  useEffect(() => warmJapaneseVoices(setVoices), []);
  useEffect(() => () => stopSpeech(), []);

  const play = () => {
    setNotice(''); setHeardAudio(false);
    speakJapanese(question.spokenText, text => { setNotice(text); setHeardAudio(false); }, { rate, voiceURI, onStart: () => setHeardAudio(true) });
  };
  const check = () => {
    if (answer === null) return;
    setResult(gradeFormativeListening(question, answer, heardAudio && !showTranscript));
    stopSpeech();
  };
  const next = () => {
    stopSpeech();
    setIndex(i => (i + 1) % FORMATIVE_LISTENING_N5.length);
    setAnswer(null); setResult(null); setNotice(''); setHeardAudio(false); setShowTranscript(false);
  };

  return <section className="space-y-4 rounded-3xl border border-line bg-paper p-4 sm:p-5" aria-labelledby="listening-title">
    <div className="space-y-1">
      <p className="text-xs font-black text-primary-strong">TREINO EXTRA · N5</p>
      <h2 id="listening-title" className="text-lg font-black text-ink-strong">Prática de escuta</h2>
      <p className="text-sm text-muted">Ouça a frase e escolha a resposta. A voz é do seu dispositivo: pode variar e nem sempre funciona offline. Esta prática não aprova o N5 nem substitui a escuta do JLPT.</p>
    </div>
    <div className="text-xs text-muted">Questão {index + 1} de {FORMATIVE_LISTENING_N5.length}</div>
    <div className="rounded-2xl bg-raised p-4 space-y-3">
      <Button variant="primary" onClick={play} className="w-full">▶ Ouvir frase em japonês</Button>
      <details className="text-xs text-muted">
        <summary className="cursor-pointer min-h-8 font-bold">Ajustar voz e velocidade</summary>
        <div className="space-y-3 pt-2">
          <label className="block space-y-1">Voz japonesa
            <select value={voiceURI} onChange={event => setVoiceURI(event.target.value)} className="block min-h-11 w-full rounded-lg border border-line bg-paper px-2 text-ink-strong">
              <option value="">Automática</option>
              {voices.map((voice, i) => <option key={voice.voiceURI + '-' + i} value={voice.voiceURI}>{voice.name} ({voice.lang})</option>)}
            </select>
          </label>
          <label className="block space-y-1">Velocidade ({rate.toFixed(2)}×)
            <input className="block w-full" type="range" min="0.65" max="1.15" step="0.05" value={rate} onChange={event => setRate(Number(event.target.value))} />
          </label>
          {!voices.length && <p>Se nenhuma voz japonesa aparecer, ative uma voz japonesa nas configurações de acessibilidade/idioma do seu dispositivo. Algumas vozes requerem download.</p>}
        </div>
      </details>
      {notice && <p className="text-sm text-muted" role="alert">{notice}</p>}
      <button type="button" className="min-h-10 text-xs font-bold underline text-primary-strong" onClick={() => {stopSpeech(); setShowTranscript(true); setHeardAudio(false);}}>
        Não consigo ouvir · mostrar frase escrita
      </button>
      {showTranscript && <p lang="ja" className="rounded-lg bg-paper p-3 text-lg text-ink-strong">{question.spokenText}</p>}
    </div>
    <fieldset disabled={result !== null} className="space-y-2">
      <legend className="font-bold text-ink-strong mb-2">{question.prompt}</legend>
      {question.choices.map((choice, i) => <label key={i} className="flex min-h-11 cursor-pointer gap-2 items-center rounded-xl border border-line p-3 text-sm"><input type="radio" name="n5-formative-listening" checked={answer === i} onChange={() => setAnswer(i)} />{choice}</label>)}
    </fieldset>
    {result === null ? <Button variant="secondary" onClick={check} disabled={answer === null} className="w-full">Verificar resposta</Button> : <div className="space-y-3" role="status">
      <strong className={result.correct ? 'text-primary-strong' : 'text-ink-strong'}>{result.correct ? 'Correto!' : 'Resposta: ' + question.choices[question.answerIndex]}</strong>
      <p className="text-sm text-muted">{question.explanation}</p>
      <p className="text-xs text-muted">{result.skillEvidence === 'reading-assistance' ? 'Você consultou o texto ou o áudio não estava disponível; este resultado conta apenas como prática de leitura.' : 'Resultado de prática auditiva com voz sintética; não é uma prova certificadora.'}</p>
      <Button variant="primary" onClick={next} className="w-full">Próxima prática →</Button>
    </div>}
  </section>;
}
