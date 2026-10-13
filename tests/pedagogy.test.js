import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CORE_SKILLS, LEVEL_ORDER, validateItem, eligibleItems, assessmentBlueprint, buildAssessment, gradeAssessment, recommendPlacement, normalizePedagogyState, competencyEvidence } from '../src/pedagogy/engine.js';

const item = (skill, n, level='N5') => ({
  id: `n5-${skill}-${n}`, level, skill, competencyId: `n5-${skill}-core`, status: 'approved',
  prompt: `Question ${n} for ${skill}?`, choices: ['A', 'B', 'C', 'D'], answerIndex: 2,
  explanation: 'Correct answer is C', provenance: { sourceId: 'original', license: 'Original, permission granted to Kotonoha', attribution: 'Kotonoha editorial team' },
  review: { author: 'author', reviewer: 'reviewer', reviewedAt: '2026-10-13' },
  ...(skill === 'listening' ? { audio: { path: `/audio/n5/${n}.mp3`, license: 'Original' } } : {}),
});
const bank = CORE_SKILLS.flatMap(skill => Array.from({length:4}, (_,n) => item(skill,n)));

test('catalog and skill contract cover five levels and four core skills', () => {
  assert.deepEqual(LEVEL_ORDER, ['N5','N4','N3','N2','N1']);
  assert.equal(CORE_SKILLS.length, 4);
});
test('approved item requires independent review and rights tracking', () => {
  assert.deepEqual(validateItem(item('grammar',1)), []);
  assert.ok(validateItem({...item('grammar',1), review:{author:'same',reviewer:'same',reviewedAt:'2026-10-13'}}).length);
  assert.ok(validateItem({...item('grammar',1), provenance:{sourceId:'jlpt',license:'unknown',attribution:'JLPT'}}).length);
  assert.ok(validateItem({...item('listening',1), audio:undefined}).length);
});
test('drafts and duplicate choices are not eligible for certification', () => {
  assert.equal(eligibleItems([{...item('grammar',1),status:'draft'}, {...item('grammar',2),choices:['A','A','C','D']}], 'N5').length, 0);
});
test('gate must fail closed on missing listening pool', () => {
  const result=buildAssessment(bank.filter(x=>x.skill!=='listening'),assessmentBlueprint('N5',2));
  assert.equal(result.status,'insufficient_bank');
  assert.deepEqual(result.questions,[]);
  assert.equal(result.shortages.listening,2);
  assert.equal(gradeAssessment(result,{}).status,'not_gradable');
});
test('assessments are reproducible, balanced and do not repeat items', () => {
  const blueprint=assessmentBlueprint('N5',3);
  const a=buildAssessment(bank,blueprint,{seed:313});
  const b=buildAssessment(bank,blueprint,{seed:313});
  assert.equal(a.status,'ready');
  assert.deepEqual(a.questions.map(x=>x.id),b.questions.map(x=>x.id));
  assert.equal(new Set(a.questions.map(x=>x.id)).size,12);
  for(const skill of CORE_SKILLS)assert.equal(a.questions.filter(x=>x.skill===skill).length,3);
});
test('cannot pass an incomplete paper or a weak listening section', () => {
  const a=buildAssessment(bank,assessmentBlueprint('N5',3));
  assert.equal(gradeAssessment(a,{}).status,'incomplete');
  const answers=Object.fromEntries(a.questions.map(q=>[q.id,q.skill==='listening'?0:2]));
  const grade=gradeAssessment(a,answers);
  assert.equal(grade.passed,false);
  assert.equal(grade.bySkill.listening.correct,0);
});
test('internal passing result is not an official JLPT certificate', () => {
  const a=buildAssessment(bank,assessmentBlueprint('N5',2));
  const result=gradeAssessment(a,Object.fromEntries(a.questions.map(q=>[q.id,2])));
  assert.equal(result.status,'passed');
  assert.equal(result.kind,'kotonoha-internal');
  assert.equal(recommendPlacement({N5:result}).recommendedLevel,'N4');
  assert.equal(recommendPlacement({N5:result}).officialJlptCertification,false);
});
test('placement never skips a failed or untested prerequisite', () => {
  const a=buildAssessment(bank,assessmentBlueprint('N5',2));
  const pass=gradeAssessment(a,Object.fromEntries(a.questions.map(q=>[q.id,2])));
  assert.equal(recommendPlacement({N4:{...pass,level:'N4'}}).recommendedLevel,'N5');
  assert.equal(recommendPlacement({N5:pass,N3:{...pass,level:'N3'}}).recommendedLevel,'N4');
});
test('state normalization is bounded and rejects future incompatible schema', () => {
  assert.deepEqual(normalizePedagogyState(null).assessmentHistory,[]);
  assert.throws(()=>normalizePedagogyState({schemaVersion:2}),/Unsupported/);
  const stored=normalizePedagogyState({schemaVersion:1,evidence:[{itemId:'n5-word-1',competencyId:'n5-word-core',skill:'vocabulary',correct:true}],assessmentHistory:[],placement:{recommendedLevel:'N4',verifiedThrough:'N5',officialJlptCertification:true}});
  assert.equal(stored.placement.officialJlptCertification,false);
  assert.equal(stored.evidence.length,1);
});
test('reviewed flashcards never grant certification by themselves', () => {
  const out=competencyEvidence([{itemId:'n5-word-1',competencyId:'n5-word-core',skill:'vocabulary',correct:false},{itemId:'n5-word-1',competencyId:'n5-word-core',skill:'vocabulary',correct:true}], 'n5-word-core');
  assert.equal(out.attempts,2);
  assert.equal(out.distinctItems,1);
  assert.equal(out.masteryCertified,false);
});
