import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeKanaAnswer,checkKanaTyping } from '../src/entities/study/index.js';

test('WanaKana normalizes romaji and native kana',()=>{
  assert.equal(normalizeKanaAnswer('nihongo'),'にほんご');
  assert.equal(normalizeKanaAnswer('ガッコウ'),'がっこう');
  assert.equal(normalizeKanaAnswer('  gakkou  '),'がっこう');
  // Pronunciation 'wa' is written は here; WanaKana must not disguise orthography errors.
  assert.equal(checkKanaTyping('konnichiwa','こんにちは'),false);
  assert.equal(checkKanaTyping('konnichiha','こんにちは'),true);
  assert.equal(checkKanaTyping('sora','そら'),true);
  assert.equal(checkKanaTyping('inu','ねこ'),false);
});
test('Empty answers are never accepted',()=>{
  assert.equal(checkKanaTyping('',''),false);
  assert.equal(checkKanaTyping('  ','あ'),false);
});
