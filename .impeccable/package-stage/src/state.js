import { HIRAGANA, KATAKANA, VOCAB, JLPT_PATHS } from "./data.js";
import { VOCAB_BY_LEVEL } from "./curriculum.js";

export const KEY = "kotonoha.v1";
export const LEVELS = [
  ["N5", "Iniciante"],
  ["N4", "Básico"],
  ["N3", "Intermediário"],
  ["N2", "Avançado"],
  ["N1", "Proficiente"],
];
export const todayKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export const dateLabel = () =>
  new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })
    .format(new Date())
    .toUpperCase();
export function initialState() {
  const cards = {};
  const add = (id, type, prompt, answer, extra = {}) => {
    cards[id] = {
      id,
      type,
      prompt,
      answer,
      seen: false,
      reps: 0,
      interval: 0,
      ease: 2.5,
      due: 0,
      ...extra,
    };
  };
  HIRAGANA.forEach(([ch, ro]) => add(`hira:${ch}`, "Hiragana", ch, ro));
  KATAKANA.forEach(([ch, ro]) => add(`kata:${ch}`, "Katakana", ch, ro));
  VOCAB.forEach(([ch, kana, ro, meaning]) =>
    add(`vocab:${ch}`, "Vocabulário N5", ch, `${ro} · ${meaning}`, {
      reading: kana,
      spoken: kana,
    }),
  );
  Object.entries(VOCAB_BY_LEVEL).forEach(([level, words]) =>
    words.forEach(([ch, kana, ro, meaning]) =>
      add(
        `vocab:${level}:${ch}`,
        `Vocabulário ${level}`,
        ch,
        `${ro} · ${meaning}`,
        {
          reading: kana,
          spoken: kana,
        },
      ),
    ),
  );
  return {
    cards,
    lessons: {},
    paper: {},
    streak: { last: "", days: 0 },
    stats: { reviews: 0, correct: 0 },
    dailyAnswers: {},
    createdAt: Date.now(),
    mocks: [],
    selectedLevel: "N5",
  };
}
export function normalizeState(value) {
  if (
    !value ||
    typeof value.cards !== "object" ||
    !value.cards ||
    !value.lessons ||
    typeof value.lessons !== "object"
  )
    throw new Error("Esse arquivo não parece ser um backup do Kotonoha.");
  const base = initialState();
  for (const [id, card] of Object.entries(base.cards)) {
    const old = value.cards[id];
    if (!old) continue;
    if (
      typeof old.seen !== "boolean" ||
      !["reps", "interval", "ease", "due"].every(
        (k) => Number.isFinite(old[k]) && old[k] >= 0,
      )
    )
      throw new Error("O backup contém cartões inválidos.");
    base.cards[id] = {
      ...card,
      seen: old.seen,
      reps: old.reps,
      interval: old.interval,
      ease: old.ease,
      due: old.due,
    };
  }
  base.lessons = Object.fromEntries(
    Object.entries(value.lessons).filter(([, v]) => v === true),
  );
  base.paper = Object.fromEntries(
    Object.entries(value.paper || {}).filter(([, v]) => v === true),
  );
  if (
    value.streak &&
    typeof value.streak.last === "string" &&
    Number.isFinite(value.streak.days)
  )
    base.streak = value.streak;
  if (
    value.stats &&
    ["reviews", "correct"].every((k) => Number.isFinite(value.stats[k]))
  )
    base.stats = value.stats;
  base.dailyAnswers = Object.fromEntries(
    Object.entries(value.dailyAnswers || {}).filter(
      ([key, answer]) =>
        /^\d{4}-\d{2}-\d{2}:N[1-5]$/.test(key) &&
        Number.isInteger(answer) &&
        answer >= 0 &&
        answer <= 3,
    ),
  );
  base.selectedLevel = JLPT_PATHS[value.selectedLevel]
    ? value.selectedLevel
    : "N5";
  base.mocks = Array.isArray(value.mocks)
    ? value.mocks.filter(
        (m) =>
          m &&
          JLPT_PATHS[m.level] &&
          Number.isFinite(m.score) &&
          m.score >= 0 &&
          m.score <= 100 &&
          typeof m.date === "string",
      )
    : [];
  base.createdAt = Number.isFinite(value.createdAt)
    ? value.createdAt
    : base.createdAt;
  return base;
}
export function markStudy(state) {
  const today = todayKey();
  if (state.streak.last === today) return;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  state.streak = {
    last: today,
    days: state.streak.last === todayKey(yesterday) ? state.streak.days + 1 : 1,
  };
}
export function selectReview(state, type) {
  const cards = Object.values(state.cards),
    due = cards.filter(
      (c) => c.seen && c.due <= Date.now() && (!type || c.type === type),
    );
  if (due.length && !type) return due.map((c) => c.id);
  const group =
    type ||
    [
      "Hiragana",
      "Katakana",
      `Vocabulário ${state.selectedLevel || "N5"}`,
      "Vocabulário N5",
      "Vocabulário N4",
      "Vocabulário N3",
      "Vocabulário N2",
      "Vocabulário N1",
    ].find((t) => cards.some((c) => !c.seen && c.type === t));
  return [
    ...due,
    ...cards
      .filter((c) => !c.seen && c.type === group)
      .slice(0, group?.startsWith("Vocabulário") ? 4 : 5),
  ].map((c) => c.id);
}
export function rateCard(state, id, rating, now = Date.now()) {
  const card = state.cards[id];
  card.seen = true;
  if (rating === "again") {
    card.reps = 0;
    card.interval = 0.01;
    card.due = now + 600000;
    card.ease = Math.max(1.3, card.ease - 0.2);
  } else {
    if (card.reps === 0)
      card.interval = rating === "hard" ? 1 : rating === "easy" ? 4 : 2;
    else if (card.reps === 1)
      card.interval = rating === "hard" ? 3 : rating === "easy" ? 10 : 6;
    else
      card.interval = Math.max(
        1,
        Math.round(
          card.interval *
            (rating === "hard"
              ? 1.2
              : rating === "easy"
                ? card.ease * 1.3
                : card.ease),
        ),
      );
    if (rating === "hard") card.ease = Math.max(1.3, card.ease - 0.15);
    if (rating === "easy") card.ease += 0.15;
    card.reps++;
    card.due = now + card.interval * 86400000;
    state.stats.correct++;
  }
  state.stats.reviews++;
  markStudy(state);
}
