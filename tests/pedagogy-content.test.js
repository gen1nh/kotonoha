import test from 'node:test';
import assert from 'node:assert/strict';
import {N5_DRAFT_ITEMS} from '../src/entities/study/index.js';
import {validateItem, eligibleItems, buildAssessment, assessmentBlueprint} from '../src/entities/study/index.js';
import {APPROVED_EXAM_ITEMS} from '../src/entities/study/index.js';
import {n5ReleaseReadiness} from '../src/entities/study/index.js';

test('legacy exercises form a coherent draft review queue without level-certification leakage',()=>{
  assert.equal(N5_DRAFT_ITEMS.length,12);
  assert.ok(N5_DRAFT_ITEMS.every(q=>q.status==='draft' && validateItem(q).length===0));
  assert.equal(new Set(N5_DRAFT_ITEMS.map(q=>q.id)).size,N5_DRAFT_ITEMS.length);
  assert.equal(eligibleItems(N5_DRAFT_ITEMS,'N5').length,0);
});
test('release bank remains fail-closed: cannot fabricate a listening exam from a draft list',()=>{
  assert.equal(APPROVED_EXAM_ITEMS.length,0);
  const selected=buildAssessment(N5_DRAFT_ITEMS,assessmentBlueprint('N5',2));
  assert.equal(selected.status,'insufficient_bank');
  assert.equal(n5ReleaseReadiness([...APPROVED_EXAM_ITEMS,...N5_DRAFT_ITEMS]).examAvailable,false);
});
test('duplicate approved IDs are not accepted as distinct questions',()=>{
  const sample={...N5_DRAFT_ITEMS[0],status:'approved',review:{author:'a',reviewer:'b',reviewedAt:'2026-10-13'}};
  const source=[sample,sample];
  const exam=buildAssessment(source,assessmentBlueprint('N5',2));
  assert.equal(exam.status,'insufficient_bank');
});
