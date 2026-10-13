import { todayKey, markStudy } from './state.js';
export const GOAL_OPTIONS = [1, 2, 3];
export function dailyActivityCount(state, day = todayKey()) {
  const log = state.activityLog?.[day];
  return Array.isArray(log) ? new Set(log).size : 0;
}
export function dailyGoal(state) {
  return GOAL_OPTIONS.includes(state.dailyActivityGoal) ? state.dailyActivityGoal : 2;
}
export function recordActivity(state, id, day = todayKey()) {
  if (!state.activityLog || typeof state.activityLog !== 'object') state.activityLog = {};
  const existing = Array.isArray(state.activityLog[day]) ? state.activityLog[day] : [];
  state.activityLog[day] = [...new Set([...existing, id])].slice(-30);
  const keys = Object.keys(state.activityLog).sort();
  for (const key of keys.slice(0, Math.max(0, keys.length - 90))) delete state.activityLog[key];
}
export function collectActivityChanges(previous, next, day = todayKey()) {
  const beforeCount = dailyActivityCount(previous, day);
  const previousLessons = previous.lessons || {};
  for (const [id, done] of Object.entries(next.lessons || {})) {
    if (done === true && previousLessons[id] !== true && !id.startsWith("draw:")) recordActivity(next, `lesson:${id}`, day);
  }
  const oldAnswers = previous.dailyAnswers || {};
  for (const [id, answer] of Object.entries(next.dailyAnswers || {})) {
    if (id.startsWith(`${day}:`) && Number.isInteger(answer) && !Number.isInteger(oldAnswers[id])) recordActivity(next, `challenge:${id}`, day);
  }
  // A newly approved checkpoint is a meaningful activity; retries cannot inflate the goal.
  for (const [id, result] of Object.entries(next.checkpoints || {})) {
    const passedBefore = Number(previous.checkpoints?.[id]?.score) >= 80;
    if (Number(result?.score) >= 80 && !passedBefore) recordActivity(next, `checkpoint:${id}`, day);
  }
  // Review is logged by the session completion handler, never after a single rating.
  if (day === todayKey() && dailyActivityCount(next,day) > beforeCount) markStudy(next);
}
