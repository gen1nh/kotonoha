import React, { useState } from "react";
import Icon from "./Icon.jsx";
import { Button } from "./ui/index.jsx";

const GOALS = [
  {
    id: "travel",
    icon: "plane",
    title: "Viagem & Turismo no Japão",
    desc: "Pedir comida, fazer compras e se locomover com confiança",
  },
  {
    id: "anime",
    icon: "torii",
    title: "Animes, Mangás & Jogos",
    desc: "Compreender falas originais sem depender de legendas",
  },
  {
    id: "career",
    icon: "briefcase",
    title: "Carreira & Oportunidades",
    desc: "Negócios no Japão, bolsas de estudo MEXT e vistos",
  },
  {
    id: "culture",
    icon: "academic",
    title: "Cultura & Filosofia",
    desc: "Caligrafia, história, literatura e etiqueta japonesa",
  },
  {
    id: "brain",
    icon: "brain",
    title: "Desafio Mental & Curiosidade",
    desc: "Expandir o cérebro aprendendo uma língua fascinante",
  },
];

const LEVELS = [
  {
    id: "zero",
    levelCode: "N5",
    icon: "leaf",
    title: "Começando do zero total",
    desc: "Não sei nada ainda, quero aprender desde o primeiro som",
  },
  {
    id: "some_kana",
    levelCode: "N5",
    icon: "learn",
    title: "Sei alguns caracteres",
    desc: "Reconheço partes do Hiragana ou Katakana, mas me confundo",
  },
  {
    id: "basic_n5",
    levelCode: "N5",
    icon: "puzzle",
    title: "Básico (JLPT N5)",
    desc: "Já leio kana e quero dominar frases e gramática básica",
  },
  {
    id: "intermediate",
    levelCode: "N4",
    icon: "trophy",
    title: "Intermediário (N4 ou mais)",
    desc: "Quero destravar a fala e fluência com o Sensei",
  },
];

const DAILY_TIMES = [
  { minutes: 10, label: "Focado", desc: "10 min / dia (Rápido & Constante)", icon: "sparkles" },
  { minutes: 15, label: "Regular", desc: "15 min / dia (Recomendado)", icon: "bolt" },
  { minutes: 20, label: "Dedicado", desc: "20 min / dia (Progresso Sólido)", icon: "flame" },
  { minutes: 30, label: "Intenso", desc: "30 min / dia (Aceleração)", icon: "academic" },
  { minutes: 45, label: "Imersão", desc: "45 min / dia (Pré-Exame JLPT)", icon: "trophy" },
  { minutes: 60, label: "Maratona", desc: "60 min / dia (Fluência Máxima)", icon: "sparkles" },
];

const STYLES = [
  {
    id: "chat",
    icon: "chat",
    title: "Conversação com Sensei Hiroshi",
    desc: "Diálogos dinâmicos que simulam conversas reais",
  },
  {
    id: "trail",
    icon: "academic",
    title: "Trilha guiada passo a passo",
    desc: "Lições organizadas com gramática e contrastes sintáticos",
  },
  {
    id: "writing",
    icon: "paper",
    title: "Lousa e treino de escrita",
    desc: "Fixar caracteres através da caligrafia e memória motora",
  },
];

export default function OnboardingModal({ state, update, onClose, onComplete }) {
  const [step, setStep] = useState(1);
  const [selectedGoal, setSelectedGoal] = useState("travel");
  const [selectedLevel, setSelectedLevel] = useState("zero");
  const [selectedMinutes, setSelectedMinutes] = useState(15);
  const [selectedStyle, setSelectedStyle] = useState("trail");

  const totalSteps = 4;
  const progressPct = (step / totalSteps) * 100;

  const handleFinish = () => {
    const levelObj = LEVELS.find((l) => l.id === selectedLevel);
    try {
      localStorage.setItem("kotonoha_onboarding_done", "true");
    } catch {}
    update((s) => {
      s.onboardingCompleted = true;
      s.selectedLevel = levelObj?.levelCode || "N5";
      s.userProfile = {
        goal: selectedGoal,
        level: selectedLevel,
        dailyMinutes: selectedMinutes,
        style: selectedStyle,
        createdAt: Date.now(),
      };
    });
    if (onComplete) onComplete();
    if (onClose) onClose();
  };

  const handleDismiss = () => {
    try {
      localStorage.setItem("kotonoha_onboarding_done", "true");
    } catch {}
    update((s) => {
      s.onboardingCompleted = true;
    });
    if (onClose) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      <div className="w-full max-w-lg min-w-0 bg-white border-2 border-[#e5e5e5] rounded-3xl p-6 sm:p-8 relative space-y-6 max-h-[92vh] overflow-y-auto select-none">
        {/* Barra de Progresso Duolingo com botão voltar e fechar */}
        <div className="flex items-center gap-3">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="p-2 rounded-xl text-[#777777] hover:text-[#4b4b4b] hover:bg-[#f7f7f7] cursor-pointer transition-colors"
              title="Voltar"
            >
              <Icon name="arrow" className="rotate-180" />
            </button>
          )}

          <div className="flex-1 h-3.5 rounded-full bg-[#e5e5e5] p-0.5 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#58cc02] transition-all duration-300 relative"
              style={{ width: `${progressPct}%` }}
            >
              <div className="absolute top-0.5 inset-x-2 h-1 bg-white/40 rounded-full" />
            </div>
          </div>

          <span className="text-xs font-black text-[#777777]">
            {step}/{totalSteps}
          </span>

          <button
            type="button"
            onClick={handleDismiss}
            className="p-2 rounded-xl text-[#777777] hover:text-[#3c3c3c] hover:bg-[#f7f7f7] cursor-pointer transition-colors"
            title="Fechar e não mostrar novamente"
            aria-label="Fechar"
          >
            <Icon name="close" />
          </button>
        </div>

        {/* Apresentação do Sensei Hiroshi */}
        <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#f5e6ff] border-2 border-[#ce82ff]/30">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#ce82ff] text-white shadow-xs">
            <Icon name="academic" className="w-6 h-6 text-white" />
          </div>
          <div className="min-w-0">
            <strong className="text-sm font-extrabold text-[#892bd4] block">
              Sensei Hiroshi · 35 anos de ensino
            </strong>
            <p className="text-xs text-[#777777] leading-tight mt-0.5">
              "Vamos preparar seu plano personalizado para você não travar no japonês."
            </p>
          </div>
        </div>

        {/* PASSO 1: OBJETIVO */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h2 id="onboarding-title" className="text-xl sm:text-2xl font-black text-[#3c3c3c]">
                Por que você quer aprender japonês?
              </h2>
              <p className="text-xs text-[#777777] mt-1">
                Isso nos ajuda a escolher os exemplos mais relevantes para você.
              </p>
            </div>

            <div className="space-y-2.5">
              {GOALS.map((g) => {
                const isSelected = selectedGoal === g.id;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setSelectedGoal(g.id)}
                    className={`w-full flex items-center gap-3.5 p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-[#58cc02] bg-[#d7ffb8]/30 border-b-4 border-b-[#58a700]"
                        : "border-[#e5e5e5] bg-white hover:bg-[#f7f7f7] border-b-4"
                    }`}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f7f7f7] text-[#58cc02]">
                      <Icon name={g.icon} className="w-5 h-5 text-[#58cc02]" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <strong className="text-sm font-extrabold text-[#3c3c3c] block">
                        {g.title}
                      </strong>
                      <span className="text-xs text-[#777777] block mt-0.5">
                        {g.desc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => setStep(2)}
            >
              Continuar →
            </Button>

            <button
              type="button"
              onClick={handleDismiss}
              className="w-full text-center text-xs font-bold text-[#777777] hover:text-[#3c3c3c] cursor-pointer pt-1"
            >
              Pular pré-cadastro por enquanto
            </button>
          </div>
        )}

        {/* PASSO 2: NÍVEL ATUAL */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#3c3c3c]">
                Quanto japonês você já sabe?
              </h2>
              <p className="text-xs text-[#777777] mt-1">
                Vamos colocar você exatamente no ponto certo, sem tédio e sem frustração.
              </p>
            </div>

            <div className="space-y-2.5">
              {LEVELS.map((lvl) => {
                const isSelected = selectedLevel === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setSelectedLevel(lvl.id)}
                    className={`w-full flex items-center gap-3.5 p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-[#1cb0f6] bg-[#ddf4ff]/40 border-b-4 border-b-[#1899d6]"
                        : "border-[#e5e5e5] bg-white hover:bg-[#f7f7f7] border-b-4"
                    }`}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f7f7f7] text-[#1cb0f6]">
                      <Icon name={lvl.icon} className="w-5 h-5 text-[#1cb0f6]" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <strong className="text-sm font-extrabold text-[#3c3c3c] block">
                        {lvl.title}
                      </strong>
                      <span className="text-xs text-[#777777] block mt-0.5">
                        {lvl.desc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <Button
              variant="blue"
              size="lg"
              className="w-full"
              onClick={() => setStep(3)}
            >
              Continuar →
            </Button>
          </div>
        )}

        {/* PASSO 3: META DIÁRIA */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#3c3c3c]">
                Qual é a sua meta diária de estudo?
              </h2>
              <p className="text-xs text-[#777777] mt-1">
                Constância diária vale 10x mais do que maratonas cansativas de fim de semana.
              </p>
            </div>

            <div className="space-y-2.5">
              {DAILY_TIMES.map((dt) => {
                const isSelected = selectedMinutes === dt.minutes;
                return (
                  <button
                    key={dt.minutes}
                    type="button"
                    onClick={() => setSelectedMinutes(dt.minutes)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-[#ff9600] bg-[#ffebd1]/40 border-b-4 border-b-[#e68600]"
                        : "border-[#e5e5e5] bg-white hover:bg-[#f7f7f7] border-b-4"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f7f7f7] text-[#ff9600]">
                        <Icon name={dt.icon} className="w-5 h-5 text-[#ff9600]" />
                      </span>
                      <div>
                        <strong className="text-sm font-extrabold text-[#3c3c3c] block">
                          {dt.label}
                        </strong>
                        <span className="text-xs text-[#777777] block mt-0.5">
                          {dt.desc}
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="text-[#ff9600] text-lg font-black">✓</span>
                    )}
                  </button>
                );
              })}
            </div>

            <Button
              variant="flame"
              size="lg"
              className="w-full"
              onClick={() => setStep(4)}
            >
              Continuar →
            </Button>
          </div>
        )}

        {/* PASSO 4: ESTILO DE APRENDIZADO */}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#3c3c3c]">
                Como você prefere aprender?
              </h2>
              <p className="text-xs text-[#777777] mt-1">
                Você pode alternar entre as ferramentas a qualquer momento.
              </p>
            </div>

            <div className="space-y-2.5">
              {STYLES.map((st) => {
                const isSelected = selectedStyle === st.id;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setSelectedStyle(st.id)}
                    className={`w-full flex items-center gap-3.5 p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-[#ce82ff] bg-[#f5e6ff]/40 border-b-4 border-b-[#b963ff]"
                        : "border-[#e5e5e5] bg-white hover:bg-[#f7f7f7] border-b-4"
                    }`}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f7f7f7] text-[#892bd4]">
                      <Icon name={st.icon} className="w-5 h-5 text-[#892bd4]" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <strong className="text-sm font-extrabold text-[#3c3c3c] block">
                        {st.title}
                      </strong>
                      <span className="text-xs text-[#777777] block mt-0.5">
                        {st.desc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full flex items-center justify-center gap-2"
              onClick={handleFinish}
            >
              <Icon name="sparkles" className="w-5 h-5 text-white" />
              <span>Começar Meu Japonês!</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
