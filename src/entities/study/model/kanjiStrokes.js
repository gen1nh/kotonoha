import { N5_KANJI } from '../content/n5Kanji.js';

/** Selected SVGs from KanjiVG CC BY-SA 3.0; served locally by Vite/PWA. */
const N5_GLYPHS = new Set(N5_KANJI.map(item => item.glyph));
export function kanjiVGPath(character) {
  if (!N5_GLYPHS.has(character) || [...character].length !== 1) return null;
  return '/kanjivg/' + character.codePointAt(0).toString(16).padStart(5,'0') + '.svg';
}
/** Parse stroke path geometry only; do not inject third-party SVG markup. */
export function parseKanjiVG(source) {
  if (typeof source !== 'string') return [];
  const strokes=[];
  const re=/<path\s+([^>]*?)\s*\/?\s*>/g;
  let match;
  while ((match=re.exec(source))) {
    const id=/\bid="([^"]+)"/.exec(match[1])?.[1];
    const number=/-s(\d+)$/.exec(id||'');
    const d=/\bd="([^"]+)"/.exec(match[1])?.[1];
    if (!number || !d || !/^[\d\s.,+\-eEMmZzLlHhVvCcSsQqTtAa]+$/.test(d)) continue;
    strokes.push({number:Number(number[1]),d});
  }
  strokes.sort((a,b)=>a.number-b.number);
  return strokes.length>0 && strokes.every((row,i)=>row.number===i+1) ? strokes : [];
}
