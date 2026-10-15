import React, { useState, useRef, useEffect } from "react";
import Icon from "../../../shared/ui/Icon.jsx";
import {AudioRateControl} from "../../../shared/ui/index.jsx";
import {useReadingPreferences} from "../../../entities/study/index.js";

export const MEDIA_CLIPS = [
  {
    id: "clip-1",
    title: "Diálogo no Konbini: Compras do Cotidiano",
    work: "Japonês da Vida Real · Situação Prática",
    category: "Cotidiano",
    level: "N5",
    lines: [
      {
        speaker: "Atendente",
        ja: "お弁当、温めますか？",
        furigana: "おべんとう、あたためますか？",
        ro: "Obentou, atatamemasu ka?",
        pt: "Deseja esquentar o bentô (refeição)?",
        words: [
          {
            ja: "お弁当",
            ro: "obentou",
            pt: "refeição pronta / marmita japonesa",
          },
          { ja: "温めます", ro: "atatamemasu", pt: "esquentar / aquecer" },
          {
            ja: "か",
            ro: "ka",
            pt: "partícula interrogativa (equivale a '?')",
          },
        ],
      },
      {
        speaker: "Você",
        ja: "はい、お願いします。レジ袋は大丈夫です。",
        furigana: "はい、おねがいします。レジぶくろはだいじょうぶです。",
        ro: "Hai, onegaishimasu. Rejibukuro wa daijoubu desu.",
        pt: "Sim, por favor. Sacola plástica não precisa (está tudo bem sem ela).",
        words: [
          { ja: "はい", ro: "hai", pt: "sim" },
          { ja: "お願いします", ro: "onegaishimasu", pt: "por favor" },
          {
            ja: "レジ袋",
            ro: "rejibukuro",
            pt: "sacola de compras / plástico",
          },
          { ja: "大丈夫", ro: "daijoubu", pt: "está tudo bem / dispensável" },
        ],
      },
    ],
  },
  {
    id: "clip-2",
    title: "Abertura Poética: Procurando por Alguém",
    work: "Kimi no Na wa (Your Name)",
    category: "Anime",
    level: "N5/N4",
    lines: [
      {
        speaker: "Taki / Mitsuha",
        ja: "ずっと何かを、誰かを、探している。",
        furigana: "ずっとなにかを、だれかを、さがしている。",
        ro: "Zutto nanika o, dareka o, sagashite iru.",
        pt: "Sempre estive procurando por algo, por alguém.",
        words: [
          { ja: "ずっと", ro: "zutto", pt: "o tempo todo / sempre" },
          { ja: "何か", ro: "nanika", pt: "algo / alguma coisa" },
          { ja: "誰か", ro: "dareka", pt: "alguém" },
          {
            ja: "探している",
            ro: "sagashite iru",
            pt: "procurando (forma contínua ている)",
          },
        ],
      },
    ],
  },
  {
    id: "clip-3",
    title: "Memória que Permanece: O Encontro na Floresta",
    work: "Sen to Chihiro no Kamikakushi (A Viagem de Chihiro)",
    category: "Anime",
    level: "N4",
    lines: [
      {
        speaker: "Zeniba",
        ja: "一度あったことは忘れないものさ、思い出せないだけで。",
        furigana: "いちどあったことはわすれないものさ、おもいだせないだけで。",
        ro: "Ichido atta koto wa wasurenai mono sa, omoidasenai dake de.",
        pt: "O que aconteceu uma vez nunca é esquecido, apenas não conseguimos nos lembrar.",
        words: [
          { ja: "一度", ro: "ichido", pt: "uma vez" },
          { ja: "あったこと", ro: "atta koto", pt: "coisas que aconteceram" },
          { ja: "忘れない", ro: "wasurenai", pt: "não esquecer (negativo)" },
          {
            ja: "思い出せない",
            ro: "omoidasenai",
            pt: "não conseguir recordar",
          },
          { ja: "だけで", ro: "dake de", pt: "apenas / só porque" },
        ],
      },
    ],
  },
  {
    id: "clip-4",
    title: "Música Imortal: Olhando para Cima",
    work: "Sukiyaki (上を向いて歩こう)",
    category: "Música",
    level: "N5",
    lines: [
      {
        speaker: "Kyu Sakamoto",
        ja: "上を向いて歩こう、涙がこぼれないように。",
        furigana: "うえをむいてあるこう、なみだがこぼれないように。",
        ro: "Ue o muite arukou, namida ga koborenai you ni.",
        pt: "Vou caminhar olhando para cima, para que as lágrimas não caiam.",
        words: [
          { ja: "上", ro: "ue", pt: "para cima / topo" },
          { ja: "向いて", ro: "muite", pt: "voltado / virado para" },
          { ja: "歩こう", ro: "arukou", pt: "vamos caminhar (volitivo)" },
          { ja: "涙", ro: "namida", pt: "lágrimas" },
          {
            ja: "こぼれないように",
            ro: "koborenai you ni",
            pt: "para que não transbordem",
          },
        ],
      },
    ],
  },
];

export default function MediaLab({ state, update, speak, toast }) {
  const readingPreferences=useReadingPreferences();
  const [speechRate,setSpeechRate]=useState(()=>readingPreferences.speechRate);
  const [selectedClipId, setSelectedClipId] = useState("clip-1");
  const [showFurigana, setShowFurigana] = useState(true);
  const [showPt, setShowPt] = useState(true);
  const [selectedWord, setSelectedWord] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState(null);

  const recordedPlayerRef=useRef(null);
  useEffect(()=>{if(recordedPlayerRef.current)recordedPlayerRef.current.playbackRate=speechRate;},[speechRate,recordedAudioUrl]);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  useEffect(
    () => () => {
      const recorder = mediaRecorderRef.current;
      if (recorder?.state === "recording") {
        recorder.onstop = null;
        recorder.stop();
      }
      recorder?.stream.getTracks().forEach((track) => track.stop());
    },
    [],
  );
  useEffect(
    () => () => {
      if (recordedAudioUrl) URL.revokeObjectURL(recordedAudioUrl);
    },
    [recordedAudioUrl],
  );

  const clip =
    MEDIA_CLIPS.find((c) => c.id === selectedClipId) || MEDIA_CLIPS[0];

  // Tocar pronúncia da linha
  const handlePlayLine = (text) => {
    if (speak) speak(text,{rate:speechRate});
  };

  // Gravar voz para Shadowing
  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: recorder.mimeType,
        });
        const url = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      if (toast)
        toast("Permissão de microfone necessária para o treino de fala.");
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (toast) toast("Gravação concluída! Escute abaixo para comparar.");
    }
  };

  // Salvar palavra selecionada no Caderno
  const handleSaveWord = (word) => {
    update((s) => {
      if (!s.notebook) s.notebook = { notes: [], kanban: [], doubts: [] };
      s.notebook.notes.unshift({
        id: `note-word-${Date.now()}`,
        title: `Palavra: ${word.ja} (${word.ro})`,
        content: `### Vocabulário de Mídia: ${word.ja}\n- **Leitura:** ${word.ro}\n- **Significado:** ${word.pt}\n- **Origem:** ${clip.work} (${clip.title})\n\nFrase:\n${clip.lines[0]?.ja}`,
        tags: ["Vocabulário", "Mídia Real", clip.level],
        updatedAt: Date.now(),
      });
    });
    if (toast) toast(`"${word.ja}" salvo no seu Caderno de Estudo!`);
    setSelectedWord(null);
  };

  return (
    <div className="w-full space-y-6">
      <header className="p-6 rounded-2xl border border-line bg-paper space-y-2">
        <div className="inline-flex items-center gap-2 text-primary-strong text-xs font-bold">
          <Icon name="media" />
          <span>LABORATÓRIO DE IMERSÃO CULTURAL</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-ink">
          Japonês Real em Animes, Músicas & Diálogos
        </h2>
        <p className="text-sm text-muted leading-relaxed max-w-3xl">
          Aprenda com falas e letras autênticas. Pratique escuta com repetição,
          consulte significados palavra por palavra e treine sua pronúncia com
          gravação de voz (shadowing).
        </p>
      </header>

      <details className="rounded-xl border border-line bg-paper p-3">
        <summary className="min-h-11 cursor-pointer text-sm font-bold text-ink-strong">Velocidade dos diálogos desta sessão</summary>
        <div className="pt-2"><AudioRateControl rate={speechRate} onChange={setSpeechRate} defaultRate={readingPreferences.speechRate}/></div>
      </details>
      {/* Seletor de Cenas / Mídias */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 w-full min-w-0">
        {MEDIA_CLIPS.map((c) => (
          <button
            key={c.id}
            className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all space-y-1 ${
              c.id === selectedClipId
                ? "border-primary bg-accent-soft/30 font-bold"
                : "border-line bg-surface hover:border-edge"
            }`}
            onClick={() => {
              setSelectedClipId(c.id);
              setSelectedWord(null);
              setRecordedAudioUrl(null);
            }}
          >
            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-index text-ink border border-line">
              {c.category}
            </span>
            <strong className="block text-xs text-ink">{c.title}</strong>
            <small className="block text-[11px] text-muted">{c.work}</small>
          </button>
        ))}
      </div>

      {/* Player e Exibição de Diálogo Interativo */}
      <div className="p-4 sm:p-6 rounded-2xl border border-line bg-surface space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-line">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted">
            <span className="px-2 py-0.5 rounded bg-index text-ink font-bold border border-line">
              {clip.level}
            </span>
            <span>{clip.work}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                showFurigana
                  ? "border-primary bg-accent-soft/60 text-primary-strong font-bold"
                  : "border-line bg-surface text-muted hover:text-ink"
              }`}
              onClick={() => setShowFurigana(!showFurigana)}
            >
              Leitura em kana: {showFurigana ? "Ligada" : "Desligada"}
            </button>
            <button
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                showPt
                  ? "border-primary bg-accent-soft/60 text-primary-strong font-bold"
                  : "border-line bg-surface text-muted hover:text-ink"
              }`}
              onClick={() => setShowPt(!showPt)}
            >
              Tradução: {showPt ? "Visível" : "Oculta"}
            </button>
          </div>
        </div>

        {/* Linhas do Diálogo */}
        <div className="space-y-4">
          {clip.lines.map((line, idx) => (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-xl border border-line bg-paper/60 space-y-3"
            >
              <div className="text-xs font-bold text-muted uppercase tracking-wider">
                {line.speaker}
              </div>

              {/* Frase com Furigana opcional */}
              <div
                className="flex items-start justify-between gap-4 font-jp text-lg sm:text-xl font-bold text-ink"
                lang="ja"
              >
                <span className="leading-relaxed">
                  {line.ja}
                </span>
                <button
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-line bg-surface text-ink hover:bg-paper cursor-pointer transition-colors"
                  onClick={() => handlePlayLine(line.ja)}
                  title="Escutar fala" aria-label="Escutar fala"
                >
                  <Icon name="sound" />
                </button>
              </div>

              {showFurigana&&<p className="text-xs font-semibold text-muted"><span className="sr-only">Leitura em kana: </span><span lang="ja">{line.furigana}</span></p>}
              {readingPreferences.showRomaji&&<p lang="ja-Latn" className="text-xs font-semibold text-muted">{line.ro}</p>}
              {showPt && (
                <div className="text-sm font-medium text-ink pt-1 border-t border-line/60">
                  {line.pt}
                </div>
              )}

              {/* Lista de Palavras Interativas para Toque */}
              <div className="pt-2 border-t border-line/60 space-y-2">
                <small className="text-[11px] font-bold text-muted uppercase tracking-wider block">
                  Toque em uma palavra para ver detalhes:
                </small>
                <div className="flex flex-wrap gap-2">
                  {line.words.map((w, wIdx) => (
                    <button
                      key={wIdx}
                      className={`px-3 py-1.5 rounded-lg border text-xs cursor-pointer transition-all ${
                        selectedWord?.ja === w.ja
                          ? "border-primary bg-primary text-white font-bold"
                          : "border-line bg-surface text-ink hover:border-edge"
                      }`}
                      onClick={() => setSelectedWord(w)}
                    >
                      <strong className="block font-jp font-bold" lang="ja">
                        {w.ja}
                      </strong>
                      {readingPreferences.showRomaji&&<small lang="ja-Latn" className="block opacity-80">{w.ro}</small>}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Popover da Palavra Tocada */}
        {selectedWord && (
          <div className="p-4 rounded-xl border border-primary/30 bg-accent-soft/40 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <strong
                  className="font-jp text-base font-bold text-primary-strong"
                  lang="ja"
                >
                  {selectedWord.ja}
                </strong>
                {readingPreferences.showRomaji&&<span lang="ja-Latn" className="text-xs text-muted">({selectedWord.ro})</span>}
              </div>
              <p className="text-sm text-ink">{selectedWord.pt}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-line bg-surface text-xs font-semibold text-ink hover:bg-paper cursor-pointer transition-colors"
                onClick={() => handlePlayLine(selectedWord.ja)}
              >
                <Icon name="sound" /> Ouvir
              </button>
              <button
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-bold cursor-pointer hover:bg-primary-strong transition-colors"
                onClick={() => handleSaveWord(selectedWord)}
              >
                <Icon name="paper" /> Salvar no Caderno
              </button>
              <button
                className="p-1.5 rounded-lg text-muted hover:text-ink cursor-pointer transition-colors"
                onClick={() => setSelectedWord(null)}
              >
                <Icon name="close" />
              </button>
            </div>
          </div>
        )}

        {/* Treino de Shadowing & Gravação de Voz */}
        <div className="p-5 rounded-xl border border-line bg-paper space-y-3">
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-muted uppercase tracking-wider flex items-center gap-1.5">
              <Icon name="sound" /> <span>Treino de Fala & Shadowing</span>
            </h4>
            <p className="text-xs text-muted leading-relaxed">
              Ouça a fala do nativo, repita em voz alta e grave sua voz para
              comparar a entonação.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-1">
            {!isRecording ? (
              <button
                className="px-4 py-2 rounded-xl bg-primary text-white font-bold text-xs cursor-pointer hover:bg-primary-strong transition-colors"
                onClick={handleStartRecording}
              >
                ● Começar a Gravar
              </button>
            ) : (
              <button
                className="px-4 py-2 rounded-xl border border-danger text-danger bg-danger-soft/40 font-bold text-xs cursor-pointer animate-pulse transition-colors"
                onClick={handleStopRecording}
              >
                ■ Parar Gravação
              </button>
            )}

            {recordedAudioUrl && (
              <div className="flex items-center gap-2">
                <small className="text-xs font-semibold text-muted">
                  Sua gravação:
                </small>
                <audio
                  ref={recordedPlayerRef}
                  controls
                  src={recordedAudioUrl}
                  className="w-full min-w-0"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
