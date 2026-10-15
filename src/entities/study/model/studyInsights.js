/** Evidence-based indicators; self-ratings are not JLPT exam scores. */
export function cardMastery(card) {
  if (!card?.seen) return 'new';
  if (card.reps >= 3 && card.interval >= 7) return 'stable';
  if (card.reps >= 1) return 'learning';
  return 'retry';
}
export function levelInsights(state, level = 'N5', now = Date.now()) {
  const cards = Object.values(state.cards || {}).filter(card =>
    ['Hiragana', 'Katakana', `Vocabulário ${level}`, `Kanji ${level}`].includes(card.type) &&
    (level === 'N5' || card.type === `Vocabulário ${level}`));
  const counts = { new: 0, learning: 0, stable: 0, retry: 0 };
  for (const card of cards) counts[cardMastery(card)]++;
  const due = cards.filter(card => card.seen && card.due <= now).length;
  return { ...counts, due, total: cards.length,
    stabilityPercent: cards.length ? Math.round(100 * counts.stable / cards.length) : null };
}
export function nextStudyAction(state, level = 'N5', now = Date.now()) {
  const data = levelInsights(state, level, now);
  if (data.due > 0) return { kind: 'review', label: `Revisar ${data.due} cartão${data.due === 1 ? '' : 'ões'} pendente${data.due === 1 ? '' : 's'}` };
  if (data.new > 0) return { kind: 'learn', label: `Aprender novos cartões de ${level}` };
  return { kind: 'practice', label: 'Praticar o que você já aprendeu' };
}
