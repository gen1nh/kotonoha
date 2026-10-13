import test from 'node:test';
import assert from 'node:assert/strict';
import {VOCAB,GRAMMAR,HIRAGANA,KATAKANA} from '../src/data.js';
import {HIRAGANA_EXTENSIONS,KATAKANA_EXTENSIONS} from '../src/content/n5Kana.js';
import {N5_READING_TASKS} from '../src/content/n5Reading.js';
import {N5_LISTENING_TASKS} from '../src/content/n5Listening.js';
import {N5_KANJI} from '../src/content/n5Kanji.js';
import {kanaToRomaji} from '../src/content/n5Words.js';
import {N5_UNITS,N5_TOPICS,LEGACY_N5_UNIT_COUNTS,unitsForTopic,unitPassed,unitAccessible,unitPracticed,topicPassed,cardIdsForUnit} from '../src/courseUnits.js';
import {checkpointQuestions,checkpointScore} from '../src/checkpoints.js';
import {initialState,normalizeState,cardMatchesLevel} from '../src/state.js';
import {hasPassedInternalN5,hasCompletedN5Foundations,hasCompletedN5Basics} from '../src/pedagogy/readiness.js';
import {hasUnlockedN4} from '../src/routeAccess.js';
import {buildN5PersonalReview,gradeN5PersonalReview} from '../src/pedagogy/n5Review.js';

test('N5 personal course has real coverage across seven topics without duplicating words or kanji',()=>{
 assert.deepEqual(N5_TOPICS,['hiragana','katakana','words','kanji','grammar','reading','listening']);
 assert.ok(N5_UNITS.length>150);
 assert.ok(VOCAB.length>=500);
 assert.equal(new Set(VOCAB.map(word=>word[0])).size,VOCAB.length);
 assert.ok(GRAMMAR.length>=40);
 assert.ok(N5_KANJI.length>=80);
 assert.equal(new Set(N5_KANJI.map(k=>k.glyph)).size,N5_KANJI.length);
 assert.equal(N5_READING_TASKS.length,25);
 assert.equal(N5_LISTENING_TASKS.length,40);
});

test('basic kana remain exactly 46 and expanded reading has distinct voiced/yoon forms',()=>{
 assert.equal(HIRAGANA.length,46);assert.equal(KATAKANA.length,46);
 assert.ok(HIRAGANA_EXTENSIONS.length>=55);
 assert.ok(KATAKANA_EXTENSIONS.length>=55);
 assert.equal(new Set([...HIRAGANA,...HIRAGANA_EXTENSIONS].map(x=>x[0])).size,46+HIRAGANA_EXTENSIONS.length);
 assert.equal(kanaToRomaji('がっこう'),'gakkou');
 assert.equal(kanaToRomaji('しゅくだい'),'shukudai');
 assert.equal(kanaToRomaji('コーヒー'),'koohii');
 assert.equal(kanaToRomaji('フォーク'),'fooku');
});

test('all micro-lessons have answerable checkpoints and their source cards exist',()=>{
 const s=initialState();assert.equal(new Set(N5_UNITS.map(u=>u.id)).size,N5_UNITS.length);
 for(const unit of N5_UNITS){
  assert.ok(['kana','vocabulary','kanji','grammar','reading','listening'].includes(unit.kind));
  for(const id of cardIdsForUnit(unit))assert.ok(s.cards[id],`${unit.id}: missing ${id}`);
  const questions=checkpointQuestions(s,unit.id,5,0);
  assert.ok(questions.length>=4,`${unit.id} has ${questions.length} questions`);
  assert.equal(checkpointScore(questions,Object.fromEntries(questions.map(q=>[q.id,q.answer]))),100);
  for(const q of questions){
   assert.equal(q.options.length,4,`options in ${q.id}`);
   assert.equal(new Set(q.options).size,4,`unique answers in ${q.id}`);
   assert.ok(q.options.includes(q.answer));
  }
 }
});

test('new units do not inherit old topic checkpoints, but all legacy units retain their approval',()=>{
 const s=initialState();for(const topic of Object.keys(LEGACY_N5_UNIT_COUNTS))s.checkpoints[topic]={score:80,date:'2026-10-13'};
 const restored=normalizeState(JSON.parse(JSON.stringify(s)));
 for(const [topic,count] of Object.entries(LEGACY_N5_UNIT_COUNTS)){
  assert.ok(unitsForTopic(topic).filter(u=>u.index<count).every(u=>unitPassed(restored,u.id)));
  assert.ok(unitsForTopic(topic).filter(u=>u.index>=count).every(u=>!unitPassed(restored,u.id)));
  assert.equal(topicPassed(restored,topic),false);
 }
 assert.equal(hasCompletedN5Basics(restored),true);
 assert.equal(hasCompletedN5Foundations(restored),false);
 assert.equal(hasUnlockedN4(restored),false);
});

test('reading and listening have independent study/checkpoint controls and readable text',()=>{
 const s=initialState();
 for(const topic of ['reading','listening']){
  const unit=unitsForTopic(topic)[0];
  assert.equal(unitPracticed(s,unit.id),false);
  s.lessons[unit.id]=true;
  assert.equal(unitPracticed(s,unit.id),true);
  const questions=checkpointQuestions(s,unit.id);
  assert.equal(questions.length,5);
  assert.ok(questions.every(q=>topic==='reading'?q.text&&!q.spokenText:q.spokenText&&!q.text));
 }
});

test('kanji are taught with context and are added to the existing SRS queue',()=>{
 const s=initialState();const first=unitsForTopic('kanji')[0];
 for(const item of first.items){
  assert.ok(item.example.includes(item.glyph));
  const id=`kanji:${item.glyph}`;
  assert.ok(cardMatchesLevel(s.cards[id],'N5'));
  assert.ok(s.cards[id].spoken);
 }
});

test('personal N5 review balances four skills and changes with the seed',()=>{
 const a=buildN5PersonalReview(100),b=buildN5PersonalReview(101);
 assert.equal(a.length,32);
 assert.equal(new Set(a.map(q=>q.id)).size,a.length);
 assert.deepEqual(buildN5PersonalReview(100),a);
 assert.notDeepEqual(a.map(q=>q.id),b.map(q=>q.id));
 for(const skill of ['vocabulary','grammar','reading','listening'])assert.equal(a.filter(q=>q.skill===skill).length,8);
 assert.ok(a.every(q=>q.options.length===4&&new Set(q.options).size===4&&q.options.includes(q.correct)));
});

test('personal review is not JLPT certification and cannot unlock N4 even with perfect answers',()=>{
 const q=buildN5PersonalReview(180);
 const answers=Object.fromEntries(q.map(x=>[x.id,x.correct]));
 const heard=q.filter(x=>x.skill==='listening').map(x=>x.id);
 const grade=gradeN5PersonalReview(q,answers,heard,[]);
 assert.equal(grade.status,'practice-reviewed');
 assert.equal(grade.practiceMastery,true);assert.equal(grade.audioEvidence,true);
 assert.equal(grade.certificationEligible,false);assert.equal(grade.unlocksN4,false);
 const s=initialState();s.n5Practice.history=[{...grade,date:new Date().toISOString()}];
 const restored=normalizeState(JSON.parse(JSON.stringify(s)));
 assert.equal(restored.n5Practice.history[0].correct,32);
 assert.equal(hasPassedInternalN5(restored),false);
 assert.equal(hasUnlockedN4(restored),false);
});

test('revealing the Japanese transcript downgrades the audio evidence',()=>{
 const q=buildN5PersonalReview(20),answers=Object.fromEntries(q.map(x=>[x.id,x.correct]));
 const heard=q.filter(x=>x.skill==='listening').map(x=>x.id);
 assert.equal(gradeN5PersonalReview(q,answers,heard,[heard[0]]).audioEvidence,false);
 assert.equal(gradeN5PersonalReview(q,answers,[],[]).audioEvidence,false);
 assert.equal(gradeN5PersonalReview(q,{},[],[]).status,'incomplete');
});

test('unfinished personal review resumes from backup without modifying certification history',()=>{
 const s=initialState(),q=buildN5PersonalReview(123);
 s.n5Practice.seed=123;s.n5Practice.answers[q[0].id]=q[0].options[1];
 s.n5Practice.played=[q.find(x=>x.skill==='listening').id];
 const restored=normalizeState(JSON.parse(JSON.stringify(s)));
 assert.equal(restored.n5Practice.seed,123);
 assert.equal(restored.n5Practice.answers[q[0].id],q[0].options[1]);
 assert.equal(restored.n5Practice.played.length,1);
 assert.deepEqual(restored.pedagogy.assessmentHistory,[]);
});


test('listening includes unambiguous ten-minute reading and introductory post-class phrasing',()=>{
 const ten=N5_LISTENING_TASKS.find(q=>q.context==='Passeio');
 const after=N5_LISTENING_TASKS.find(q=>q.context==='Após a escola');
 const homework=N5_LISTENING_TASKS.find(q=>q.context==='Na escola');
 assert.match(ten.spokenText,/10分かかります/);
 assert.match(after.spokenText,/授業のあとで/);
 assert.match(homework.spokenText,/金曜日に宿題を出してください/);
});
