import test from "node:test";
import assert from "node:assert/strict";
import { CURRICULUM, VOCAB_BY_LEVEL } from "../src/entities/study/index.js";
import {
  initialState,
  normalizeState,
  selectReview,
  rateCard,
} from "../src/entities/study/index.js";

test("N4–N1 each have three complete lessons with answerable exercises", () => {
  const ids = new Set();
  for (const level of ["N4", "N3", "N2", "N1"]) {
    assert.equal(CURRICULUM[level].length, 3);
    for (const lesson of CURRICULUM[level]) {
      assert.ok(
        lesson.title &&
          lesson.explanation &&
          lesson.example &&
          lesson.translation,
      );
      assert.equal(lesson.questions.length, 4);
      for (const question of lesson.questions) {
        assert.ok(!ids.has(question.id), `duplicate question ${question.id}`);
        ids.add(question.id);
        assert.ok(question.prompt && question.sentence && question.explanation);
        assert.ok(question.choices.length >= 3);
        assert.ok(Number.isInteger(question.answer));
        assert.ok(
          question.answer >= 0 && question.answer < question.choices.length,
        );
      }
    }
  }
  assert.equal(ids.size, 48);
});

test("N4–N1 vocabulary joins spaced review and survives local backup normalization", () => {
  const state = initialState();
  for (const level of ["N4", "N3", "N2", "N1"]) {
    assert.equal(VOCAB_BY_LEVEL[level].length, 16);
    const queue = selectReview(state, `Vocabulário ${level}`);
    assert.equal(queue.length, 4);
    rateCard(state, queue[0], "good", 1_800_000_000_000);
  }
  state.selectedLevel = "N4";
  state.lessons[CURRICULUM.N4[0].id] = true;
  state.dailyAnswers["2026-10-12:N4"] = 1;

  const restored = normalizeState(JSON.parse(JSON.stringify(state)));
  assert.equal(restored.cards["vocab:N4:家族"].seen, true);
  assert.equal(restored.cards["vocab:N4:家族"].reps, 1);
  assert.equal(restored.lessons[CURRICULUM.N4[0].id], true);
  assert.equal(restored.dailyAnswers["2026-10-12:N4"], 1);
  assert.equal(restored.selectedLevel, "N4");
});
