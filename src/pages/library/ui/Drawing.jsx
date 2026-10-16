import React, { useState, useEffect, useRef } from "react";
import Icon from "../../../shared/ui/Icon.jsx";
import { Button } from "../../../shared/ui/index.jsx";
import { getStrokeData } from "../../../entities/study/index.js";
import { kanjiVGPath, parseKanjiVG } from "../../../entities/study/index.js";

const INK_COLORS = [
  { id: "black", label: "Nanquim", hex: "#1f2421" },
  { id: "red", label: "Carmim", hex: "#dc2626" },
  { id: "indigo", label: "Índigo", hex: "#2563eb" },
];

const BRUSH_SIZES = [
  { id: "sm", label: "Fino", width: 4 },
  { id: "md", label: "Normal", width: 8 },
  { id: "lg", label: "Pincel", width: 14 },
];

export default function Drawing({ character, random, save }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const strokesHistory = useRef([]);
  const currentStroke = useRef([]);
  const isDrawing = useRef(false);

  const [activeStep, setActiveStep] = useState(0);
  const [modelOpacity, setModelOpacity] = useState("guide"); // "guide" (25%), "clear" (60%), "hidden" (0%)
  const [inkColor, setInkColor] = useState(INK_COLORS[0].hex);
  const [brushSize, setBrushSize] = useState(BRUSH_SIZES[1].width);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [kanjiPaths,setKanjiPaths] = useState([]);
  const [kanjiStatus,setKanjiStatus] = useState('idle');
  const svgPath = kanjiVGPath(character);
  useEffect(() => {
    if (!svgPath) {setKanjiPaths([]);setKanjiStatus('idle');return;}
    let cancelled=false;
    const controller=new AbortController();
    setKanjiPaths([]);setKanjiStatus('loading');
    fetch(svgPath,{signal:controller.signal}).then(response=>{
      if(!response.ok)throw new Error('KanjiVG não disponível');
      return response.text();
    }).then(source=>{
      if(cancelled)return;
      const paths=parseKanjiVG(source);
      if(!paths.length)throw new Error('SVG sem traços');
      setKanjiPaths(paths);setKanjiStatus('ready');
    }).catch(()=>{if(!cancelled)setKanjiStatus('error');});
    return ()=>{cancelled=true;controller.abort();};
  },[svgPath]);

  const kanaGuide=getStrokeData(character);
  const strokeData=svgPath ? {count:kanjiPaths.length,steps:kanjiPaths.map(stroke=>({
    n:stroke.number,hint:'Consulte o traço destacado no diagrama KanjiVG.'
  }))} : kanaGuide;
  const totalStrokes=svgPath ? kanjiPaths.length : (strokeData.count||strokeData.steps.length);
  const currentStepInfo=strokeData.steps[activeStep]||strokeData.steps[0];

  // Redimensionamento responsivo de alta resolução
  const redrawAll = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    const width=canvas.clientWidth,height=canvas.clientHeight;

    for (const stroke of strokesHistory.current) {
      if (stroke.points.length < 2) continue;
      ctx.beginPath();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.size;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.moveTo(stroke.points[0].x*width, stroke.points[0].y*height);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x*width, stroke.points[i].y*height);
      }
      ctx.stroke();
    }
  };

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr,0,0,dpr,0,0);
    redrawAll();
  };

  useEffect(() => {
    resizeCanvas();
    const observer = new ResizeObserver(resizeCanvas);
    if (canvasRef.current) observer.observe(canvasRef.current);
    return () => observer.disconnect();
  }, []);

  // Limpa ao trocar de caractere
  useEffect(() => {
    strokesHistory.current = [];
    currentStroke.current = [];
    setHasDrawn(false);
    setActiveStep(0);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    }
  }, [character]);

  const clear = () => {
    strokesHistory.current = [];
    currentStroke.current = [];
    setHasDrawn(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  };

  const undo = () => {
    if (strokesHistory.current.length === 0) return;
    strokesHistory.current.pop();
    setHasDrawn(strokesHistory.current.length > 0);
    redrawAll();
  };

  const getCanvasCoords = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: Math.min(1,Math.max(0,(e.clientX - rect.left)/Math.max(1,rect.width))),
      y: Math.min(1,Math.max(0,(e.clientY - rect.top)/Math.max(1,rect.height))),
    };
  };

  const onPointerDown = (e) => {
    e.preventDefault();
    if (isDrawing.current) return; // Ignore a second finger while drawing.
    isDrawing.current = true;
    activePointerId.current = e.pointerId;
    e.currentTarget.setPointerCapture(e.pointerId);
    const p = getCanvasCoords(e);
    currentStroke.current = [p];
  };

  const onPointerMove = (e) => {
    if (!isDrawing.current || e.pointerId !== activePointerId.current) return;
    const p = getCanvasCoords(e);
    currentStroke.current.push(p);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.strokeStyle = inkColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const pts = currentStroke.current;
    if (pts.length >= 2) {
      const p1 = pts[pts.length - 2];
      const p2 = pts[pts.length - 1];
      ctx.moveTo(p1.x*canvas.clientWidth, p1.y*canvas.clientHeight);
      ctx.lineTo(p2.x*canvas.clientWidth, p2.y*canvas.clientHeight);
      ctx.stroke();
    }
  };

  const activePointerId = useRef(null);
  const onPointerUp = (e) => {
    if (!isDrawing.current || e.pointerId !== activePointerId.current) return;
    isDrawing.current = false;
    activePointerId.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    if (currentStroke.current.length > 1) {
      strokesHistory.current.push({
        points: [...currentStroke.current],
        color: inkColor,
        size: brushSize,
      });
      setHasDrawn(true);
    }
    currentStroke.current = [];
  };
  const onPointerCancel = (e) => {
    if (e.pointerId !== activePointerId.current) return;
    isDrawing.current = false;
    activePointerId.current = null;
    currentStroke.current = [];
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    redrawAll(); // A canceled gesture must not become a saved kanji stroke.
  };

  return (
    <div className="w-full min-w-0 space-y-5">
      {/* 1. Barra de Ações Superior */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b-2 border-line">
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-black text-muted uppercase tracking-wider">
            Lousa de Caligrafia
          </span>
          <span className="text-xs font-black text-primary-strong uppercase tracking-wider">
            {svgPath && kanjiStatus !== 'ready' ? 'Guia KanjiVG' : `${totalStrokes} ${totalStrokes === 1 ? 'traço' : 'traços'}`}
          </span>
          <span className="hidden sm:inline-block text-xs font-bold text-muted">
            · Siga a ordem numérica
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={undo}
            disabled={!hasDrawn}
            title="Desfazer o último traço"
          >
            ↩ Desfazer
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={clear}
            disabled={!hasDrawn}
          >
            Limpar lousa
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={save}
            className="font-black"
          >
            ✓ Salvar treino
          </Button>
        </div>
      </div>

      {/* 2. Banner de Orientação: Onde Começar a Desenhar Primeiro */}
      <div className="hidden sm:flex sm:items-center justify-between gap-3 p-4 rounded-2xl border-2 border-flame/40 bg-flame-soft/40 text-ink">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-flame text-white text-xs font-black">
            {currentStepInfo?.n || 1}
          </span>
          <div className="min-w-0">
            <strong className="text-xs font-black text-ink-strong block sm:inline mr-2">
              {activeStep === 0
                ? "Comece desenhando por aqui:"
                : `Traço ${activeStep + 1} de ${totalStrokes}:`}
            </strong>
            <span className="text-xs text-muted font-bold leading-tight">
              {currentStepInfo?.hint}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          {currentStepInfo?.dir && (
            <span className="text-xs font-black text-flame uppercase tracking-wider">
              Direção: {currentStepInfo.dir}
            </span>
          )}
          <button
            type="button"
            onClick={() =>
              setActiveStep((cur) => totalStrokes ? (cur > 0 ? cur - 1 : totalStrokes - 1) : 0)
            }
            className="min-h-11 min-w-11 px-2 py-1 rounded-md border border-line bg-surface text-xs font-semibold text-ink hover:border-edge cursor-pointer"
            title="Traço anterior"
          >
            ◀
          </button>
          <button
            type="button"
            onClick={() =>
              setActiveStep((cur) => totalStrokes ? (cur < totalStrokes - 1 ? cur + 1 : 0) : 0)
            }
            className="min-h-11 min-w-11 px-2 py-1 rounded-md border border-line bg-surface text-xs font-semibold text-ink hover:border-edge cursor-pointer"
            title="Próximo traço"
          >
            ▶
          </button>
        </div>
      </div>

      <div className="sm:hidden rounded-xl border border-line bg-paper p-3 text-sm text-ink-strong flex items-start gap-2" role="note">
        <span aria-hidden="true" className="font-bold text-primary-strong">{activeStep+1}/{totalStrokes||1}</span>
        <span>{currentStepInfo?.hint || 'Siga o guia de traços e pratique no quadro abaixo.'}</span>
      </div>
      {/* 3. Área Central da Lousa (Canvas Amplo e Guiado) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full min-w-0">
        {/* Painel do Canvas de Caligrafia */}
        <div className="lg:col-span-8 space-y-3 w-full min-w-0">
          <div
            ref={containerRef}
            className="relative w-full max-w-2xl mx-auto aspect-square rounded-2xl border-2 border-edge/60 bg-surface overflow-hidden select-none touch-none shadow-none"
            style={{
              backgroundImage:
                "radial-gradient(circle, var(--color-line) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          >
            {/* Grade Tradicional de Caligrafia Japonesa (Genkouyoushi) */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {/* Linha vertical central tracejada */}
              <line
                x1="50"
                y1="0"
                x2="50"
                y2="100"
                stroke="var(--color-edge)"
                strokeWidth="0.8"
                strokeDasharray="2 2"
              />
              {/* Linha horizontal central tracejada */}
              <line
                x1="0"
                y1="50"
                x2="100"
                y2="50"
                stroke="var(--color-edge)"
                strokeWidth="0.8"
                strokeDasharray="2 2"
              />
              {/* Diagonais suaves em marca d'água */}
              <line
                x1="0"
                y1="0"
                x2="100"
                y2="100"
                stroke="var(--color-line)"
                strokeWidth="0.5"
                strokeDasharray="3 3"
              />
              <line
                x1="100"
                y1="0"
                x2="0"
                y2="100"
                stroke="var(--color-line)"
                strokeWidth="0.5"
                strokeDasharray="3 3"
              />
            </svg>

            {/* Modelo do Caractere em Escala Ampla */}
            {modelOpacity !== "hidden" && (
              <span
                className={`absolute inset-0 flex items-center justify-center select-none pointer-events-none font-jp text-[18rem] sm:text-[23rem] md:text-[27rem] font-light leading-none transition-opacity duration-200 ${
                  modelOpacity === "clear"
                    ? "text-primary/45"
                    : "text-primary/18"
                }`}
                lang="ja"
                aria-hidden="true"
              >
                {character}
              </span>
            )}

            {/* A ordem dos traços é mostrada no guia abaixo, sem sobrepor a lousa. */}

            {/* Canvas Nativo de Desenho */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
              data-drawing-surface="true"
              aria-label={`Área de desenho para o caractere ${character}`}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerCancel}
            />
          </div>

          {/* Controles de Lousa (Pincel, Tinta e Modelo) */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border border-line bg-surface max-w-2xl mx-auto">
            {/* Seletor de Tinta */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted font-medium mr-1">Tinta:</span>
              {INK_COLORS.map((ink) => (
                <button
                  key={ink.id}
                  type="button"
                  onClick={() => setInkColor(ink.hex)}
                  className={`h-11 w-11 rounded-full border-2 transition-transform cursor-pointer ${
                    inkColor === ink.hex
                      ? "scale-115 border-edge ring-2 ring-primary/20"
                      : "border-transparent hover:scale-105"
                  }`}
                  style={{ backgroundColor: ink.hex }}
                  title={ink.label}
                  aria-label={ink.label}
                />
              ))}
            </div>

            {/* Seletor de Espessura */}
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted font-medium mr-1">Pincel:</span>
              {BRUSH_SIZES.map((sz) => (
                <button
                  key={sz.id}
                  type="button"
                  onClick={() => setBrushSize(sz.width)}
                  className={`min-h-11 px-2.5 py-1 rounded-md text-xs font-semibold border transition-colors cursor-pointer ${
                    brushSize === sz.width
                      ? "bg-primary text-white border-primary"
                      : "bg-paper text-ink border-line hover:border-edge"
                  }`}
                >
                  {sz.label}
                </button>
              ))}
            </div>

            {/* Alternador de Modelo / Visibilidade */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() =>
                  setModelOpacity((cur) =>
                    cur === "guide"
                      ? "clear"
                      : cur === "clear"
                        ? "hidden"
                        : "guide",
                  )
                }
                className="min-h-11 px-2.5 py-1 rounded-md text-xs font-semibold border border-line bg-paper text-ink hover:border-edge cursor-pointer"
                title="Alternar visibilidade do caractere de fundo"
              >
                Modelo: {modelOpacity === "guide" ? "Guia" : modelOpacity === "clear" ? "Forte" : "Oculto"}
              </button>
            </div>
          </div>
        </div>

        {/* Painel Lateral: Ordem dos Traços & Instruções Passo a Passo */}
        <div className="lg:col-span-4 space-y-4 w-full min-w-0">
          {/* Card do Caractere em Foco */}
          <div className="p-5 rounded-2xl border border-line bg-surface text-center space-y-2">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">
              Caractere em estudo
            </span>
            <div className="font-jp text-6xl sm:text-7xl font-bold text-primary my-1">
              {character}
            </div>
            <p className="text-xs text-muted leading-relaxed">
              {svgPath ? (kanjiStatus === "ready" ? `${totalStrokes} traços segundo a referência KanjiVG.` : "Carregando guia de traços KanjiVG.") : `Guia de ${totalStrokes} traços para kana.`}
            </p>
            <Button
              variant="secondary"
              className="w-full mt-2"
              onClick={() => {
                clear();
                random();
              }}
            >
              Sortear outro caractere →
            </Button>
          </div>

          {/* Guia Passo a Passo: Onde Começar Cada Traço */}
          <div className="p-5 rounded-2xl border border-line bg-surface space-y-3">
            <div className="flex items-center justify-between">
              <strong className="text-sm font-bold text-ink">
                Ordem dos Traços (書き順)
              </strong>
              <span className="text-xs text-muted">Kakijun</span>
            </div>

            <p className="text-xs text-muted leading-relaxed">
              Consulte os passos abaixo. A lousa fica livre para desenhar com dedo, caneta ou mouse.
            </p>
            {svgPath && <div className="rounded-xl border border-line bg-paper p-3 space-y-2">
              {kanjiStatus === 'ready' ?
                <svg viewBox="0 0 109 109" role="img" aria-label={`Traço ${Math.min(activeStep + 1,totalStrokes)} de ${totalStrokes} do kanji ${character} destacado`} className="w-48 h-48 max-w-full mx-auto text-muted">
                  {kanjiPaths.map((stroke,i)=><path key={stroke.number} d={stroke.d} fill="none" stroke={i===activeStep?'var(--color-primary)':'currentColor'} opacity={i===activeStep?1:0.35} strokeWidth={i===activeStep?4.5:3} strokeLinecap="round" strokeLinejoin="round"/>)}
                </svg> :
                <p className="text-xs text-muted" role="status">{kanjiStatus==='error'?'Guia não disponível neste momento.':'Carregando traços…'}</p>}
              <p className="text-xs text-muted">Fonte: <a href="https://kanjivg.tagaini.net/" target="_blank" rel="noreferrer" className="underline">KanjiVG</a> (CC BY-SA 3.0). Selecione um passo abaixo para destacar seu traço.</p>
            </div>}

            <div className="space-y-2 pt-1">
              {strokeData.steps.map((st, i) => {
                const isActive = activeStep === i;
                return (
                  <button
                    key={st.n}
                    type="button"
                    onClick={() => setActiveStep(i)}
                    className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isActive
                        ? "border-flame bg-flame-soft/30 ring-1 ring-flame/40"
                        : "border-line bg-paper/60 hover:border-edge"
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        isActive
                          ? "bg-flame text-white"
                          : "bg-primary text-white"
                      }`}
                    >
                      {st.n}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <strong className="text-xs font-bold text-ink">
                          Traço {st.n}
                        </strong>
                        {st.dir && (
                          <span className="text-xs font-bold px-1.5 py-0.2 rounded bg-surface border border-line text-primary">
                            {st.dir}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted mt-0.5 leading-snug">
                        {st.hint}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Dica de Caligrafia */}
            <div className="mt-3 p-3 rounded-xl bg-accent-soft/40 border border-primary/20 text-xs text-primary leading-relaxed flex items-start gap-2">
              <Icon name="sparkles" className="w-4 h-4 shrink-0 text-flame mt-0.5" />
              <span>
                <strong>Orientação:</strong> consulte o guia do caractere. Não existe uma única direção para todos os traços.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
