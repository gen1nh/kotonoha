import React, { useState } from "react";
import { todayKey, cardMatchesLevel } from "../state.js";
import { lessonsFor, isDone } from "../learning.js";
import DailyQuestion from "./DailyQuestion.jsx";
import Icon from "./Icon.jsx";
import {
  Button,
  Disclosure,
  ProgressBar,
} from "./ui/index.jsx";

export default function Home({
  state,
  update,
  go,
  speak,
  openLearn,
  openLesson,
  openSpeedQuiz,
  openStudySession,
  openOnboarding,
}) {
  const [duration, setDuration] = useState(15);
  const level = state.selectedLevel || "N5";
  const lessons = lessonsFor(level);
  const completed = lessons.filter((lesson) =>
    isDone(state, level, lesson),
  ).length;
  const next =
    lessons.find((lesson) => !isDone(state, level, lesson)) || lessons[0];
  const due = Object.values(state.cards).filter(
    (card) =>
      card.seen && card.due <= Date.now() && cardMatchesLevel(card, level),
  ).length;
  const dailyDone = Number.isInteger(
    state.dailyAnswers?.[`${todayKey()}:${level}`],
  );

  const start = () =>
    level === "N5" ? openStudySession(duration) : openLesson(next.id);

  const profile = state.userProfile;

  return (
    <div className="w-full min-w-0 space-y-8">
      {/* 1. HERO GAMIFICADO DUOLINGO COM SENSEI HIROSHI */}
      <section
        aria-labelledby="hero-session-title"
        className="w-full min-w-0 p-6 sm:p-8 rounded-3xl border-2 border-b-6 border-line bg-paper grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6 items-center shadow-xs"
      >
        <div className="space-y-3.5 min-w-0">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple text-white shadow-xs">
              <Icon name="academic" className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="type-caption text-purple-ink block">
                Sensei Hiroshi · 35 anos de ensino
              </span>
              <strong className="type-body-sm text-muted">
                Linguística Aplicada (TUFS) & Waseda
              </strong>
            </div>
          </div>

          <h2
            id="hero-session-title"
            className="type-display text-ink-strong"
          >
            {level === "N5"
              ? "Pronto para sua sessão diária de japonês?"
              : next.title}
          </h2>

          <p className="type-body text-muted leading-relaxed">
            {profile?.goal
              ? `Plano ativo focado no seu objetivo. Pratique hoje para manter sua ofensiva acesa.`
              : `Uma virada sintática por dia, sem travas e focado no padrão mental do brasileiro.`}
          </p>
        </div>

        <div className="space-y-3.5 w-full min-w-0 bg-raised p-5 rounded-2xl border-2 border-line">
          <div className="flex items-center justify-between type-caption text-ink">
            <span>Meta Diária</span>
            <select
              aria-label="Tempo de estudo hoje"
              value={duration}
              onChange={(event) => setDuration(Number(event.target.value))}
              className="rounded-xl border-2 border-line bg-paper px-3 py-1.5 type-caption text-ink-strong cursor-pointer focus:outline-none focus:border-primary shadow-xs"
            >
              {[
                { value: 10, label: "10 min · Rápido" },
                { value: 15, label: "15 min · Regular" },
                { value: 20, label: "20 min · Dedicado" },
                { value: 30, label: "30 min · Intenso" },
                { value: 45, label: "45 min · Imersão" },
                { value: 60, label: "60 min · Maratona" },
              ].map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <Button
            id="startStudySessionBtn"
            variant="primary"
            size="lg"
            className="w-full text-center"
            onClick={start}
          >
            Começar Estudo Agora →
          </Button>

          <button
            type="button"
            className="w-full text-center type-caption text-muted hover:text-ink-strong cursor-pointer transition-colors pt-1"
            onClick={() => go("jlpt")}
          >
            Ver Mapa da Trilha {level}
          </button>
        </div>
      </section>

      {/* 2. OS 6 LABORATÓRIOS E PRÁTICAS DO SENSEI HIROSHI (GRADE UNIFICADA) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="type-h2 text-ink-strong">
            Laboratórios de Fixação do Sensei
          </h3>
          <button
            type="button"
            onClick={() => go("practice")}
            className="type-body-sm text-blue hover:underline cursor-pointer font-extrabold"
          >
            Ver Central de Prática →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full min-w-0">
          {/* Card 1: Contraste Sintático */}
          <button
            type="button"
            onClick={() => go("syntax")}
            className="p-5 rounded-2xl border-2 border-b-4 border-line hover:border-blue bg-paper text-left transition-all cursor-pointer group active:translate-y-px"
          >
            <div className="flex items-start gap-3.5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-soft text-blue group-hover:scale-105 transition-transform">
                <Icon name="puzzle" className="w-6 h-6 text-blue" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <strong className="type-h3 block text-ink-strong group-hover:text-blue transition-colors">
                    Contraste Sintático SOV
                  </strong>
                  <span className="type-caption text-blue bg-blue-soft px-2 py-0.5 rounded-lg border border-blue/20">
                    N5 a N1
                  </span>
                </div>
                <p className="type-body-sm text-muted mt-1 leading-snug">
                  Arraste blocos para inverter a ordem SVO do português para o padrão japonês com partículas.
                </p>
              </div>
            </div>
          </button>

          {/* Card 2: Modo LINE / Roleplay */}
          <button
            type="button"
            onClick={() => (level === "N5" ? go("practice") : go("line"))}
            className="p-5 rounded-2xl border-2 border-b-4 border-line hover:border-primary bg-paper text-left transition-all cursor-pointer group active:translate-y-px"
          >
            <div className="flex items-start gap-3.5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent-soft text-primary group-hover:scale-105 transition-transform">
                <Icon name="phone" className="w-6 h-6 text-primary" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <strong className="type-h3 block text-ink-strong group-hover:text-primary transition-colors">
                    Simulador LINE
                  </strong>
                  <span
                    className={`type-caption px-2 py-0.5 rounded-lg border ${
                      level === "N5"
                        ? "text-flame-ink bg-flame-soft border-flame/30"
                        : "text-primary bg-accent-soft border-primary/20"
                    }`}
                  >
                    {level === "N5" ? "🔒 Requer N4" : "Desbloqueado"}
                  </span>
                </div>
                <p className="type-body-sm text-muted mt-1 leading-snug">
                  {level === "N5"
                    ? "Requer verbos casuais e conectivos -Te do N4 para praticar mensagens de chat realistas."
                    : "Roleplay no Japão com alternância entre Keigo formal e Tameguchi casual."}
                </p>
              </div>
            </div>
          </button>

          {/* Card 3: Pitch Accent */}
          <button
            type="button"
            onClick={() => (level === "N5" ? go("practice") : go("pitch"))}
            className="p-5 rounded-2xl border-2 border-b-4 border-line hover:border-flame bg-paper text-left transition-all cursor-pointer group active:translate-y-px"
          >
            <div className="flex items-start gap-3.5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-flame-soft text-flame group-hover:scale-105 transition-transform">
                <Icon name="mic" className="w-6 h-6 text-flame" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <strong className="type-h3 block text-ink-strong group-hover:text-flame transition-colors">
                    Pitch Accent & Fonética
                  </strong>
                  <span
                    className={`type-caption px-2 py-0.5 rounded-lg border ${
                      level === "N5"
                        ? "text-muted bg-raised border-line"
                        : "text-flame-ink bg-flame-soft border-flame/20"
                    }`}
                  >
                    {level === "N5" ? "🔒 Requer N4" : "Desbloqueado"}
                  </span>
                </div>
                <p className="type-body-sm text-muted mt-1 leading-snug">
                  {level === "N5"
                    ? "Domine primeiro os 46 sons dos alfabetos Kana antes de calibrar a entonação tonal de Tóquio."
                    : "Grave sua voz e compare o contorno sonoro de Tóquio para eliminar o sotaque."}
                </p>
              </div>
            </div>
          </button>

          {/* Card 4: Diário de Bordo de Erros */}
          <button
            type="button"
            onClick={() => go("errors")}
            className="p-5 rounded-2xl border-2 border-b-4 border-line hover:border-purple bg-paper text-left transition-all cursor-pointer group active:translate-y-px"
          >
            <div className="flex items-start gap-3.5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-soft text-purple-ink group-hover:scale-105 transition-transform">
                <Icon name="brain" className="w-6 h-6 text-purple-ink" />
              </span>
              <div className="min-w-0 flex-1">
                <strong className="type-h3 block text-ink-strong group-hover:text-purple-ink transition-colors">
                  Diário de Bordo de Erros
                </strong>
                <p className="type-body-sm text-muted mt-1 leading-snug">
                  Memória persistente com contraste cirúrgico (Incorreto vs Correto) do Sensei.
                </p>
              </div>
            </div>
          </button>

          {/* Card 5: Repetição Espaçada (SRS) */}
          <button
            type="button"
            onClick={() => go("review")}
            className="p-5 rounded-2xl border-2 border-b-4 border-line hover:border-blue bg-paper text-left transition-all cursor-pointer group active:translate-y-px"
          >
            <div className="flex items-start gap-3.5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-soft text-blue group-hover:scale-105 transition-transform">
                <Icon name="refresh" className="w-6 h-6 text-blue" />
              </span>
              <div className="min-w-0 flex-1">
                <strong className="type-h3 block text-ink-strong group-hover:text-blue transition-colors">
                  Repetição Espaçada (SRS)
                </strong>
                <p className="type-body-sm text-muted mt-1 leading-snug">
                  {due ? `${due} cartões para revisar hoje com algoritmo SuperMemo.` : "Tudo revisado por hoje! Memória consolidada."}
                </p>
              </div>
            </div>
          </button>

          {/* Card 6: Trilha Oficial JLPT */}
          <button
            type="button"
            onClick={() => go("jlpt")}
            className="p-5 rounded-2xl border-2 border-b-4 border-line hover:border-primary bg-paper text-left transition-all cursor-pointer group active:translate-y-px"
          >
            <div className="flex items-start gap-3.5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent-soft text-primary group-hover:scale-105 transition-transform">
                <Icon name="trophy" className="w-6 h-6 text-primary" />
              </span>
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="flex items-center justify-between">
                  <strong className="type-h3 block text-ink-strong group-hover:text-primary transition-colors">
                    Trilha JLPT {level}
                  </strong>
                  <span className="type-caption text-primary">{completed}/{lessons.length}</span>
                </div>
                <p className="type-body-sm text-muted leading-snug">
                  Lições guiadas pelo Sensei Hiroshi da gramática ao kanji.
                </p>
                <ProgressBar
                  value={(completed / (lessons.length || 1)) * 100}
                  label={`Progresso ${level}`}
                />
              </div>
            </div>
          </button>
        </div>
      </section>

      {/* 4. GAVETA: PERGUNTA DO DIA E FERRAMENTAS SECUNDÁRIAS */}
      <div className="space-y-4 pt-2">
        <Disclosure
          title="Pergunta Rápida do Dia"
          description="Um teste curto para aplicar o que você sabe."
          icon="bolt"
          status={dailyDone ? "Respondida hoje" : "Disponível"}
          tone={dailyDone ? "success" : "neutral"}
        >
          <DailyQuestion state={state} update={update} go={go} speak={speak} />
        </Disclosure>

        <Disclosure
          title="Biblioteca & Alfabetos Kana"
          description="Acesso aos alfabetos Hiragana, Katakana e Quiz Relâmpago de 60s."
          icon="learn"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full min-w-0 pt-2">
            <Button
              variant="secondary"
              onClick={() => openLearn("hiragana")}
              className="text-left justify-start"
            >
              あ Hiragana (46 sons)
            </Button>
            <Button
              variant="secondary"
              onClick={() => openLearn("katakana")}
              className="text-left justify-start"
            >
              ア Katakana (46 sons)
            </Button>
            <Button
              variant="secondary"
              onClick={openSpeedQuiz}
              className="text-left justify-start flex items-center gap-2"
            >
              <Icon name="bolt" className="w-4 h-4 text-flame" />
              <span>Quiz Relâmpago 60s</span>
            </Button>
          </div>
        </Disclosure>
      </div>
    </div>
  );
}

