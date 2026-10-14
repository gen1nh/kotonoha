import { Howl } from 'howler';
import { useSyncExternalStore } from 'react';

const KEY = 'kotonoha.audio.v1';
const defaults = { enabled: true, volume: 0.4 };
function read() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    return { enabled: typeof saved?.enabled === 'boolean' ? saved.enabled : true,
      volume: Number.isFinite(saved?.volume) ? Math.max(0, Math.min(1, saved.volume)) : 0.4 };
  } catch { return { ...defaults }; }
}
let settings = read();
const listeners = new Set();
const sounds = new Map();
function notify() { for (const listener of listeners) listener(); }
export function setSoundSettings(patch) {
  settings = { ...settings, ...patch };
  settings.volume = Math.max(0, Math.min(1, Number(settings.volume) || 0));
  for (const sound of sounds.values()) {
    sound.volume(settings.volume);
    if (!settings.enabled || settings.volume === 0) sound.stop();
  }
  let saved = true;
  try { localStorage.setItem(KEY, JSON.stringify(settings)); } catch { saved = false; }
  notify();
  return saved;
}
export function useSoundSettings() {
  return useSyncExternalStore(listener => { listeners.add(listener); return () => listeners.delete(listener); }, () => settings);
}
if (typeof window !== 'undefined') {
  window.addEventListener('storage', event => {
    if (event.key !== KEY) return;
    settings = read();
    for (const sound of sounds.values()) { sound.volume(settings.volume); if (!settings.enabled) sound.stop(); }
    notify();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) for (const sound of sounds.values()) sound.stop();
  });
}

// Only explicit answer/finish handlers call this; never a render or state updater.
export function playSound(name) {
  if (!['correct', 'incorrect', 'complete'].includes(name) || !settings.enabled || settings.volume === 0 || document.hidden) return;
  // Keep Japanese speech intelligible; sound effects never cancel pronunciation.
  if (window.speechSynthesis?.speaking) return;
  try {
    for (const sound of sounds.values()) sound.stop();
    if (!sounds.has(name)) sounds.set(name, new Howl({
      src: [`/audio/${name}.wav`], volume: settings.volume,
      onplayerror: function () { this.stop(); },
    }));
    sounds.get(name).play();
  } catch { /* Audio unavailable must not block a lesson or answer. */ }
}
