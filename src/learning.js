import { CURRICULUM } from "./curriculum.js";

const FOUNDATION = [
  {
    id: "kana",
    title: "Os sons e a escrita",
    focus: "Hiragana e katakana",
    detail: "Ouça, reconheça e escreva os 92 caracteres básicos.",
    topic: "hiragana",
  },
  {
    id: "words",
    title: "Suas primeiras palavras",
    focus: "Vocabulário",
    detail: "20 palavras do cotidiano para aprender e revisar.",
    topic: "vocabulary",
  },
  {
    id: "grammar",
    title: "Construa suas primeiras frases",
    focus: "Gramática",
    detail: "Partículas, exemplos e prática para conectar as palavras.",
    topic: "grammar",
  },
];

export function lessonsFor(level) {
  return level === "N5" ? FOUNDATION : CURRICULUM[level];
}
export function isDone(state, level, lesson) {
  if (level !== "N5") return !!state.lessons[lesson.id];
  if (lesson.id === "grammar") return !!state.lessons.grammar;
  const cards = Object.values(state.cards).filter((card) =>
    lesson.id === "kana"
      ? ["Hiragana", "Katakana"].includes(card.type)
      : card.type === "Vocabulário N5",
  );
  return cards.length > 0 && cards.every((card) => card.seen);
}
