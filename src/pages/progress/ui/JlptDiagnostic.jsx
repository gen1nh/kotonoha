import React, { useState } from "react";
import Icon from "../../../shared/ui/Icon.jsx";
import {
  Button,
  Card,
  ProgressBar,
  Segmented,
  Stat,
} from "../../../shared/ui/index.jsx";
import {
  JLPT_BENCHMARKS,
  formatPercent,
  hoursProgress,
  skillMeters,
  todayStudySeconds,
  activeDaysIn,
  totalStudySeconds,
} from "../../../entities/study/index.js";
import { formatDuration } from "../../../entities/study/index.js";
import { levelInsights } from "../../../entities/study/index.js";

const MINUTE_OPTIONS = [5, 15, 30, 45, 60].map((m) => ({
  value: m,
  label: `${m} min`,
}));

function meterTone(value) {
  if (value === null) return null;
  if (value >= 70) return "success";
  if (value >= 40) return "warn";
  return "neutral";
}

/** Tempo e progresso REAIS: só o que o cronômetro e as atividades registraram. */
export default function JlptDiagnostic({ state, update, toast }) {
  const level = state.selectedLevel || "N5";
  const bench = JLPT_BENCHMARKS[level];
  const [dailyMinutes, setDailyMinutes] = useState(
    state.jlptGoals?.minutesPerDay || 15,
  );

  const mastery = levelInsights(state, level);
  const hours = hoursProgress(state, level);
  const meters = skillMeters(state, level);
  const total = totalStudySeconds(state);
  const today = todayStudySeconds(state);
  const activeDays = activeDaysIn(state, 7);

  // Previsão só existe com ritmo real; senão não inventamos número.
  const forecastDays =
    total >= 600 ? Math.ceil((hours.remainingHours * 60) / dailyMinutes) : null;

  const saveGoal = () => {
    update((s) => {
      s.jlptGoals = {
        ...(s.jlptGoals || {}),
        targetLevel: level,
        minutesPerDay: dailyMinutes,
      };
    });
    toast?.("Referência de tempo salva. A meta de atividades não foi alterada.");
  };

  return (
    <Card aria-labelledby="diag-title" className="mb-6 space-y-6">
      <header>
        <h2 id="diag-title" className="mt-2 text-2xl font-bold text-ink">
          Quanto você já estudou
        </h2>
        <p className="mt-1 text-sm text-muted">
          Esta análise de tempo é complementar à meta diária de atividades. O tempo só conta enquanto você usa o app com a tela aberta e ativa
          (cliques, toques ou digitação). Abrir a página e deixar parada não
          soma.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full min-w-0">
        <Stat
          label="Hoje"
          value={today > 0 ? formatDuration(today) : "0 min"}
          note={`${activeDays} de 7 dias com estudo`}
        />
        <Stat
          label="Total no Kotonoha"
          value={total > 0 ? formatDuration(total) : "0 min"}
          note="Tempo ativo cronometrado"
        />
        <Stat
          label={`Meta de referência ${level}`}
          value={formatPercent(hours.percent)}
          note={`${formatDuration(hours.seconds)} de ${bench.hoursMin} h`}
        />
      </div>

      <div>
        <ProgressBar
          value={hours.percent}
          label={`Horas estudadas em relação à referência do ${level}`}
        />
        <p className="mt-2 text-sm text-muted">
          Cálculo: tempo ativo ÷ {bench.hoursMin} h. Referências de{" "}
          {bench.hoursMin}–{bench.hoursMax} h para o {level} são estimativas
          comuns para quem parte do zero — variam por pessoa e não são oficiais.
          Por isso o avanço de poucos minutos aparece como “
          {formatPercent(0.05)}”.
        </p>
      </div>

      <section aria-labelledby="mastery-title" className="rounded-xl border border-line bg-paper p-4 space-y-3">
        <h3 id="mastery-title" className="text-lg font-bold text-ink">Retenção estimada pelos flashcards</h3>
        <p className="text-sm text-muted">Baseada nas suas autoavaliações e intervalos de revisão; não equivale a uma nota ou certificação JLPT.</p>
        <ProgressBar value={mastery.stabilityPercent || 0} label="Cartões com revisão estável" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm" aria-label="Situação dos cartões">
          <div><strong className="block text-ink">{mastery.stable}</strong><span className="text-muted">Estáveis</span></div>
          <div><strong className="block text-ink">{mastery.learning}</strong><span className="text-muted">Aprendendo</span></div>
          <div><strong className="block text-ink">{mastery.retry}</strong><span className="text-muted">Precisam reforço</span></div>
          <div><strong className="block text-ink">{mastery.new}</strong><span className="text-muted">Não iniciados</span></div>
        </div>
        <p className="text-xs text-muted">{mastery.due} revisões pendentes neste nível.</p>
      </section>

      <section aria-labelledby="meters-title">
        <h3 id="meters-title" className="text-lg font-bold text-ink">
          Sua atividade em {level}
        </h3>
        <p className="text-sm text-muted">
          Medido por cartões vistos, lições concluídas e respostas reais.
        </p>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2">
          {meters.map((meter) => (
            <li
              key={meter.id}
              className="rounded-md border border-line bg-paper p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <strong className="text-sm text-ink">{meter.label}</strong>
                {meter.value === null ? (
                  <span className="text-xs font-bold text-muted">Sem dados ainda</span>
                ) : (
                  <span className="text-xs font-black text-primary-strong tabular-nums">{meter.value}%</span>
                )}
              </div>
              <ProgressBar
                className="mt-2"
                value={meter.value}
                label={meter.label}
              />
              <p className="mt-2 text-xs text-muted">{meter.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      <section
        aria-labelledby="goal-title"
        className="rounded-md border border-line bg-paper p-4"
      >
        <h3 id="goal-title" className="text-lg font-bold text-ink">
          Referência pessoal de tempo
        </h3>
        <Segmented
          className="mt-2"
          label="Minutos usados na projeção"
          options={MINUTE_OPTIONS}
          value={dailyMinutes}
          onChange={setDailyMinutes}
        />
        <p className="mt-3 text-sm text-muted" aria-live="polite">
          {forecastDays === null
            ? "Acumule 10 minutos de estudo ativo para calcular a projeção. Isso não mede prontidão para a prova."
            : `Mantendo ${dailyMinutes} min por dia, a referência de ${bench.hoursMin} h do ${level} leva cerca de ${forecastDays.toLocaleString("pt-BR")} dias. Referência opcional de tempo, sem previsão de aprovação.`}
        </p>
        <Button variant="primary" className="mt-3" onClick={saveGoal}>
          <Icon name="check" /> Salvar referência
        </Button>
      </section>
    </Card>
  );
}
