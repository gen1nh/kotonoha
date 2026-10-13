import test from "node:test";
import assert from "node:assert/strict";
import {
  addStudySeconds,
  totalStudySeconds,
  hoursProgress,
  formatPercent,
  skillMeters,
  MAX_SECONDS_PER_DAY,
} from "../src/entities/study/index.js";
import { initialState, normalizeState } from "../src/entities/study/index.js";

test("estado novo começa com 0 tempo e 0% de progresso", () => {
  const state = normalizeState(initialState());
  assert.equal(totalStudySeconds(state), 0);
  assert.equal(hoursProgress(state, "N5").percent, 0);
  assert.equal(formatPercent(0), "0%");
});

test("poucos minutos nunca viram porcentagem grande", () => {
  const state = normalizeState(initialState());
  addStudySeconds(state, 30 * 60);
  const { percent } = hoursProgress(state, "N5");
  assert.ok(percent < 10, `esperado < 10%, veio ${percent}`);
});

test("tempo por dia tem teto e ignora valores inválidos", () => {
  const state = normalizeState(initialState());
  addStudySeconds(state, 99 * 3600, "2026-01-01");
  addStudySeconds(state, -5, "2026-01-01");
  addStudySeconds(state, NaN, "2026-01-01");
  assert.equal(state.studyLog["2026-01-01"], MAX_SECONDS_PER_DAY);
});

test("habilidades sem atividade ficam sem dados, não inventadas", () => {
  const state = normalizeState(initialState());
  const accuracy = skillMeters(state, "N5").find((m) => m.id === "accuracy");
  assert.equal(accuracy.value, null);
});

test("backup antigo descarta minutos nominais", () => {
  const state = normalizeState({
    ...initialState(),
    jlptGoals: { targetLevel: "N5", minutesPerDay: 15, totalMinutesStudied: 180 },
  });
  assert.equal(state.jlptGoals.totalMinutesStudied, undefined);
  assert.equal(totalStudySeconds(state), 0);
});
