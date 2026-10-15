import React, { useState, useRef, useEffect } from "react";
import Icon from "../../../shared/ui/Icon.jsx";
import { Button, Card, AudioRateControl } from "../../../shared/ui/index.jsx";
import {useReadingPreferences} from "../../../entities/study/index.js";
import { PageHeading } from "../../../shared/ui/index.jsx";

export const PITCH_EXERCISES = [
  {
    id: "ame_rain_candy",
    word: "雨 (Ame)",
    meaning: "Chuva",
    patternName: "Atamadaka (頭高 - Alto no Início)",
    patternType: "atamadaka",
    morae: [
      { text: "あ", pitch: "high", label: "A (Alto)" },
      { text: "め", pitch: "low", label: "me (Baixo)" },
    ],
    contrastPair: {
      word: "飴 (Ame)",
      meaning: "Bala / Doce",
      patternName: "Heiban (平板 - Plano)",
      morae: [
        { text: "あ", pitch: "low", label: "a (Baixo)" },
        { text: "め", pitch: "high", label: "ME (Alto)" },
      ],
    },
    tip: "Em 'chuva' (雨), a voz começa alta na primeira sílaba e cai bruscamente. O brasileiro tende a falar plano, o que faz soar como 'doce' (飴)!",
  },
  {
    id: "hashi_chopsticks_bridge",
    word: "箸 (Hashi)",
    meaning: "Pauzinhos / Hashi",
    patternName: "Atamadaka (頭高)",
    patternType: "atamadaka",
    morae: [
      { text: "は", pitch: "high", label: "HA (Alto)" },
      { text: "し", pitch: "low", label: "shi (Baixo)" },
    ],
    contrastPair: {
      word: "橋 (Hashi)",
      meaning: "Ponte",
      patternName: "Odaka (尾高 - Alto no Fim)",
      morae: [
        { text: "は", pitch: "low", label: "ha (Baixo)" },
        { text: "し", pitch: "high", label: "SHI (Alto)" },
      ],
    },
    tip: "Se você pedir 'ponte' no restaurante em Tóquio em vez de 'hashi', o garçom vai rir! 箸 começa alto; 橋 começa baixo.",
  },
  {
    id: "nihon_japan",
    word: "日本 (Nihon)",
    meaning: "Japão",
    patternName: "Heiban (平板 - Plano)",
    patternType: "heiban",
    morae: [
      { text: "に", pitch: "low", label: "ni (Baixo)" },
      { text: "ほ", pitch: "high", label: "HO (Alto)" },
      { text: "ん", pitch: "high", label: "N (Alto)" },
    ],
    contrastPair: null,
    tip: "A maioria das palavras japonesas (~50%) segue o padrão Heiban: a primeira sílaba é baixa, a segunda sobe e permanece alta sem cair na partícula que a segue.",
  },
];

export default function PitchAccentLab({ speak, toast }) {
  const readingPreferences=useReadingPreferences();
  const [speechRate,setSpeechRate]=useState(()=>readingPreferences.speechRate);
  const audioPlaybackRef=useRef(null);
  const [selectedWordIndex, setSelectedWordIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  useEffect(()=>{if(audioPlaybackRef.current)audioPlaybackRef.current.playbackRate=speechRate;},[speechRate,audioUrl]);
  const [waveformActive, setWaveformActive] = useState(false);
  const [senseiFeedback, setSenseiFeedback] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const audioCtxRef = useRef(null);
  const liveStreamRef = useRef(null);

  const currentItem = PITCH_EXERCISES[selectedWordIndex];

  // Iniciar Gravação de Voz Real pelo Microfone
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      liveStreamRef.current=stream;
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      if(audioCtxRef.current.state==='suspended')await audioCtxRef.current.resume();
      const source = audioCtxRef.current.createMediaStreamSource(stream);
      const analyser = audioCtxRef.current.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      // Animação da Forma de Onda no Canvas
      const drawWaveform = () => {
        animationFrameRef.current = requestAnimationFrame(drawWaveform);
        analyser.getByteTimeDomainData(dataArray);

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--color-surface").trim() || "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.lineWidth = 3;
        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--color-primary-strong").trim() || "#2e7c26";
        ctx.beginPath();

        const sliceWidth = (canvas.width * 1.0) / bufferLength;
        let x = 0;
        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * canvas.height) / 2;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
          x += sliceWidth;
        }
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
      };
      drawWaveform();

      if(typeof MediaRecorder==='undefined')throw new Error('Gravação de áudio não suportada pelo navegador.');
      const formats=['audio/mp4','audio/webm;codecs=opus','audio/webm'];
      const mimeType=formats.find(t=>MediaRecorder.isTypeSupported?.(t));
      mediaRecorderRef.current = mimeType?new MediaRecorder(stream,{mimeType}):new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorderRef.current?.mimeType || audioChunksRef.current[0]?.type || "audio/mp4" });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(previous=>{if(previous)URL.revokeObjectURL(previous);return url;});
        stream.getTracks().forEach((track) => track.stop());
        cancelAnimationFrame(animationFrameRef.current);
        audioCtxRef.current?.close().catch(()=>{});audioCtxRef.current=null;
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setWaveformActive(true);
      setSenseiFeedback(null);
    } catch (err) {
      liveStreamRef.current?.getTracks().forEach(track=>track.stop());
      audioCtxRef.current?.close().catch(()=>{});audioCtxRef.current=null;
      if (toast) toast(err?.message?.includes('suportada') ? err.message : "Não foi possível gravar. Confira a permissão do microfone no navegador.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setWaveformActive(false);

      // Sem análise acústica automática, não inventar uma avaliação da pronúncia.
      setSenseiFeedback('Gravação concluída. Ouça sua voz e compare manualmente com o modelo. Esta ferramenta não pontua pronúncia automaticamente.');
    }
  };

  useEffect(()=>()=>{
    if(mediaRecorderRef.current?.state==='recording')mediaRecorderRef.current.stop();
    liveStreamRef.current?.getTracks().forEach(track=>track.stop());
    cancelAnimationFrame(animationFrameRef.current);
    audioCtxRef.current?.close().catch(()=>{});
  },[]);
  useEffect(()=>()=>{if(audioUrl)URL.revokeObjectURL(audioUrl);},[audioUrl]);
  return (
    <div className="w-full space-y-6">
      {/* Topo do Laboratório de Pitch */}
      <PageHeading
        title="Laboratório de Pitch Accent & Fonética de Tóquio"
        description="O japonês é uma língua de entonação tonal (alto/baixo). Grave sua fala, ouça e compare com o exemplo. Esta ferramenta não avalia automaticamente sua pronúncia."
        icon="mic"
        iconBg="bg-flame-soft"
        iconColor="text-flame"
      >
        <div className="flex items-center gap-2">
          {PITCH_EXERCISES.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setSelectedWordIndex(idx);
                setAudioUrl(null);
                setSenseiFeedback(null);
              }}
              className={`px-3.5 py-1.5 rounded-xl type-caption border-2 border-b-4 cursor-pointer transition-all active:translate-y-px ${
                idx === selectedWordIndex
                  ? "border-primary bg-accent-soft text-primary-strong border-b-primary-dark shadow-xs"
                  : "border-line bg-paper text-muted hover:border-edge"
              }`}
            >
              {item.word.split(" ")[0]}
            </button>
          ))}
        </div>
      </PageHeading>

      {/* Cartão de Visualização Gráfica do Pitch Accent */}
      <Card className="space-y-6 border-2 border-b-6 border-line bg-paper rounded-3xl p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b-2 border-line">
          <div>
            <h3 className="type-display text-ink-strong font-jp flex items-center gap-3">
              <span>{currentItem.word}</span>
              <span className="type-body-sm font-bold text-muted">({currentItem.meaning})</span>
            </h3>
            <span className="type-caption text-blue mt-0.5 block uppercase tracking-wider">
              Padrão: {currentItem.patternName}
            </span>
          </div>

          <Button
            variant="blue"
            size="md"
            onClick={() => speak && speak(currentItem.word.split(" ")[0],{rate:speechRate})}
          >
            <Icon name="sound" /> Ouvir voz de referência (sintética)
          </Button>
        </div>

        {/* Gráfico Curva de Entonação de Tóquio (Pitch Curve) */}
        <div className="space-y-2">
          <span className="type-caption text-muted uppercase tracking-wider block">
            Contorno de Pitch Padrão (Tóquio):
          </span>
          <div className="p-6 rounded-2xl bg-raised border-2 border-line flex items-center justify-around">
            {currentItem.morae.map((m, idx) => (
              <div key={idx} className="flex flex-col items-center gap-3">
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-black transition-all ${
                    m.pitch === "high"
                      ? "bg-danger text-white -translate-y-3 shadow-xs"
                      : "bg-blue text-white translate-y-3 shadow-xs"
                  }`}
                >
                  {m.text}
                </span>
                <span className="type-caption text-ink-strong">{m.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contraste Crítico (O que muda com a entonação errada) */}
        {currentItem.contrastPair && (
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-soft/60 border-2 border-flame space-y-2">
            <div className="flex items-center gap-2">
              <Icon name="alert" className="w-4 h-4 text-flame-ink" />
              <strong className="type-h3 text-flame-ink">
                Cuidado com o Par Contrastante:
              </strong>
            </div>
            <p className="type-body-sm text-flame-ink leading-relaxed">
              Se você alterar o tom para <strong>{currentItem.contrastPair.patternName}</strong>, a palavra vira{" "}
              <strong>{currentItem.contrastPair.word} ({currentItem.contrastPair.meaning})</strong>!
            </p>
            <p className="type-body-sm text-ink pt-2 border-t border-flame/30 font-bold">
              Orientação do Sensei: {currentItem.tip}
            </p>
          </div>
        )}

        {/* Área de Gravação do Aluno */}
        <div className="space-y-4 pt-4 border-t-2 border-line">
          <span className="type-caption text-muted uppercase tracking-wider block">
            Grave Sua Voz e Compare o Contorno Sonoro:
          </span>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            {!isRecording ? (
              <Button
                variant="danger"
                size="lg"
                className="w-full sm:w-auto"
                onClick={startRecording}
              >
                <Icon name="mic" className="w-5 h-5 text-white" />
                <span>Gravar Minha Voz</span>
              </Button>
            ) : (
              <Button
                variant="flame"
                size="lg"
                className="w-full sm:w-auto animate-pulse"
                onClick={stopRecording}
              >
                <span className="h-3 w-3 bg-white mr-2 inline-block rounded-xs" />
                <span>Parar Gravação</span>
              </Button>
            )}

            {audioUrl && (
              <div className="flex flex-col gap-3">
                <audio ref={audioPlaybackRef} controls src={audioUrl} className="h-10 rounded-xl" aria-label="Ouvir minha gravação" />
              </div>
            )}
          </div>

          {audioUrl&&<details className="rounded-xl border border-line bg-paper p-3">
            <summary className="min-h-11 cursor-pointer text-sm font-bold text-ink-strong">Velocidade da minha gravação</summary>
            <div className="pt-2"><AudioRateControl rate={speechRate} onChange={setSpeechRate} defaultRate={readingPreferences.speechRate}/></div>
          </details>}
          {/* Canvas Waveform com Maior Altura */}
          <div className="h-36 sm:h-40 w-full rounded-2xl bg-paper border-2 border-b-4 border-line overflow-hidden flex items-center justify-center relative">
            <canvas
              ref={canvasRef}
              width={600}
              height={96}
              className="w-full h-full"
            />
            {!waveformActive && !audioUrl && (
              <span className="absolute type-caption text-muted">
                Pressione "Gravar Minha Voz" para gerar o gráfico de onda sonora
              </span>
            )}
          </div>

          {/* Feedback do Sensei Hiroshi */}
          {senseiFeedback && (
            <div className="p-4 rounded-2xl bg-purple-soft border-2 border-purple text-xs text-ink-strong leading-relaxed">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-jp font-black text-purple-ink">博</span>
                <strong className="text-purple-ink">Diagnóstico Fonético do Sensei:</strong>
              </div>
              <p className="font-medium">{senseiFeedback}</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
