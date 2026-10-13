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

export const DEFAULT_KANBAN_ITEMS = [
  {
    id: "k1",
    title: "Pedir comida no restaurante japonês",
    tag: "Prática",
    level: "N5",
    notes: "Frases com ください e お願いします",
    status: "want_to_learn",
  },
  {
    id: "k2",
    title: "Horários e dias da semana",
    tag: "Vocabulário",
    level: "N5",
    notes: "何時ですか, 月曜日, 火曜日...",
    status: "want_to_learn",
  },
  {
    id: "k3",
    title: "Partículas は vs が na prática",
    tag: "Gramática",
    level: "N5",
    notes: "は define o tópico geral, が especifica o sujeito focal",
    status: "studying",
  },
  {
    id: "k4",
    title: "Verbos em ます e ました (Presente e Passado)",
    tag: "Verbos",
    level: "N5",
    notes: "食べます / 食べました / 飲みます",
    status: "studying",
  },
  {
    id: "k5",
    title: "Contadores essenciais (つ e 本)",
    tag: "Contadores",
    level: "N5",
    notes: "ひとつ, ふたつ, みっつ, いっぽん, にほん...",
    status: "need_practice",
  },
  {
    id: "k6",
    title: "Leitura dos 46 Hiraganas",
    tag: "Alfabeto",
    level: "N5",
    notes: "Reconhecimento fluído sem hesitação",
    status: "mastered",
  },
  {
    id: "k7",
    title: "Cumprimentos do dia a dia (Aisatsu)",
    tag: "Expressões",
    level: "N5",
    notes: "おはよう, こんにちは, ありがとうございます",
    status: "mastered",
  },
];

export const DEFAULT_NOTES = [
  {
    id: "n1",
    title: "Diferença sutil: は (wa) vs が (ga)",
    content:
      '### O grande segredo das partículas\n- **は (tópico):** "Falando sobre X..." (coloca os holofotes no assunto geral).\n- **が (sujeito foco):** responde "quem/o quê fez isso?" com precisão.\n\n*Exemplos práticos:*\n- 私は学生です。(Quanto a mim, sou estudante).\n- 誰が来ましたか？ (Quem foi que veio?)\n- 私が来ました。(Fui EU quem veio).',
    tags: ["Gramática", "Partículas", "N5"],
    updatedAt: Date.now() - 86400000,
  },
  {
    id: "n2",
    title: "Meu Diário: Primeira semana de Japonês",
    content:
      "### 3 frases simples sobre meu dia\n1. 今日は晴れです。(Hoje o tempo está ensolarado).\n2. 日本語を勉強します。(Estudo japonês com calma).\n3. 毎日一歩ずつ頑張ります！ (Todo dia, um passo de cada vez!).",
    tags: ["Diário", "Produção"],
    updatedAt: Date.now() - 3600000,
  },
];

export const DEFAULT_JLPT_GOALS = {
  targetLevel: "N5",
  minutesPerDay: 15,
};

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
    speedRecords: { highScore: 0, bestCombo: 0, totalGames: 0 },
    notebook: {
      notes: structuredClone(DEFAULT_NOTES),
      kanban: DEFAULT_KANBAN_ITEMS.map((item) => ({
        ...item,
        status: "want_to_learn",
      })),
      doubts: [],
    },
    studySession: null,
    studyLog: {},
    jlptGoals: { ...DEFAULT_JLPT_GOALS },
    savedWebResources: [],
    onboardingCompleted: false,
    userProfile: null,
    errorMemory: [],
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
  if (value.speedRecords && typeof value.speedRecords === "object") {
    base.speedRecords = {
      highScore: Number(value.speedRecords.highScore) || 0,
      bestCombo: Number(value.speedRecords.bestCombo) || 0,
      totalGames: Number(value.speedRecords.totalGames) || 0,
    };
  }
  if (value.notebook && typeof value.notebook === "object") {
    base.notebook = {
      notes: Array.isArray(value.notebook.notes)
        ? value.notebook.notes
        : DEFAULT_NOTES,
      kanban: Array.isArray(value.notebook.kanban)
        ? value.notebook.kanban
        : DEFAULT_KANBAN_ITEMS,
      doubts: Array.isArray(value.notebook.doubts) ? value.notebook.doubts : [],
    };
  }
  if (value.studySession && typeof value.studySession === "object") {
    base.studySession = value.studySession;
  }
  if (value.jlptGoals && typeof value.jlptGoals === "object") {
    const { targetLevel, minutesPerDay } = value.jlptGoals;
    base.jlptGoals = {
      ...DEFAULT_JLPT_GOALS,
      ...(JLPT_PATHS[targetLevel] ? { targetLevel } : {}),
      ...(Number.isFinite(minutesPerDay) && minutesPerDay > 0
        ? { minutesPerDay }
        : {}),
    };
  }
  // Apenas segundos reais por dia; minutos "nominais" antigos são descartados.
  base.studyLog = Object.fromEntries(
    Object.entries(value.studyLog || {}).filter(
      ([day, seconds]) =>
        /^\d{4}-\d{2}-\d{2}$/.test(day) &&
        Number.isFinite(seconds) &&
        seconds >= 0 &&
        seconds <= 12 * 3600,
    ),
  );
  if (Array.isArray(value.savedWebResources)) {
    base.savedWebResources = value.savedWebResources;
  }
  if (value.onboardingCompleted !== undefined) {
    base.onboardingCompleted = Boolean(value.onboardingCompleted);
  }
  if (value.userProfile && typeof value.userProfile === "object") {
    base.userProfile = value.userProfile;
  }
  if (Array.isArray(value.errorMemory)) {
    base.errorMemory = value.errorMemory;
  }
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
export function cardMatchesLevel(card, level = "N5") {
  if (level === "N5") {
    return (
      card.type === "Vocabulário N5" ||
      ["Hiragana", "Katakana"].includes(card.type)
    );
  }
  return card.type === `Vocabulário ${level}`;
}
export function selectReview(state, type) {
  const currentLevel = state.selectedLevel || "N5";
  const cards = Object.values(state.cards).filter((card) =>
    type ? card.type === type : cardMatchesLevel(card, currentLevel),
  );
  const due = cards.filter(
    (c) => c.seen && c.due <= Date.now() && (!type || c.type === type),
  );
  if (due.length && !type) return due.map((c) => c.id);

  const group =
    type ||
    (currentLevel === "N5"
      ? ["Hiragana", "Katakana", "Vocabulário N5"].find((t) =>
          cards.some((c) => !c.seen && c.type === t),
        )
      : `Vocabulário ${currentLevel}`);

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
