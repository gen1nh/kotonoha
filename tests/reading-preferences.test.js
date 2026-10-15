import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_READING_PREFERENCES, normalizeReadingPreferences, reviewedRomaji } from '../src/entities/study/model/readingPreferences.js';
import { FORMATIVE_LISTENING_N5 } from '../src/entities/study/model/pedagogy/formativeListening.js';

test('reading settings validate rates, avoid accidental romaji defaults', () => {
  assert.deepEqual(normalizeReadingPreferences({}), DEFAULT_READING_PREFERENCES);
  assert.deepEqual(normalizeReadingPreferences({showRomaji:true,speechRate:0.5}), {showRomaji:true,speechRate:0.5});
  assert.equal(normalizeReadingPreferences({showRomaji:'true',speechRate:8}).showRomaji,false);
  assert.equal(normalizeReadingPreferences({speechRate:-1}).speechRate,0.85);
});

test('romaji is only supplied by reviewed content and remains opt-in in UI', () => {
  assert.equal(reviewedRomaji({spokenText:'水を飲みます'}), null);
  assert.equal(reviewedRomaji({romaji:'  Watashi wa mizu o nomimasu. '}),'Watashi wa mizu o nomimasu.');
  assert.equal(FORMATIVE_LISTENING_N5.length,6);
  for (const question of FORMATIVE_LISTENING_N5) assert.ok(reviewedRomaji(question), question.id);
});
