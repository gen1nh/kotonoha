import {HIRAGANA_EXTENSIONS,KATAKANA_EXTENSIONS} from "../content/n5Kana.js";
import {N5_KANJI} from "../content/n5Kanji.js";
import { HIRAGANA, KATAKANA, VOCAB, JLPT_PATHS } from "./data.js";
import { VOCAB_BY_LEVEL } from "./curriculum.js";
import {unitById,legacyAccessibleIds} from "./courseUnits.js";
import {createPedagogyState, normalizePedagogyState} from "./pedagogy/engine.js";

export const KEY = "kotonoha.v1";
export const SCHEMA_VERSION = 2;
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
  HIRAGANA_EXTENSIONS.forEach(([ch, ro]) => add(`hira:${ch}`, "Hiragana", ch, ro));
  KATAKANA_EXTENSIONS.forEach(([ch, ro]) => add(`kata:${ch}`, "Katakana", ch, ro));
  N5_KANJI.forEach(k => add(`kanji:${k.glyph}`, "Kanji N5", k.glyph,
    `${k.reading} · ${k.meaning}`, {reading:k.exampleReading,spoken:k.exampleReading}));
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
    schemaVersion: SCHEMA_VERSION,
    drafts: {},
    attempts: {},
    cards,
    lessons: {},
    checkpoints: {},
    curriculumVersion: 2,
    curriculumAccess: [],
    paper: {},
    streak: { last: "", days: 0 },
    stats: { reviews: 0, correct: 0 },
    dailyAnswers: {},
    dailyActivityGoal: 2,
    activityLog: {},
    createdAt: Date.now(),
    mocks: [],
    selectedLevel: "N5",
    speedRecords: { highScore: 0, bestCombo: 0, totalGames: 0 },
    notebook: {
      notes: [],
      kanban: [],
      doubts: [],
    },
    studySession: null,
    studyLog: {},
    jlptGoals: { ...DEFAULT_JLPT_GOALS },
    savedWebResources: [],
    onboardingCompleted: false,
    userProfile: null,
    errorMemory: [],
    diagnosticHistory: [],
    diagnosticDrafts: {},
    pedagogy: createPedagogyState(),
    n5Practice: {seed:0,answers:{},played:[],transcripts:[],history:[]},
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
  // Migrate versionless/v1 backups without erasing completed legacy chapters.
  if(value.schemaVersion != null && (!Number.isInteger(value.schemaVersion) || value.schemaVersion > SCHEMA_VERSION || value.schemaVersion < 1))
    throw new Error('Versão do backup incompatível. Os dados existentes não foram modificados.');
  if(value.drafts && typeof value.drafts === 'object' && !Array.isArray(value.drafts)) {
    base.drafts=Object.fromEntries(Object.entries(value.drafts).filter(([key,draft])=>
      /^(checkpoint:|lesson:)[\w:-]{1,90}$/.test(key) && draft && typeof draft==='object' && !Array.isArray(draft) &&
      draft.answers && typeof draft.answers==='object' && !Array.isArray(draft.answers) &&
      Object.keys(draft.answers).length<=30 && Object.values(draft.answers).every(a=>typeof a==='string'&&a.length<=1000 || Number.isInteger(a)&&a>=0&&a<=4) &&
      (draft.result===null || draft.result===undefined || Number.isInteger(draft.result)&&draft.result>=0&&draft.result<=100)
    ).slice(0,60).map(([key,draft])=>[key,{answers:{...draft.answers},result:draft.result??null,...(key.startsWith('checkpoint:')?{transcripts:Array.isArray(draft.transcripts)?[...new Set(draft.transcripts.filter(id=>typeof id==='string'&&id.length<=100))].slice(0,10):[]}: {}), ...(key.startsWith('checkpoint:listening:')?{audioPlayed:Array.isArray(draft.audioPlayed)?[...new Set(draft.audioPlayed.filter(id=>typeof id==='string'&&/^n5-listening-\d{2}$/.test(id)))].slice(0,10):[]}: {})}]));
  }
  if(value.attempts && typeof value.attempts==='object' && !Array.isArray(value.attempts)) {
    base.attempts=Object.fromEntries(Object.entries(value.attempts).filter(([key,n])=>
      /^(checkpoint:|lesson:)[\w:-]{1,90}$/.test(key)&&Number.isInteger(n)&&n>=0&&n<=10000).slice(0,60));
  }
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
  // Preserve genuine user-created flashcards; never discard personal notes on reload.
  for (const [id, old] of Object.entries(value.cards)) {
    if (!/^custom:[\w-]{1,80}$/.test(id) || !old || typeof old !== 'object' || Array.isArray(old)) continue;
    if (typeof old.prompt !== 'string' || old.prompt.length > 1000 ||
        typeof old.answer !== 'string' || old.answer.length > 5000 ||
        typeof old.seen !== 'boolean' || !['reps','interval','ease','due'].every(k => Number.isFinite(old[k]) && old[k]>=0)) continue;
    base.cards[id] = {
      id, type:'Caderno Pessoal', prompt:old.prompt, answer:old.answer,
      seen:old.seen, reps:old.reps, interval:old.interval, ease:old.ease, due:old.due,
    };
  }
  base.lessons = Object.fromEntries(
    Object.entries(value.lessons).filter(([, v]) => v === true),
  );
  if (value.checkpoints && typeof value.checkpoints === "object" && !Array.isArray(value.checkpoints)) {
    base.checkpoints = Object.fromEntries(Object.entries(value.checkpoints).filter(([topic, entry]) =>
      (["hiragana", "katakana", "words", "grammar"].includes(topic)||Boolean(unitById(topic))) && entry &&
      Number.isInteger(entry.score) && entry.score >= 0 && entry.score <= 100 &&
      typeof entry.date === "string" && entry.date.length <= 32
    ).map(([topic, entry]) => [topic, { score: entry.score, date: entry.date, ...(unitById(topic)?.kind==='listening' && ['reading-fallback','synthetic-listening','unverified-audio'].includes(entry.modality)?{modality:entry.modality}:{}) }]));
  }
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
  base.dailyActivityGoal = [1, 2, 3].includes(value.dailyActivityGoal) ? value.dailyActivityGoal : 2;
  if (value.activityLog && typeof value.activityLog === 'object' && !Array.isArray(value.activityLog)) {
    base.activityLog = Object.fromEntries(Object.entries(value.activityLog).filter(([day, ids]) =>
      /^\d{4}-\d{2}-\d{2}$/.test(day) && Array.isArray(ids)
    ).slice(-90).map(([day, ids]) => [day, [...new Set(ids.filter(id => typeof id === 'string' && id.length <= 100))].slice(-30)]));
  }
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
      ).slice(0,200).map(m=>({level:m.level,score:m.score,date:m.date,source:typeof m.source==="string"?m.source.slice(0,120):""}))
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
    const safeText = (text,max=10000)=>typeof text==='string'&&text.length<=max;
    base.notebook = {
      notes: Array.isArray(value.notebook.notes) ? value.notebook.notes.filter(n=>n&&safeText(n.id,90)&&safeText(n.title,300)&&safeText(n.content,100000)).slice(0,1000):[],
      kanban: Array.isArray(value.notebook.kanban) ? value.notebook.kanban.filter(k=>k&&safeText(k.id,90)&&safeText(k.title,300)).slice(0,1000):[],
      doubts: Array.isArray(value.notebook.doubts) ? value.notebook.doubts.filter(d=>d&&safeText(d.id,90)&&safeText(d.question||d.text||'',10000)).slice(0,1000):[],
    };
  }
  if (isValidStudySession(value.studySession)) {
    base.studySession = structuredClone(value.studySession);
    base.studySession.dueCardIds = base.studySession.dueCardIds.filter(id => Boolean(base.cards[id]));
    base.studySession.srsIndex = Math.min(base.studySession.srsIndex, base.studySession.dueCardIds.length);
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
    base.savedWebResources=value.savedWebResources.filter(r=>r&&typeof r==='object'&&typeof r.url==='string'&&r.url.length<2048&&/^https?:\/\//.test(r.url)).slice(0,250);
  }
  if (value.onboardingCompleted !== undefined) {
    base.onboardingCompleted = Boolean(value.onboardingCompleted);
  }
  if (value.userProfile && typeof value.userProfile === "object") {
    base.userProfile = Object.fromEntries(Object.entries(value.userProfile).filter(([k,v])=>k.length<=80&&(typeof v==='string'&&v.length<=500||typeof v==='number'&&Number.isFinite(v)||typeof v==='boolean')));
  }
  if (Array.isArray(value.errorMemory)) {
    base.errorMemory = value.errorMemory.filter(e=>e&&typeof e==='object'&&typeof e.id==='string'&&e.id.length<=90&&typeof e.topic==='string'&&e.topic.length<=500).slice(0,1000);
  }
  if (Array.isArray(value.diagnosticHistory)) {
    base.diagnosticHistory = value.diagnosticHistory.filter(r =>
      r && JLPT_PATHS[r.level] && Number.isInteger(r.correct) && Number.isInteger(r.total) &&
      r.total >= 1 && r.total <= 100 && r.correct >= 0 && r.correct <= r.total &&
      typeof r.date === 'string' && !Number.isNaN(Date.parse(r.date))
    ).slice(-30);
  }
  // Restore unfinished personal evaluations without marking them completed.
  if(value.diagnosticDrafts && typeof value.diagnosticDrafts==='object' && !Array.isArray(value.diagnosticDrafts)){
    base.diagnosticDrafts=Object.fromEntries(Object.entries(value.diagnosticDrafts).filter(([level,d])=>
      ['N5','N4','N3','N2','N1'].includes(level)&&d&&typeof d==='object'&&!Array.isArray(d)&&
      Number.isInteger(d.step)&&d.step>=0&&d.step<8&&d.answers&&typeof d.answers==='object'&&!Array.isArray(d.answers)&&
      Object.keys(d.answers).length<=8&&Object.entries(d.answers).every(([id,choice])=>
        typeof id==='string'&&id.length<=100&&Number.isInteger(choice)&&choice>=0&&choice<=4
      )
    ).map(([level,d])=>[level,{step:d.step,answers:{...d.answers}}]));
  }
  // Formative course review; never store it in the certification assessmentHistory.
  const practice=value.n5Practice;
  if(practice&&typeof practice==='object'&&!Array.isArray(practice)){
    base.n5Practice.seed=Number.isInteger(practice.seed)&&practice.seed>=0&&practice.seed<=2147483647?practice.seed:0;
    base.n5Practice.answers=Object.fromEntries(Object.entries(practice.answers||{}).filter(([id,answer])=>
      /^personal-[vgrl]-[\w\u3040-\u30ff\u3400-\u9fff:-]{1,90}$/.test(id)&&typeof answer==='string'&&answer.length<=300).slice(0,50));
    for(const k of ['played','transcripts'])base.n5Practice[k]=Array.isArray(practice[k])?[...new Set(practice[k].filter(id=>typeof id==='string'&&/^personal-l-n5-listening-\d{2}$/.test(id)))].slice(0,10):[];
    base.n5Practice.history=Array.isArray(practice.history)?practice.history.filter(entry=>entry?.kind==='kotonoha-n5-formative'&&entry.level==='N5'&&Number.isInteger(entry.total)&&entry.total===32&&Number.isInteger(entry.correct)&&entry.correct>=0&&entry.correct<=32&&typeof entry.date==='string').slice(-20):[];
  }
  // Standalone pedagogy data is optional in v1/v2 backups; invalid future formats fail closed.
  if (value.pedagogy != null) base.pedagogy = normalizePedagogyState(value.pedagogy);
  base.curriculumVersion=2;
  base.curriculumAccess=value.curriculumVersion===2
    ? [...new Set((Array.isArray(value.curriculumAccess)?value.curriculumAccess:[]).filter(id=>unitById(id)))]
    : legacyAccessibleIds(base);
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
  if (card.type === "Caderno Pessoal") return true;
  if (level === "N5") {
    return (
      card.type === "Vocabulário N5" || card.type === "Kanji N5" ||
      ["Hiragana", "Katakana"].includes(card.type)
    );
  }
  return card.type === `Vocabulário ${level}`;
}
/** Bounded batches. Custom cards are always eligible without changing course level. */
export function selectReview(state,type,limit=10,now=Date.now()){
  const level=state.selectedLevel||'N5';
  const cards=Object.values(state.cards||{}).filter(c=>type?c.type===type:cardMatchesLevel(c,level));
  const due=cards.filter(c=>c.seen&&c.due<=now).sort((a,b)=>a.due-b.due);
  if(due.length)return due.slice(0,limit).map(c=>c.id);
  const fresh=cards.filter(c=>!c.seen);
  if(type)return fresh.slice(0,Math.min(limit,type.startsWith('Vocabulário')?4:5)).map(c=>c.id);
  // Personal flashcards don't wait for an N5 category to be exhausted.
  const personal=fresh.filter(c=>c.type==='Caderno Pessoal');
  const curricular=fresh.filter(c=>c.type!=='Caderno Pessoal');
  const groups=[...new Set(curricular.map(c=>c.type))];
  const primary=curricular.filter(c=>c.type===groups[0]);
  return [...personal.slice(0,2),...primary.slice(0,Math.min(5,limit-2))].slice(0,limit).map(c=>c.id);
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
  // Streak and daily goal are credited only after completing a meaningful session.
}

// Validate persisted guided sessions before restoring untrusted JSON.
export function isValidStudySession(session) {
  return session !== null && typeof session === "object" && !Array.isArray(session) &&
    Number.isInteger(session.step) && session.step >= 1 && session.step <= 3 &&
    Number.isInteger(session.lessonIndex) && session.lessonIndex >= 0 && session.lessonIndex < 3 &&
    Number.isInteger(session.duration) && [5, 15, 30].includes(session.duration) &&
    Array.isArray(session.dueCardIds) && session.dueCardIds.length <= 30 &&
    session.dueCardIds.every(id => typeof id === "string" && id.length < 100) &&
    Number.isInteger(session.srsIndex) && session.srsIndex >= 0 && session.srsIndex <= session.dueCardIds.length &&
    typeof session.srsRevealed === "boolean" &&
    (session.selectedOption === null || (Number.isInteger(session.selectedOption) && session.selectedOption >= 0 && session.selectedOption <= 3)) &&
    typeof session.answered === "boolean";
}
