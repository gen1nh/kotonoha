import React, { useState } from "react";
import { LEVELS, cardMatchesLevel } from "./state.js";
import { Learn } from "./components/Learn.jsx";
import { Review } from "./components/Review.jsx";
import { Jlpt } from "./components/Jlpt.jsx";
import { Settings } from "./components/Settings.jsx";
import Home from "./components/Home.jsx";
import Icon from "./components/Icon.jsx";
import { Brand, NAVIGATION, NavItem } from "./components/UI.jsx";
import StreakPopover from "./components/StreakPopover.jsx";
import SpeedQuiz from "./components/SpeedQuiz.jsx";
import StudySession from "./components/StudySession.jsx";
import SyntaxLab from "./components/SyntaxLab.jsx";
import LineSimulator from "./components/LineSimulator.jsx";
import PitchAccentLab from "./components/PitchAccentLab.jsx";
import ErrorMemory from "./components/ErrorMemory.jsx";
import PracticeHub from "./components/PracticeHub.jsx";
import OnboardingModal from "./components/OnboardingModal.jsx";

const PAGES = {
  home: [
    "Aprender Japonês",
    "Trilha gamificada com a mentoria socrática do Sensei Hiroshi.",
  ],
  practice: [
    "Prática & Laboratórios",
    "Ambientes imersivos calibrados com desbloqueio pedagógico para o seu nível.",
  ],
  syntax: [
    "Contraste Sintático",
    "Inverta a mente do português (SVO) para o padrão japonês (SOV com partículas).",
  ],
  line: [
    "Simulador LINE",
    "Roleplay da vida real em Tóquio e Kyoto com alternância de Keigo e Tameguchi.",
  ],
  pitch: [
    "Pitch Accent de Tóquio",
    "Grave sua voz e compare a modulação sonora com a entonação de um nativo.",
  ],
  errors: [
    "Diário de Bordo",
    "Memória persistente de erros e orientações cirúrgicas do Sensei Hiroshi.",
  ],
  learn: [
    "Biblioteca & Kana",
    "Matriz dos 46 caracteres, lousa de caligrafia digital e vocabulário.",
  ],
  review: [
    "Repetição Espaçada",
    "Fixe termos e expressões no momento exato da curva de esquecimento.",
  ],
  jlpt: [
    "Minha Trilha JLPT",
    "Currículo estruturado do N5 ao N1 para conquistas sólidas.",
  ],
  settings: [
    "Preferências & Metas",
    "Configure seu tempo diário, backups e integrações.",
  ],
};

export default function Shell({
  view,
  state,
  navigate,
  shared,
  message,
  install,
  installPrompt,
}) {
  const [streakOpen, setStreakOpen] = useState(false);
  const [speedQuizOpen, setSpeedQuizOpen] = useState(false);
  const [studySessionOpen, setStudySessionOpen] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(15);
  const [onboardingOpen, setOnboardingOpen] = useState(() => {
    try {
      if (typeof window !== "undefined" && localStorage.getItem("kotonoha_onboarding_done") === "true") {
        return false;
      }
    } catch {}
    return !state.onboardingCompleted;
  });

  const due = Object.values(state.cards).filter(
    (card) =>
      card.seen &&
      card.due <= Date.now() &&
      cardMatchesLevel(card, state.selectedLevel),
  ).length;

  const item = NAVIGATION.find((item) => item.id === view);
  const [title, description] = PAGES[view] || PAGES.home;
  const settings = { id: "settings", label: "Preferências", icon: "settings" };
  const xp = (state.stats?.reviews || 0) * 15 + (state.streak?.days || 1) * 30;

  return (
    <>
      <div
        className="flex flex-col lg:flex-row min-h-screen bg-white text-[#4b4b4b] w-full"
        onClick={navigate}
      >
        <a
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:border-2 focus:border-[#58cc02] focus:rounded-2xl focus:text-[#3c3c3c] font-black"
          href="#main-content"
        >
          Pular para o conteúdo
        </a>

        {/* Sidebar Desktop Duolingo */}
        <aside
          className="hidden lg:flex flex-col justify-between w-64 xl:w-72 shrink-0 bg-white border-r-2 border-[#e5e5e5] p-6 select-none sticky top-0 h-screen z-30"
          aria-label="Navegação principal"
        >
          <div className="space-y-6">
            <Brand />
            <nav className="flex flex-col gap-2" aria-label="Áreas de estudo">
              {NAVIGATION.map((item) => (
                <NavItem
                  key={item.id}
                  item={item}
                  active={
                    view === item.id ||
                    (item.id === "practice" &&
                      ["syntax", "line", "pitch", "errors"].includes(view))
                  }
                  count={item.id === "review" ? due : 0}
                  onClick={() => shared.go(item.id)}
                />
              ))}
            </nav>
          </div>

          <div className="pt-4 border-t-2 border-line mt-auto space-y-2">
            <button
              type="button"
              onClick={() => setOnboardingOpen(true)}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-black uppercase text-purple-ink bg-purple-soft border-2 border-b-4 border-purple/40 hover:bg-purple-soft/80 cursor-pointer transition-all active:translate-y-px"
            >
              <Icon name="academic" className="w-4 h-4 text-purple-ink" />
              <span>Meu Plano de Estudo</span>
            </button>
            <NavItem
              item={settings}
              active={view === "settings"}
              onClick={() => shared.go("settings")}
            />
          </div>
        </aside>

        {/* Área Principal */}
        <div className="flex-1 flex flex-col min-w-0 w-full min-h-screen bg-paper">
          {/* Topbar Gamificada estilo Duolingo */}
          <header className="sticky top-0 z-20 w-full min-h-16 border-b-2 border-line bg-paper/95 backdrop-blur-xs px-6 sm:px-8 lg:px-10 py-3 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <Brand compact />
              <div className="hidden lg:flex items-center gap-2 type-caption text-muted">
                <span>Kotonoha</span>
                <span>/</span>
                <strong className="text-ink-strong">
                  {title}
                </strong>
              </div>
            </div>

            {/* Status Bars Duolingo: Nível, Sequência de Fogo, Cristais XP */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Seletor de Nível com Bandeira do Japão e cor neutra */}
              <label className="flex items-center gap-2 px-3 py-1.5 rounded-2xl border-2 border-b-4 border-line bg-paper text-xs font-black text-ink-strong select-none cursor-pointer hover:border-edge active:border-b-2 active:translate-y-[2px] transition-all">
                <Icon name="jpFlag" className="w-4 h-4 shrink-0" />
                <select
                  className="border-0 bg-transparent text-xs font-black text-ink-strong cursor-pointer focus:outline-none"
                  aria-label="Filtrar por nível JLPT"
                  value={state.selectedLevel}
                  onChange={(event) => shared.changeLevel(event.target.value)}
                >
                  {LEVELS.map(([level, label]) => (
                    <option key={level} value={level}>
                      {level} · {label}
                    </option>
                  ))}
                </select>
              </label>

              {/* Botão de Ofensiva / Streak Duolingo */}
              <button
                type="button"
                onClick={() => setStreakOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border-2 border-b-4 border-flame/40 bg-flame-soft/60 text-flame font-black text-xs hover:scale-105 active:border-b-2 active:translate-y-[2px] transition-all cursor-pointer"
                title="Sua ofensiva de estudo diário"
              >
                <Icon name="flame" className="w-4 h-4 text-flame" />
                <span className="tabular-nums font-black text-sm">{state.streak?.days || 1}</span>
              </button>

              {/* Cristais / XP */}
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border-2 border-b-4 border-blue/40 bg-blue-soft/60 text-blue font-black text-xs select-none"
                title="Seus pontos de experiência acumulados"
              >
                <Icon name="gem" className="w-4 h-4 text-blue" />
                <span className="tabular-nums font-black text-sm">{xp} XP</span>
              </div>

              {installPrompt && (
                <button
                  className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl border-2 border-line bg-paper text-xs font-extrabold text-ink-strong hover:bg-raised cursor-pointer transition-colors"
                  onClick={install}
                >
                  <Icon name="download" />
                  Instalar
                </button>
              )}
            </div>
          </header>

          {/* Conteúdo Principal */}
          <main
            id="main-content"
            tabIndex={-1}
            className="flex-1 w-full px-6 sm:px-8 lg:px-10 py-6 sm:py-8 pb-24 lg:pb-8 min-w-0"
          >
            <section
              className="w-full min-w-0 space-y-6"
              id={`view-${view}`}
              aria-labelledby={`${view}Title`}
            >

              {view === "home" && (
                <Home
                  {...shared}
                  openSpeedQuiz={() => setSpeedQuizOpen(true)}
                  openStudySession={(dur) => {
                    setSessionDuration(dur || 15);
                    setStudySessionOpen(true);
                  }}
                  openOnboarding={() => setOnboardingOpen(true)}
                />
              )}
              {view === "practice" && (
                <PracticeHub
                  state={state}
                  go={shared.go}
                  changeLevel={shared.changeLevel}
                />
              )}
              {view === "syntax" && <SyntaxLab {...shared} />}
              {view === "line" && <LineSimulator {...shared} />}
              {view === "pitch" && <PitchAccentLab {...shared} />}
              {view === "errors" && <ErrorMemory state={state} update={shared.update} toast={shared.toast} speak={shared.speak} go={shared.go} />}
              {view === "learn" && <Learn {...shared} />}
              {view === "review" && <Review {...shared} />}
              {view === "jlpt" && <Jlpt {...shared} />}
              {view === "settings" && <Settings {...shared} onOpenOnboarding={() => setOnboardingOpen(true)} />}

              <footer className="pt-8 pb-6 border-t-2 border-line flex flex-wrap items-center justify-between gap-4 type-body-sm text-muted">
                <div className="flex items-center gap-2">
                  <span className="font-jp text-sm font-black text-ink-strong">
                    ことのは
                  </span>
                  <span>· Aprendizado intuitivo com o Sensei Hiroshi</span>
                </div>
                <button
                  type="button"
                  onClick={() => setOnboardingOpen(true)}
                  className="text-blue hover:underline cursor-pointer font-extrabold"
                >
                  Refazer pré-cadastro de metas
                </button>
              </footer>
            </section>
          </main>
        </div>

        {/* Navegação Inferior Mobile */}
        <nav
          className="lg:hidden fixed bottom-0 inset-x-0 min-h-16 pb-[env(safe-area-inset-bottom)] border-t-2 border-line bg-paper px-2 grid grid-cols-4 z-30 select-none shadow-xs"
          aria-label="Navegação móvel"
        >
          {NAVIGATION.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              active={
                view === item.id ||
                (item.id === "practice" &&
                  ["syntax", "line", "pitch", "errors"].includes(view))
              }
              count={item.id === "review" ? due : 0}
              mobile
              onClick={() => shared.go(item.id)}
            />
          ))}
        </nav>
      </div>

      {/* Modal de Pré-Cadastro / Onboarding */}
      {onboardingOpen && (
        <OnboardingModal
          state={state}
          update={shared.update}
          onClose={() => {
            setOnboardingOpen(false);
            try {
              localStorage.setItem("kotonoha_onboarding_done", "true");
            } catch {}
            shared.update((s) => {
              s.onboardingCompleted = true;
            });
          }}
          onComplete={() => {
            setOnboardingOpen(false);
            try {
              localStorage.setItem("kotonoha_onboarding_done", "true");
            } catch {}
            shared.update((s) => {
              s.onboardingCompleted = true;
            });
            shared.toast("Plano de estudos atualizado com sucesso!");
          }}
        />
      )}

      {studySessionOpen && (
        <StudySession
          state={state}
          update={shared.update}
          initialDuration={sessionDuration}
          speak={shared.speak}
          toast={shared.toast}
          onClose={() => setStudySessionOpen(false)}
          onNavigateToNotebook={() => {
            setStudySessionOpen(false);
            shared.go("errors");
          }}
        />
      )}

      {streakOpen && (
        <StreakPopover state={state} onClose={() => setStreakOpen(false)} />
      )}

      {speedQuizOpen && (
        <SpeedQuiz
          state={state}
          update={shared.update}
          onClose={() => setSpeedQuizOpen(false)}
        />
      )}

      {/* Toast Duolingo */}
      <div
        id="toast"
        className={`fixed bottom-20 md:bottom-6 right-6 z-50 max-w-sm px-5 py-3.5 rounded-2xl border-2 border-primary bg-paper text-ink-strong type-h3 shadow-lg transition-all ${
          message
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2 pointer-events-none"
        }`}
        role="status"
        aria-live="polite"
      >
        {message}
      </div>
    </>
  );
}

