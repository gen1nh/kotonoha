/**
 * Cronômetro de tempo ativo de estudo.
 *
 * Só soma 1 s por segundo quando:
 *  - a aba está visível;
 *  - houve interação (clique, tecla, toque, rolagem) nos últimos IDLE_MS;
 *  - a rastreabilidade está habilitada (ex.: fora das Preferências).
 *
 * Os segundos ficam "pendentes" e são gravados no estado em lotes (ver App.jsx),
 * evitando reescrever o localStorage a cada segundo.
 */
export const IDLE_MS = 60_000;

let pending = 0;
let live = 0;
let enabled = true;
let lastActivity = Date.now();
const listeners = new Set();

const notify = () => listeners.forEach((fn) => fn());

export function setTrackingEnabled(value) {
  enabled = !!value;
}

/** Segundos ativos acumulados desde que o app abriu (para exibir em tela). */
export function getLiveSeconds() {
  return live;
}

/** Retorna e zera os segundos ainda não gravados no estado. */
export function takePendingSeconds() {
  const value = pending;
  pending = 0;
  return value;
}

export function subscribeLive(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function startTracker() {
  const mark = () => {
    lastActivity = Date.now();
  };
  const events = ["pointerdown", "keydown", "touchstart", "scroll", "wheel"];
  events.forEach((name) =>
    window.addEventListener(name, mark, { passive: true }),
  );
  const id = setInterval(() => {
    if (!enabled) return;
    if (document.visibilityState !== "visible") return;
    if (Date.now() - lastActivity > IDLE_MS) return;
    pending += 1;
    live += 1;
    notify();
  }, 1000);
  return () => {
    clearInterval(id);
    events.forEach((name) => window.removeEventListener(name, mark));
  };
}

export function formatClock(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

export function formatDuration(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  if (s < 60) return s === 0 ? "0 min" : `${s} s`;
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h === 0) return `${m} min`;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}
