import test from 'node:test';
import assert from 'node:assert/strict';
import { collectActivityChanges, dailyActivityCount, dailyGoal, recordActivity } from '../src/dailyPlan.js';
test('activities deduplicate and respect goal', () => {
  const state = {dailyActivityGoal:3};
  recordActivity(state,'review','2026-10-12');recordActivity(state,'review','2026-10-12');
  assert.equal(dailyActivityCount(state,'2026-10-12'),1);
  assert.equal(dailyGoal(state),3);
});
test('new lesson and daily answer count but repeated answer does not', () => {
  const before={lessons:{},dailyAnswers:{},stats:{reviews:0}};
  const after={lessons:{a:true},dailyAnswers:{'2026-10-12:N5':1},stats:{reviews:0}};
  collectActivityChanges(before,after,'2026-10-12');
  assert.equal(dailyActivityCount(after,'2026-10-12'),2);
  collectActivityChanges(after,after,'2026-10-12');
  assert.equal(dailyActivityCount(after,'2026-10-12'),2);
});
