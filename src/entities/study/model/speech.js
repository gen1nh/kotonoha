/**
 * Browser-native Japanese speech for learning and FORMATIVE practice.
 * No audio service, download, microphone or API key is needed.
 * Some voices require connectivity or a language pack; availability is device-specific.
 * IMPORTANT: invoke speakJapanese synchronously from a user click for Safari activation.
 */
let activeUtterance = null;
let preferredVoiceURI = null;

const hasSpeech = () => typeof window !== 'undefined' &&
  typeof window.speechSynthesis?.speak === 'function' &&
  typeof window.SpeechSynthesisUtterance === 'function';

/** Pure voice selection. Never accidentally choose an English voice for Japanese. */
export function chooseJapaneseVoice(voices, voiceURI = null) {
  const japanese = (Array.isArray(voices) ? voices : []).filter(
    voice => typeof voice?.lang === 'string' && /^ja(?:-|$)/i.test(voice.lang),
  );
  return japanese.find(voice => voiceURI && voice.voiceURI === voiceURI) ||
    japanese.find(voice => voice.localService && /^ja-JP$/i.test(voice.lang)) ||
    japanese.find(voice => /^ja-JP$/i.test(voice.lang)) ||
    japanese[0] || null;
}

export function japaneseVoices() {
  if (!hasSpeech()) return [];
  try { return window.speechSynthesis.getVoices().filter(voice => /^ja(?:-|$)/i.test(voice.lang)); }
  catch { return []; }
}

/** Watch voice list population on Chrome, Safari and compatible browsers. */
export function warmJapaneseVoices(onUpdate = () => {}) {
  if (!hasSpeech()) { onUpdate([]); return () => {}; }
  const synthesis = window.speechSynthesis;
  const update = () => onUpdate(japaneseVoices());
  update();
  try { synthesis.addEventListener?.('voiceschanged', update); }
  catch { /* Older WebKit may not expose the event. */ }
  // Trigger asynchronous voice population if supported, but never speak automatically.
  return () => { try { synthesis.removeEventListener?.('voiceschanged', update); } catch {} };
}

export function setJapaneseVoice(voiceURI) {
  preferredVoiceURI = typeof voiceURI === 'string' && voiceURI.trim() ? voiceURI : null;
}

export function stopSpeech() {
  try { if (hasSpeech()) window.speechSynthesis.cancel(); } catch {}
  activeUtterance = null;
}

/**
 * Returns whether playback could be REQUESTED, not whether speech was heard.
 * Callbacks report asynchronous failures. No delayed retries: Safari requires a gesture.
 */
export function speakJapanese(text, onError = () => {}, options = {}) {
  if (!hasSpeech()) {
    onError('A voz do navegador não está disponível. Você pode continuar estudando pelo texto.');
    return false;
  }
  const phrase = typeof text === 'string' ? text.trim() : '';
  if (!phrase) return false;
  try {
    const synthesis = window.speechSynthesis;
    const available = japaneseVoices();
    // When getVoices() has populated other languages, a ja voice is required.
    // With an empty list we let the browser try lang=ja-JP while it loads voices.
    if (!available.length && synthesis.getVoices().length > 0) {
      onError('Nenhuma voz japonesa encontrada. Instale ou ative uma voz em japonês no dispositivo.');
      return false;
    }
    synthesis.cancel();
    const utterance = new window.SpeechSynthesisUtterance(phrase);
    utterance.lang = 'ja-JP';
    utterance.rate = Number.isFinite(options.rate) ? Math.min(1.15, Math.max(0.65, options.rate)) : 0.85;
    const voice = chooseJapaneseVoice(available, options.voiceURI || preferredVoiceURI);
    if (voice) utterance.voice = voice;
    activeUtterance = utterance;
    utterance.onstart = () => { if (activeUtterance === utterance) options.onStart?.(); };
    utterance.onend = () => { if (activeUtterance === utterance) activeUtterance = null; };
    utterance.onerror = event => {
      if (activeUtterance !== utterance) return;
      activeUtterance = null;
      if (!['canceled', 'interrupted'].includes(event.error)) {
        onError('Não foi possível reproduzir japonês. Verifique as vozes japonesas do aparelho e tente novamente.');
      }
    };
    // Keep speak() in the direct click stack. No timer, Promise or network hop.
    if (synthesis.paused) synthesis.resume();
    synthesis.speak(utterance);
    return true;
  } catch {
    activeUtterance = null;
    onError('Não foi possível iniciar a reprodução neste aparelho.');
    return false;
  }
}
