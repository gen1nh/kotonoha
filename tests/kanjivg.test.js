import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { N5_KANJI } from '../src/entities/study/index.js';
import { kanjiVGPath,parseKanjiVG } from '../src/entities/study/index.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
test('All N5 kanji have bundled SVG paths for offline practice',()=>{
  assert.equal(N5_KANJI.length,105);
  for(const row of N5_KANJI){
    const url=kanjiVGPath(row.glyph);
    assert.ok(url?.startsWith('/kanjivg/'),'no SVG for '+row.glyph);
    const file=path.join(root,'public',url.slice(1));
    assert.ok(existsSync(file),'missing '+file);
    const strokes=parseKanjiVG(readFileSync(file,'utf8'));
    assert.ok(strokes.length>0&&strokes.length<=35,'invalid strokes for '+row.glyph);
  }
  assert.equal(kanjiVGPath('あ'),null);
});
test('KanjiVG parser extracts geometry, never untrusted markup',()=>{
  const src='<svg><script>bad()</script><path id="kvg:065e5-s1" d="M1,2L3,4"/><path id="kvg:065e5-s2" d="M5,6L7,8"/><path id="attack-s3" d="alert(1)"/></svg>';
  assert.deepEqual(parseKanjiVG(src),[{number:1,d:'M1,2L3,4'},{number:2,d:'M5,6L7,8'}]);
});
