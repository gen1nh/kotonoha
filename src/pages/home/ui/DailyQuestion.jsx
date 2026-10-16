import React, { useState, useEffect } from "react";
import {playSound} from "../../../shared/audio/index.js";
import { markStudy, todayKey } from "../../../entities/study/index.js";
import { dailyChallenge,useReadingPreferences } from "../../../entities/study/index.js";
import { Card, Button, AudioRateControl } from "../../../shared/ui/index.jsx";
import Icon from "../../../shared/ui/Icon.jsx";

export default function DailyQuestion({ state, update, go, speak, level: guidedLevel }) {
  const level = guidedLevel || state.selectedLevel || "N5";
  const question = dailyChallenge(state,level);
  const key = `${todayKey()}:${level}`;
  const [selected, setSelected] = useState(
    () => state.dailyAnswers?.[key] ?? null,
  );
  const [showReview, setShowReview] = useState(false);
  const readingPreferences=useReadingPreferences();
  const [speechRate,setSpeechRate]=useState(()=>readingPreferences.speechRate);

  useEffect(() => {
    setSelected(state.dailyAnswers?.[key] ?? null);
  }, [key, state.dailyAnswers]);

  function answer(index) {
    if (selected !== null) return;
    playSound(index===question.answer?'correct':'incorrect');
    setSelected(index);
    update((next) => {
      const alreadyAnswered = Number.isInteger(next.dailyAnswers?.[key]);
      next.dailyAnswers ||= {};
      next.dailyAnswers[key] = index;
      next.dailyQuestionIds ||= {};
      next.dailyQuestionIds[key] = question.id;
      if (!alreadyAnswered) {
        // Daily questions are practice, not spaced-repetition card reviews.
        // Keep SRS accuracy and review totals tied to actual card reviews.
        markStudy(next);
      }
    });
  }

  const complete = selected !== null;
  const correct = question&&selected === question.answer;
  if(!question)return <p className="text-sm text-muted">Seu desafio do dia aparece aqui depois de concluir sua primeira lição. Vamos começar pela Trilha!</p>;
  const japanesePrompt=/^[\u3040-\u30ff\u3400-\u9fffー々〆ヵヶ。、！？\s]+$/.test(question.prompt);
  const promptContent=japanesePrompt&&speak?
    <button type="button" lang="ja" aria-label="Ouvir caractere em japonês" onClick={()=>speak(question.prompt,{rate:speechRate})}
      className="flex min-h-11 items-center gap-2 text-left font-jp text-xl font-bold">{question.prompt}<Icon name="sound"/></button>:question.prompt;

  // Estado quando a pergunta já foi respondida hoje
  if (complete && !showReview) {
    return (
      <Card className="flex flex-col justify-between gap-4 border-success/30 bg-success-soft/30">
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className={`flex items-center gap-1.5 text-xs font-black uppercase tracking-wider ${correct ? "text-primary-strong" : "text-flame"}`}>
              <Icon name="check" /> {correct ? "Acertou hoje" : "Praticou hoje"}
            </span>
            <span className="text-xs font-semibold text-muted">
              Desafio do dia
            </span>
          </div>
          <h3 className="mt-3 text-lg font-bold text-ink">{promptContent}</h3>
          {question.sentence&&<button type="button" lang="ja" disabled={!speak}
            className="mt-1 flex min-h-11 items-center gap-2 text-left font-jp text-lg text-ink-strong font-semibold disabled:cursor-default"
            onClick={()=>speak?.(question.sentence,{rate:speechRate})}
            aria-label="Ouvir frase em japonês">
            {question.sentence} {speak&&<Icon name="sound"/>}
          </button>}
          <p className="mt-2 text-sm text-ink/80 bg-surface/80 rounded-lg p-3 border border-line">
            <strong>{correct ? "Correto!" : "Atenção:"}</strong>{" "}
            {question.explanation}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-line/60">
          <Button
            variant="primary"
            onClick={() => go?.("path")}
            className="flex-1 sm:flex-none"
          >
            Continuar na Trilha {level} →
          </Button>
          <Button
            variant="ghost"
            onClick={() => setShowReview(true)}
            className="text-xs"
          >
            Ver alternativas
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card aria-labelledby="dailyQuestionTitle" className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-black uppercase tracking-wider text-primary-strong">Desafio do dia</span>
        <span className="text-xs font-semibold text-muted">01 / 01</span>
      </div>

      <div>
        <h3
          id="dailyQuestionTitle"
          tabIndex={-1}
          className="text-base font-bold text-ink"
        >
          {promptContent}
        </h3>
        {question.sentence&&<button type="button" lang="ja" disabled={!speak}
          aria-label="Ouvir frase em japonês"
          onClick={()=>speak?.(question.sentence,{rate:speechRate})}
          className="mt-3 flex min-h-12 w-full items-center justify-between gap-3 rounded-lg bg-paper p-3 border border-line text-left disabled:cursor-default">
          <span className="font-jp text-xl font-bold text-ink-strong">{question.sentence}</span>
          {speak&&<Icon name="sound"/>}
        </button>}
        {speak&&<details className="mt-2 rounded-xl border border-line bg-paper p-3">
          <summary className="min-h-11 cursor-pointer text-xs font-bold text-ink-strong">Velocidade desta pergunta</summary>
          <div className="pt-2"><AudioRateControl rate={speechRate} onChange={setSpeechRate} defaultRate={readingPreferences.speechRate}/></div>
        </details>}
        {complete && readingPreferences.showRomaji && question.romaji && (
          <p lang="ja-Latn" className="mt-1 text-xs text-muted tabular-nums">
            {question.romaji}
          </p>
        )}
      </div>

      <div
        className="grid gap-2"
        role="group"
        aria-label="Escolha uma resposta"
      >
        {question.choices.map((choice, index) => {
          const isAnswer = index === question.answer;
          const isSelected = index === selected;
          return (
            <button
              key={choice}
              type="button"
              className={`flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-lg border p-3 text-left text-sm font-medium transition-all ${
                complete && isAnswer
                  ? "border-success bg-success-soft text-success font-bold"
                  : isSelected && !correct
                    ? "border-danger bg-danger-soft text-danger"
                    : complete
                      ? "border-line bg-paper/50 text-muted opacity-60"
                      : "border-edge bg-surface text-ink hover:bg-accent-soft active:translate-y-px"
              }`}
              aria-pressed={isSelected}
              disabled={complete}
              onClick={() => answer(index)}
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-paper text-xs font-bold text-ink border border-line">
                {String.fromCharCode(65 + index)}
              </span>
              <span>{choice}</span>
            </button>
          );
        })}
      </div>

      {complete && (
        <div
          className={`rounded-lg border p-4 ${
            correct
              ? "border-success bg-success-soft text-ink"
              : "border-secondary bg-secondary-soft text-ink"
          }`}
          role="status"
          aria-live="polite"
        >
          <strong className="block text-sm font-bold text-ink">
            {correct
              ? "Resposta certa!"
              : `A resposta é ${String.fromCharCode(65 + question.answer)}.`}
          </strong>
          <p className="mt-1 text-xs text-ink/90">{question.explanation}</p>
          <div className="mt-3 flex gap-2">
            <Button variant="primary" size="sm" onClick={() => go?.("path")}>
              Continuar a trilha {level} →
            </Button>
            {showReview && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReview(false)}
              >
                Recolher
              </Button>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
