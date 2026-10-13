import { test } from "node:test";
import assert from "node:assert/strict";
import {
  initialState,
  normalizeState,
  selectReview,
  rateCard,
  markStudy,
  todayKey,
} from "../src/state.js";

test("inicia cartões do N5 expandido e preserva progresso de backups antigos", () => {
  const state = initialState();
  assert.ok(Object.keys(state.cards).length >= 700);
  rateCard(state, "hira:あ", "good", 1000);
  const restored = normalizeState(JSON.parse(JSON.stringify(state)));
  assert.equal(restored.cards["hira:あ"].reps, 1);
  assert.equal(restored.cards["hira:あ"].due, 1000 + 2 * 86400000);
  assert.throws(() => normalizeState({ cards: {}, lessons: null }));
});
test("revisão respeita categoria e limite de novos cartões", () => {
  const state = initialState();
  assert.equal(selectReview(state, "Katakana").length, 5);
  assert.ok(
    selectReview(state, "Katakana").every((id) => id.startsWith("kata:")),
  );
  assert.equal(selectReview(state, "Vocabulário N5").length, 4);
  rateCard(state, "hira:あ", "again", 0);
  assert.deepEqual(selectReview(state), ["hira:あ"]);
});
test("erro agenda dez minutos e sequência conta uma vez por dia", () => {
  const state = initialState();
  rateCard(state, "hira:あ", "again", 1000);
  assert.equal(state.cards["hira:あ"].due, 601000);
  assert.equal(state.stats.correct, 0);
  assert.equal(state.stats.reviews, 1);
  markStudy(state);
  markStudy(state);
  assert.deepEqual(state.streak, { last: todayKey(), days: 1 });
});

test("filtro de nível limita revisão vencida e nova sem bloquear prática explícita de kana", () => {
  const state = initialState();
  state.selectedLevel = "N3";
  const newCards = selectReview(state);
  assert.ok(newCards.length > 0);
  assert.ok(newCards.every((id) => state.cards[id].type === "Vocabulário N3"));
  rateCard(state, "hira:あ", "again", 0);
  rateCard(state, newCards[0], "again", 0);
  assert.deepEqual(selectReview(state), [newCards[0]]);
  assert.ok(
    selectReview(state, "Hiragana").every(
      (id) => state.cards[id].type === "Hiragana",
    ),
  );
});
