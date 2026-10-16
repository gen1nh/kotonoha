import { test } from "node:test";
import assert from "node:assert/strict";
import {
  initialState,
  normalizeState,
  selectReview,
  rateCard,
  markStudy,
  todayKey,
} from "../src/entities/study/index.js";

test("inicia cartões do N5 expandido e preserva progresso de backups antigos", () => {
  const state = initialState();
  assert.ok(Object.keys(state.cards).length >= 700);
  rateCard(state, "hira:あ", "good", 1000);
  const restored = normalizeState(JSON.parse(JSON.stringify(state)));
  assert.equal(restored.cards["hira:あ"].reps, 1);
  assert.equal(restored.cards["hira:あ"].due, 1000 + 2 * 86400000);
  assert.throws(() => normalizeState({ cards: {}, lessons: null }));
});
test("revisão só mostra cartões vistos e vencidos, inclusive com filtro",()=>{
  const state=initialState();
  assert.deepEqual(selectReview(state),[]);
  assert.deepEqual(selectReview(state,"Katakana"),[]);
  assert.deepEqual(selectReview(state,"Vocabulário N5"),[]);
  state.cards["hira:あ"].seen=true;
  state.cards["hira:あ"].due=100;
  state.cards["kata:ア"].seen=true;
  state.cards["kata:ア"].due=200;
  assert.deepEqual(selectReview(state,undefined,10,150),["hira:あ"]);
  assert.deepEqual(selectReview(state,"Katakana",10,150),[]);
  assert.deepEqual(selectReview(state,"Katakana",10,250),["kata:ア"]);
  assert.deepEqual(selectReview(state,undefined,10,250),["hira:あ","kata:ア"]);
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
  assert.deepEqual(selectReview(state), []);
  rateCard(state, "hira:あ", "again", 0);
  const n3Card=Object.keys(state.cards).find(id=>id.startsWith('vocab:N3:'));
  rateCard(state,n3Card,"again",0);
  assert.deepEqual(selectReview(state),[n3Card]);
  assert.ok(
    selectReview(state, "Hiragana").every(
      (id) => state.cards[id].type === "Hiragana",
    ),
  );
});
