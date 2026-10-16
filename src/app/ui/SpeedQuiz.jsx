import { playSound } from '../../shared/audio/index.js';
import {useReadingPreferences} from '../../entities/study/index.js';
import { useDialogFocus } from "../../shared/lib/index.js";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { speedPracticePool, speedPracticeQuestion } from "../../entities/study/model/practicePool.js";
import Icon from "../../shared/ui/Icon.jsx";

export default function SpeedQuiz({ state, update, onClose }) {
  useDialogFocus(onClose);
  const [mode, setMode] = useState("all"); // "hiragana", "katakana", "vocab", "all"
  const [phase, setPhase] = useState("idle"); // "idle", "playing", "finished"
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [currentQ, setCurrentQ] = useState(null);
  const readingPreferences=useReadingPreferences();
  const [feedback, setFeedback] = useState(null); // { choiceIndex, correct: boolean }

  const timerRef = useRef(null);
  const usedIds=useRef([]);
  const resultRecorded = useRef(false);

  // Eligible questions grow with the lessons already studied. Never expose future kana.
  const getPool=useCallback(()=>speedPracticePool(state,mode),[state.cards,mode]);
  const nextQuestion=useCallback(()=>{
    const pool=getPool();
    if(pool.length<4){setCurrentQ(null);setFeedback(null);return;}
    if(pool.every(item=>usedIds.current.includes(item.id)))usedIds.current=[];
    const question=speedPracticeQuestion(pool,usedIds.current);
    if(!question){setCurrentQ(null);setFeedback(null);return;}
    usedIds.current=[...usedIds.current,question.id];
    setCurrentQ(question);
    setFeedback(null);
  },[getPool]);
  // Inicia o Quiz
  const startGame = () => {
    if(getPool().length<4)return;
    usedIds.current=[...(state.speedRecords?.recentIds||[])];
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setCorrectCount(0);
    setWrongCount(0);
    setTimeLeft(60);
    setPhase("playing");
  };

  useEffect(() => {
    if (phase === "playing") {
      nextQuestion();
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setPhase("finished");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [phase, nextQuestion]);

  // Salva recorde ao terminar
  useEffect(() => {
    if (phase !== "finished") resultRecorded.current = false;
    if (phase === "finished" && !resultRecorded.current) {
      resultRecorded.current = true;
      playSound("complete");
      const records = state.speedRecords || {
        highScore: 0,
        bestCombo: 0,
        totalGames: 0,
      };
      const isNewHigh = score > (records.highScore || 0);
      const newMaxCombo = Math.max(maxCombo, records.bestCombo || 0);

      update((s) => {
        if (!s.speedRecords)
          s.speedRecords = { highScore: 0, bestCombo: 0, totalGames: 0 };
        s.speedRecords.totalGames = (s.speedRecords.totalGames || 0) + 1;
        s.speedRecords.recentIds=[...new Set([...(s.speedRecords.recentIds||[]),...usedIds.current])].slice(-50);
        if (isNewHigh) s.speedRecords.highScore = score;
        if (newMaxCombo > (s.speedRecords.bestCombo || 0))
          s.speedRecords.bestCombo = newMaxCombo;
      });
    }
  }, [phase, score, maxCombo, state.speedRecords, update]);

  // Responder pergunta
  const handleAnswer = (chosenAnswer, index) => {
    if (!currentQ || feedback) return;

    const isCorrect = chosenAnswer === currentQ.answer;
    setFeedback({ choiceIndex: index, correct: isCorrect });

    if (isCorrect) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      setMaxCombo((prev) => Math.max(prev, newCombo));
      const multiplier = Math.min(Math.floor(newCombo / 3) + 1, 4);
      setScore((s) => s + 10 * multiplier);
      setCorrectCount((c) => c + 1);
      playSound('correct');
    } else {
      setCombo(0);
      setWrongCount((w) => w + 1);
      playSound('incorrect');
    }

    setTimeout(() => {
      nextQuestion();
    }, 180);
  };

  // Suporte a teclado: teclas 1, 2, 3, 4 e Escape
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (phase === "playing" && currentQ && !feedback) {
        const keyIndex = ["1", "2", "3", "4"].indexOf(e.key);
        if (keyIndex >= 0 && currentQ.choices[keyIndex]) {
          handleAnswer(currentQ.choices[keyIndex], keyIndex);
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [phase, currentQ, feedback, onClose]);

  const highScore = state.speedRecords?.highScore || 0;
  const isNewRecord = phase === "finished" && score > highScore && score > 0;
  const accuracy =
    correctCount + wrongCount > 0
      ? Math.round((correctCount / (correctCount + wrongCount)) * 100)
      : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quiz-modal-title"
    >
      <div className="w-full max-w-lg min-w-0 bg-surface border border-line rounded-2xl p-6 sm:p-8 relative space-y-6 max-h-[90vh] overflow-y-auto select-none">
        <header className="flex items-center justify-between pb-4 border-b border-line">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-soft text-amber-ink border border-amber/30 text-lg">
              <Icon name="bolt" />
            </span>
            <div>
              <h2
                id="quiz-modal-title"
                className="text-base sm:text-lg font-bold text-ink"
              >
                Quiz Relâmpago 60s
              </h2>
              <small className="text-xs text-muted block">
                Somente caracteres e palavras que você já estudou
              </small>
            </div>
          </div>
          <button
            className="p-2 rounded-lg text-muted hover:text-ink hover:bg-paper cursor-pointer transition-colors"
            onClick={onClose}
            aria-label="Fechar quiz"
          >
            <Icon name="close" />
          </button>
        </header>

        {phase === "idle" && (
          <div className="space-y-6">
            <p className="text-sm text-muted leading-relaxed">
              Revise os caracteres e palavras que já aprendeu em 60 segundos. Construa
              combos para multiplicar seus pontos!
            </p>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-muted uppercase tracking-wider">
                Escolha o foco do treino:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  ["all", "Misto"],
                  ["hiragana", "Hiragana"],
                  ["katakana", "Katakana"],
                  ["vocab", "Vocabulário"],
                ].map(([m, label]) => (
                  <button
                    key={m}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                      mode === m
                        ? "bg-primary text-white border-primary font-bold"
                        : "bg-surface border-line text-muted hover:border-edge hover:text-ink"
                    }`}
                    onClick={() => setMode(m)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {highScore > 0 && (
              <div className="flex items-center gap-3 p-4 rounded-xl border border-line bg-paper">
                <Icon name="trophy" />
                <span className="text-sm text-ink">
                  Seu Recorde Atual:{" "}
                  <strong className="text-secondary-ink font-bold">
                    {highScore} pts
                  </strong>
                </span>
              </div>
            )}

            <button
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-primary text-white font-bold text-sm cursor-pointer hover:bg-primary-strong active:translate-y-px transition-all"
              onClick={startGame}
            >
              <Icon name="bolt" /> Começar Desafio (60s)
            </button>
          </div>
        )}

        {phase === "playing" && (
          <div className="space-y-6">
            {/* Barra superior de Tempo, Score e Combo */}
            <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-line bg-paper">
              <div className="flex-1 space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span
                    className={
                      timeLeft <= 10
                        ? "text-danger animate-pulse"
                        : "text-muted"
                    }
                  >
                    Tempo
                  </span>
                  <span
                    className={
                      timeLeft <= 10 ? "text-danger font-extrabold" : "text-ink"
                    }
                  >
                    {timeLeft}s
                  </span>
                </div>
                <div className="h-2 w-full bg-line rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      timeLeft <= 10 ? "bg-danger" : "bg-primary"
                    }`}
                    style={{ width: `${(timeLeft / 60) * 100}%` }}
                  />
                </div>
              </div>

              <div className="text-right pl-4 border-l border-line">
                <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">
                  Pontos
                </span>
                <strong className="text-xl font-extrabold text-ink">
                  {score}
                </strong>
              </div>

              {combo >= 2 && (
                <div className="text-secondary-ink font-bold text-xs flex items-center gap-1">
                  <Icon name="flame" className="w-3.5 h-3.5 text-flame" />
                  <span>{combo}x</span>
                </div>
              )}
            </div>

            {/* Prompt Central */}
            {currentQ && (
              <div className="p-8 rounded-xl border border-line bg-paper text-center space-y-2">
                <span className="text-xs font-semibold text-muted uppercase tracking-wider">
                  {currentQ.hint?.includes("(") && !readingPreferences.showRomaji && !feedback ? "Vocabulário" : currentQ.hint}
                </span>
                <div
                  className="font-jp text-5xl sm:text-6xl font-bold text-ink"
                  lang="ja"
                >
                  {currentQ.prompt}
                </div>
              </div>
            )}

            {/* 4 Alternativas */}
            {currentQ && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQ.choices.map((choice, i) => {
                  let statusStyle =
                    "border-line bg-surface text-ink hover:border-edge hover:bg-paper";
                  if (feedback && feedback.choiceIndex === i) {
                    statusStyle = feedback.correct
                      ? "border-success bg-success-soft text-success font-bold"
                      : "border-danger bg-danger-soft text-danger font-bold";
                  }
                  return (
                    <button
                      key={i}
                      className={`flex items-center gap-3 p-4 rounded-xl border font-medium text-sm text-left cursor-pointer transition-all active:translate-y-px ${statusStyle}`}
                      onClick={() => handleAnswer(choice, i)}
                    >
                      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-paper border border-line text-xs font-bold text-muted">
                        {i + 1}
                      </span>
                      <span className="flex-1">{choice}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {phase === "finished" && (
          <div className="space-y-6 text-center">
            <div className="p-6 rounded-xl border border-line bg-paper space-y-2">
              <span
                className="font-jp text-4xl font-bold text-primary-strong block"
                lang="ja"
              >
                完
              </span>
              <h3 className="text-xl font-bold text-ink">Tempo Esgotado!</h3>
              {isNewRecord && (
                <span className="inline-flex items-center gap-1.5 text-secondary-ink text-xs font-bold">
                  <Icon name="trophy" className="w-4 h-4 text-flame" />
                  <span>Novo Recorde Pessoal!</span>
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
              <div className="p-4 rounded-xl border border-primary/30 bg-accent-soft/30 space-y-1">
                <small className="text-[11px] font-bold text-muted uppercase block">
                  Pontos
                </small>
                <strong className="text-2xl font-extrabold text-primary-strong">
                  {score}
                </strong>
              </div>
              <div className="p-4 rounded-xl border border-line bg-surface space-y-1">
                <small className="text-[11px] font-bold text-muted uppercase block">
                  Maior Combo
                </small>
                <strong className="text-2xl font-extrabold text-ink">
                  {maxCombo}x
                </strong>
              </div>
              <div className="p-4 rounded-xl border border-line bg-surface space-y-1">
                <small className="text-[11px] font-bold text-muted uppercase block">
                  Precisão
                </small>
                <strong className="text-2xl font-extrabold text-ink">
                  {accuracy}%
                </strong>
              </div>
              <div className="p-4 rounded-xl border border-line bg-surface space-y-1">
                <small className="text-[11px] font-bold text-muted uppercase block">
                  Acertos / Erros
                </small>
                <strong className="text-2xl font-extrabold text-ink">
                  {correctCount} / {wrongCount}
                </strong>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary text-white font-bold text-sm cursor-pointer hover:bg-primary-strong active:translate-y-px transition-all"
                onClick={startGame}
              >
                <Icon name="bolt" /> Jogar Novamente
              </button>
              <button
                className="flex-1 py-3 px-4 rounded-xl border border-line bg-surface text-ink font-semibold text-sm cursor-pointer hover:border-edge hover:bg-paper transition-all"
                onClick={onClose}
              >
                Voltar ao Estúdio
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
