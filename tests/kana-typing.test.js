import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeKanaAnswer,checkKanaTyping } from '../src/kanaTyping.js';

test('WanaKana normalizes romaji and native kana',()=>{
  assert.equal(normalizeKanaAnswer('nihongo'),'にほんご');
  assert.equal(normalizeKanaAnswer('ガッコウ'),'がっこう');
  assert.equal(normalizeKanaAnswer('  gakkou  '),'がっこう');
  assert.equal(checkKanaTyping('konnichiwa','こんにちは'),true);
  assert.equal(checkKanaTyping('sora','そら'),true);
  assert.equal(checkKanaTyping('inu','ねこ'),false);
});
test('Empty answers are never accepted',()=>{
  assert.equal(checkKanaTyping('',''),false);
  assert.equal(checkKanaTyping('  ','あ'),false);
});
