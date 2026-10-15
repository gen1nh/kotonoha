import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState,normalizeState} from '../src/entities/study/index.js';
import {N5_UNITS} from '../src/entities/study/index.js';
import {courseLevel,nextGuidedAction} from '../src/entities/study/index.js';
import {isAccessibleLesson,hasUnlockedN4,resolveView} from '../src/entities/study/index.js';
import {CURRICULUM} from '../src/entities/study/index.js';
import { CORE_SKILLS, gradeAssessment } from '../src/entities/study/index.js';
import { N5_CURRICULUM, validateN5Curriculum } from '../src/entities/study/index.js';
import {
  N5_CERTIFICATION_POLICY, N5_REQUIRED_COMPETENCIES, buildN5CertificationExam, n5ReleaseReadiness,
  hasPassedInternalN5, hasCompletedN5Foundations, recordN5Result,
} from '../src/entities/study/index.js';
const passFoundation=s=>{for(const u of N5_UNITS)s.checkpoints[u.id]={score:80,date:'2026-10-13'};};
const approvedItem=(skill,n)=>({
  id:`n5-${skill}-${n}`, level:'N5', skill, competencyId:N5_REQUIRED_COMPETENCIES[skill][n % N5_REQUIRED_COMPETENCIES[skill].length],
  status:'approved', prompt:`Question ${n}`, choices:['A','B','C','D'],answerIndex:0,
  explanation:'A é a resposta correta.',
  provenance:{sourceId:'original',license:'Original Kotonoha',attribution:'Equipe Kotonoha'},
  review:{author:'a',reviewer:'b',reviewedAt:'2026-10-13'},
  ...(skill==='listening'?{audio:{path:`/audio/n5/${n}.mp3`,license:'Original Kotonoha'}}:{}),
});
const bank=()=>CORE_SKILLS.flatMap(skill=>Array.from({length:20},(_,i)=>approvedItem(skill,i)));

test('curriculum has explicit N5 communication and literacy outcomes',()=>{
  assert.deepEqual(validateN5Curriculum(),[]);
  assert.ok(N5_CURRICULUM.length>=10);
});
test('micro-checkpoints do not issue N5 certification or promote into N4',()=>{
  const s=initialState();passFoundation(s);
  assert.equal(hasCompletedN5Foundations(s),true);
  assert.equal(hasUnlockedN4(s),false);
  assert.equal(courseLevel(s),'N5');
  assert.equal(nextGuidedAction(s).kind,'assessment-pending');
  assert.equal(isAccessibleLesson(s,CURRICULUM.N4[0].id,'N4'),false);
  assert.deepEqual(resolveView('pitch',s),{view:'pitch',blocked:false});
});
test('n5 exam is never offered if listening bank lacks editorial rights and audio',()=>{
  const withoutAudio=bank().map(q=>q.skill==='listening'?{...q,audio:undefined}:q);
  const readiness=n5ReleaseReadiness(withoutAudio,initialState());
  assert.equal(readiness.examAvailable,false);
  assert.equal(readiness.bySkill.listening.missing,20);
  assert.equal(buildN5CertificationExam(withoutAudio,42).status,'insufficient_bank');
});
test('approved balanced exam grade can issue internal N5 result, never JLPT certificate',()=>{
  const s=initialState();passFoundation(s);
  const exam=buildN5CertificationExam(bank(),77);
  assert.equal(exam.status,'ready');
  assert.equal(exam.questions.length,80);
  const answers=Object.fromEntries(exam.questions.map(q=>[q.id,q.answerIndex]));
  const grade=gradeAssessment(exam,answers);
  assert.equal(recordN5Result(s,grade,exam),true);
  assert.equal(hasPassedInternalN5(s),true);
  assert.equal(hasUnlockedN4(s),true);
  assert.equal(courseLevel(s),'N4');
  assert.equal(isAccessibleLesson(s,CURRICULUM.N4[0].id,'N4'),true);
  const restored=normalizeState(JSON.parse(JSON.stringify(s)));
  assert.equal(hasPassedInternalN5(restored),true);
  assert.equal(restored.pedagogy.placement.officialJlptCertification,false);
});
test('a tiny old diagnostic score cannot masquerade as certification',()=>{
  const s=initialState();s.diagnosticHistory.push({level:'N5',correct:8,total:8,date:'2026-10-13'});
  s.pedagogy.assessmentHistory.push({level:'N5',status:'passed',kind:'kotonoha-internal',passed:true});
  assert.equal(hasUnlockedN4(s),false);
  assert.equal(courseLevel(s),'N5');
});
test('migration preserves v2 cards and checkpoints, adds separate empty certification state',()=>{
  const s=initialState();passFoundation(s);
  const old=structuredClone(s);delete old.pedagogy;
  const restored=normalizeState(old);
  assert.equal(restored.pedagogy.schemaVersion,1);
  assert.equal(hasCompletedN5Foundations(restored),true);
  assert.equal(hasUnlockedN4(restored),false);
});
test('unreviewed draft or mutated exam is rejected as a level result',()=>{
  const s=initialState();const exam=buildN5CertificationExam(bank(),7);
  const grade=gradeAssessment(exam,Object.fromEntries(exam.questions.map(q=>[q.id,q.answerIndex])));
  const tampered={...exam,questions:exam.questions.map((q,i)=>i===0?{...q,status:'draft'}:q)};
  assert.equal(recordN5Result(s,grade,tampered),false);
  assert.equal(hasUnlockedN4(s),false);
});

test('bank with 80 approved items but only one competency per skill does not certify',()=>{
  const incomplete=bank().map(item=>({...item,competencyId:N5_REQUIRED_COMPETENCIES[item.skill][0]}));
  const exam=buildN5CertificationExam(incomplete,28);
  assert.equal(exam.status,'insufficient_competency_coverage');
  assert.equal(exam.questions.length,0);
  assert.equal(n5ReleaseReadiness(incomplete).examAvailable,false);
});

test('certificação não aceita pontuação incompatível com a prova ou com as habilidades',()=>{
 const exam=buildN5CertificationExam(bank(),77);
 const grade=gradeAssessment(exam,Object.fromEntries(exam.questions.map(q=>[q.id,q.answerIndex])));
 const goodState=initialState();
 assert.equal(recordN5Result(goodState,grade,exam),true);
 const cases=[
  {...grade,total:100},
  {...grade,correct:81},
  {...grade,fraction:0.9},
  {...grade,level:'N4'},
  {...grade,bySkill:{...grade.bySkill,grammar:{...grade.bySkill.grammar,total:21}}},
  {...grade,bySkill:{...grade.bySkill,reading:{...grade.bySkill.reading,correct:19}}},
  {...grade,bySkill:{...grade.bySkill,listening:{...grade.bySkill.listening,fraction:0.6}}},
 ];
 for(const candidate of cases){
  const state=initialState();
  assert.equal(recordN5Result(state,candidate,exam),false);
  assert.equal(hasUnlockedN4(state),false);
 }
 for(const candidate of cases.filter(c=>c.level==='N5' && c.total>=80)){
  const historyState=initialState();
  historyState.pedagogy.assessmentHistory.push({...candidate,policyVersion:N5_CERTIFICATION_POLICY.version,
   competencyIds:Object.fromEntries(CORE_SKILLS.map(skill=>[skill,[...N5_REQUIRED_COMPETENCIES[skill]]])),
  });
  assert.equal(hasPassedInternalN5(historyState),false);
 }
});
