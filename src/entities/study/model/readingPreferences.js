import { useSyncExternalStore } from 'react';

const KEY = 'kotonoha.reading.v1';
export const DEFAULT_READING_PREFERENCES = Object.freeze({ showRomaji: false, speechRate: 0.85 });
const rates = Object.freeze([0.5, 0.75, 0.85, 1, 1.15]);
const listeners = new Set();

export function normalizeReadingPreferences(value) {
  return {
    showRomaji: value?.showRomaji === true,
    speechRate: rates.includes(Number(value?.speechRate)) ? Number(value.speechRate) : 0.85,
  };
}

function load() {
  try { return normalizeReadingPreferences(JSON.parse(localStorage.getItem(KEY))); }
  catch { return { ...DEFAULT_READING_PREFERENCES }; }
}

let snapshot = load();
const notify = () => { for (const listener of listeners) listener(); };
const subscribe = listener => { listeners.add(listener); return () => listeners.delete(listener); };

export function getReadingPreferences() { return snapshot; }
export function useReadingPreferences() {
  return useSyncExternalStore(subscribe, getReadingPreferences, () => DEFAULT_READING_PREFERENCES);
}
export function setReadingPreferences(patch) {
  snapshot = normalizeReadingPreferences({ ...snapshot, ...patch });
  let saved = true;
  try { localStorage.setItem(KEY, JSON.stringify(snapshot)); }
  catch { saved = false; }
  notify();
  return saved;
}
if (typeof window !== 'undefined') {
  window.addEventListener('storage', event => {
    if (event.key !== KEY) return;
    snapshot = load();
    notify();
  });
}

/** Only display human-reviewed transliteration. Kana-to-romaji alone can misread particles. */
export function reviewedRomaji(item) {
  return typeof item?.romaji === 'string' && item.romaji.trim() ? item.romaji.trim() : null;
}
