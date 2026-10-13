import { useDialogFocus } from "../useDialogFocus.js";
import React, { useEffect, useRef } from "react";
import Icon from "./Icon.jsx";
import { todayKey } from "../state.js";

export default function StreakPopover({ state, onClose }) {
  useDialogFocus(onClose);
  const modalRef = useRef(null);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const days = state.streak?.days || 0;
  const today = new Date();

  // Gera os últimos 7 dias
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (6 - i));
    const key = todayKey(d);
    const dayName = new Intl.DateTimeFormat("pt-BR", { weekday: "short" })
      .format(d)
      .slice(0, 3)
      .toUpperCase();
    const isToday = key === todayKey();

    // Verifica atividade no dia: resposta diária, prática no papel ou revisão
    const hasDaily = Object.keys(state.dailyAnswers || {}).some((k) =>
      k.startsWith(key),
    );
    const hasStudy = Boolean((state.studyLog?.[key] || 0) >= 60);
    const hasPaper = Boolean(state.paper?.[key]);
    const isCompleted =
      hasDaily || hasStudy || hasPaper || (isToday && days > 0);

    return {
      date: d.getDate(),
      dayName,
      key,
      isToday,
      isCompleted,
    };
  });

  // Mensagem e nível da chama
  const streakLevel =
    days === 0
      ? {
          title: "Brasa Adormecida",
          text: "Faça uma prática hoje para acender sua chama!",
          class: "level-dormant",
        }
      : days < 7
        ? {
            title: "Chama Jovem",
            text: "Você está no caminho! Complete 7 dias para desbloquear o fogo dourado.",
            class: "level-young",
          }
        : days < 30
          ? {
              title: "Fogo Vivo Dourado",
              text: "Mais de uma semana de disciplina constante. Incrível!",
              class: "level-blazing",
            }
          : {
              title: "Chama Lendária (Mestre)",
              text: "Consistência de elite. Seu japonês está se enraizando a cada dia.",
              class: "level-legend",
            };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="streak-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-md min-w-0 bg-surface border border-line rounded-2xl p-6 sm:p-8 relative space-y-6 select-none"
        ref={modalRef}
      >
        <button
          className="absolute top-4 right-4 p-2 rounded-lg text-muted hover:text-ink hover:bg-paper cursor-pointer transition-colors"
          onClick={onClose}
          aria-label="Fechar janela"
        >
          <Icon name="close" />
        </button>

        <div className="flex flex-col items-center text-center p-6 rounded-xl border border-line bg-paper space-y-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-flame-soft text-flame border border-flame/30 text-3xl">
            <Icon name="flame" />
          </div>
          <div className="text-5xl font-extrabold tracking-tight text-ink">
            {days}
          </div>
          <div className="text-xs font-semibold text-muted uppercase tracking-wider">
            {days === 1 ? "dia seguido" : "dias seguidos"}
          </div>
          <div className="text-xs font-black text-[#ff9600] uppercase tracking-wider">
            {streakLevel.title}
          </div>
        </div>

        <p className="text-sm text-center text-muted leading-relaxed">
          {streakLevel.text}
        </p>

        <div className="space-y-3 pt-4 border-t border-line">
          <h3 className="text-xs font-bold text-muted uppercase tracking-wider text-center">
            Últimos 7 dias
          </h3>
          <div className="grid grid-cols-7 gap-2">
            {last7Days.map((d) => (
              <div
                key={d.key}
                className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border ${
                  d.isToday ? "border-edge bg-paper" : "border-line bg-surface"
                }`}
              >
                <span className="text-[10px] font-bold text-muted">
                  {d.dayName}
                </span>
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ${
                    d.isCompleted
                      ? "bg-flame text-white"
                      : "bg-paper text-muted border border-line"
                  }`}
                >
                  {d.isCompleted ? <Icon name="check" /> : d.date}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center text-xs text-muted pt-2 border-t border-line/60">
          <span lang="ja" className="font-jp font-bold text-ink">
            継続は力なり
          </span>{" "}
          · A persistência é poder.
        </div>
      </div>
    </div>
  );
}
