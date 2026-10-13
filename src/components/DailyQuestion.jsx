import React, { useState, useEffect } from "react";
import { markStudy, todayKey } from "../state.js";
import { HOME_QUESTION } from "../curriculum.js";
import { Card, Button } from "./ui/index.jsx";
import Icon from "./Icon.jsx";

export default function DailyQuestion({ state, update, go, speak }) {
  const level = state.selectedLevel || "N5";
  const question = HOME_QUESTION[level];
  const key = `${todayKey()}:${level}`;
  const [selected, setSelected] = useState(
    () => state.dailyAnswers?.[key] ?? null,
  );
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    setSelected(state.dailyAnswers?.[key] ?? null);
  }, [key, state.dailyAnswers]);

  function answer(index) {
    if (selected !== null) return;
    setSelected(index);
    update((next) => {
      const alreadyAnswered = Number.isInteger(next.dailyAnswers?.[key]);
      next.dailyAnswers ||= {};
      next.dailyAnswers[key] = index;
      if (!alreadyAnswered) {
        next.stats.reviews += 1;
        if (index === question.answer) next.stats.correct += 1;
        markStudy(next);
      }
    });
  }

  const complete = selected !== null;
  const correct = selected === question.answer;

  // Estado quando a pergunta já foi respondida hoje
  if (complete && !showReview) {
    return (
      <Card className="flex flex-col justify-between gap-4 border-success/30 bg-success-soft/30">
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className={`flex items-center gap-1.5 text-xs font-black uppercase tracking-wider ${correct ? "text-[#58cc02]" : "text-[#ff9600]"}`}>
              <Icon name="check" /> {correct ? "Acertou hoje" : "Praticou hoje"}
            </span>
            <span className="text-xs font-semibold text-muted">
              Desafio Diário
            </span>
          </div>
          <h3 className="mt-3 text-lg font-bold text-ink">{question.prompt}</h3>
          <p
            className="mt-1 font-jp text-lg text-primary-strong font-medium"
            lang="ja"
          >
            {question.sentence}
          </p>
          <p className="mt-2 text-sm text-ink/80 bg-surface/80 rounded-lg p-3 border border-line">
            <strong>{correct ? "Correto!" : "Atenção:"}</strong>{" "}
            {question.explanation}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-line/60">
          <Button
            variant="primary"
            onClick={() => go("jlpt")}
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
        <span className="text-xs font-black uppercase tracking-wider text-[#58cc02]">Desafio do dia</span>
        <span className="text-xs font-semibold text-muted">01 / 01</span>
      </div>

      <div>
        <h3
          id="dailyQuestionTitle"
          tabIndex={-1}
          className="text-base font-bold text-ink"
        >
          {question.prompt}
        </h3>
        <div className="mt-3 flex items-center justify-between gap-3 rounded-lg bg-paper p-3 border border-line">
          <p
            className="font-jp text-xl font-bold text-primary-strong"
            lang="ja"
          >
            {question.sentence}
          </p>
          {speak && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => speak(question.sentence)}
              title="Ouvir pronúncia"
            >
              <Icon name="sound" /> Ouvir
            </Button>
          )}
        </div>
        {question.romaji && (
          <p className="mt-1 text-xs text-muted tabular-nums">
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
            <Button variant="primary" size="sm" onClick={() => go("jlpt")}>
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
