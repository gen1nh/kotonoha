import { lessonsFor, isDone } from "./learning.js";
import { todayKey } from "./state.js";

/**
 * Horas de referência (acumuladas, a partir do zero) para falantes de línguas
 * sem kanji. São estimativas comuns de estudo — variam muito de pessoa para
 * pessoa e NÃO são um programa oficial do exame.
 */
export const JLPT_BENCHMARKS = {
  N5: { hoursMin: 350, hoursMax: 400, kanji: 103, vocab: 800 },
  N4: { hoursMin: 550, hoursMax: 750, kanji: 300, vocab: 1500 },
  N3: { hoursMin: 950, hoursMax: 1200, kanji: 650, vocab: 3750 },
  N2: { hoursMin: 1600, hoursMax: 2200, kanji: 1000, vocab: 6000 },
  N1: { hoursMin: 3000, hoursMax: 4000, kanji: 2000, vocab: 10000 },
};

/** Teto defensivo por dia: ninguém estuda mais que 12 h ativas em 1 dia. */
export const MAX_SECONDS_PER_DAY = 12 * 3600;

export function addStudySeconds(state, seconds, day = todayKey()) {
  if (!Number.isFinite(seconds) || seconds <= 0) return;
  state.studyLog ||= {};
  const next = (state.studyLog[day] || 0) + Math.floor(seconds);
  state.studyLog[day] = Math.min(next, MAX_SECONDS_PER_DAY);
}

export function totalStudySeconds(state) {
  return Object.values(state.studyLog || {}).reduce(
    (sum, value) => sum + (Number.isFinite(value) ? value : 0),
    0,
  );
}

export function todayStudySeconds(state) {
  return state.studyLog?.[todayKey()] || 0;
}

/** Quantos dos últimos `days` dias tiveram pelo menos `minSeconds` de estudo. */
export function activeDaysIn(state, days = 7, minSeconds = 60) {
  let count = 0;
  const date = new Date();
  for (let i = 0; i < days; i++) {
    const key = todayKey(date);
    if ((state.studyLog?.[key] || 0) >= minSeconds) count++;
    date.setDate(date.getDate() - 1);
  }
  return count;
}

/** Progresso do tempo estudado em relação à meta de horas do nível. */
export function hoursProgress(state, level = "N5") {
  const bench = JLPT_BENCHMARKS[level];
  const seconds = totalStudySeconds(state);
  const hours = seconds / 3600;
  const percent = Math.min(100, (hours / bench.hoursMin) * 100);
  return {
    seconds,
    hours,
    goalHours: bench.hoursMin,
    goalHoursMax: bench.hoursMax,
    percent,
    remainingHours: Math.max(0, bench.hoursMin - hours),
  };
}

export function formatPercent(value) {
  if (value <= 0) return "0%";
  if (value < 0.1) return "<0,1%";
  if (value < 10) return `${value.toFixed(1).replace(".", ",")}%`;
  return `${Math.round(value)}%`;
}

/**
 * Habilidades medidas apenas por atividade registrada.
 * `value` é null quando ainda não há dados — a UI mostra "sem dados".
 */
export function skillMeters(state, level = "N5") {
  const cards = Object.values(state.cards || {});
  const kana = cards.filter(
    (c) => c.type === "Hiragana" || c.type === "Katakana",
  );
  const kanaSolid = kana.filter((c) => c.seen && c.interval >= 3).length;
  const vocab = cards.filter((c) => c.type === `Vocabulário ${level}`);
  const vocabSeen = vocab.filter((c) => c.seen).length;
  const lessons = lessonsFor(level) || [];
  const lessonsDone = lessons.filter((l) => isDone(state, level, l)).length;
  const reviews = state.stats?.reviews || 0;
  const correct = state.stats?.correct || 0;
  const days = activeDaysIn(state, 7);

  const ratio = (a, b) => (b > 0 ? Math.round((a / b) * 100) : null);
  return [
    {
      id: "kana",
      label: "Kana",
      value: ratio(kanaSolid, kana.length),
      detail: `${kanaSolid} de ${kana.length} caracteres firmes`,
    },
    {
      id: "vocab",
      label: "Vocabulário",
      value: ratio(vocabSeen, vocab.length),
      detail: `${vocabSeen} de ${vocab.length} palavras vistas em ${level}`,
    },
    {
      id: "lessons",
      label: "Lições",
      value: ratio(lessonsDone, lessons.length),
      detail: `${lessonsDone} de ${lessons.length} concluídas em ${level}`,
    },
    {
      id: "accuracy",
      label: "Acertos nas revisões",
      value: reviews > 0 ? Math.round((correct / reviews) * 100) : null,
      detail: reviews
        ? `${correct} acertos em ${reviews} respostas`
        : "Responda uma revisão para medir",
    },
    {
      id: "habit",
      label: "Constância (7 dias)",
      value: Math.round((days / 7) * 100),
      detail: `${days} de 7 dias com estudo`,
    },
  ];
}
