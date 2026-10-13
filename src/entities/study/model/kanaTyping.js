/** WanaKana-based normalization for optional formative kana keyboard practice. */
import { toKana, toHiragana } from 'wanakana';

export function normalizeKanaAnswer(value) {
  if (typeof value !== 'string') return '';
  const input = value.trim().normalize('NFKC').replace(/\s+/g, '');
  if (!input) return '';
  return toHiragana(toKana(input)).normalize('NFC');
}
export function checkKanaTyping(input, expected) {
  const actual = normalizeKanaAnswer(input);
  return actual.length > 0 && actual === normalizeKanaAnswer(expected);
}
