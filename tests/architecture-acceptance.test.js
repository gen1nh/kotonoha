import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState,normalizeState,selectReview,rateCard,SCHEMA_VERSION} from '../src/entities/study/index.js';
import {N5_UNITS,N5_TOPICS,unitsForTopic,cardIdsForUnit,unitAccessible,unitPassed,topicPassed,unitPracticed} from '../src/entities/study/index.js';
import {nextGuidedAction,courseLevel} from '../src/entities/study/index.js';
import {checkpointQuestions,checkpointScore,checkpointPassed} from '../src/entities/study/index.js';
import {isAccessibleCheckpoint,hasUnlockedN4} from '../src/entities/study/index.js';
import {collectActivityChanges,dailyActivityCount,recordActivity} from '../src/entities/study/index.js';
const DAY='2026-10-13';
const pass=(state,unit)=>{state.checkpoints[unit.id]={score:100,date:DAY};};
test('N5 é decomposto em microlições pequenas, com todos os 46 kana cobertos uma vez',()=>{
 assert.ok(N5_UNITS.length>=20);
 assert.deepEqual([...new Set(N5_UNITS.map(u=>u.topic))],['hiragana','words','grammar','katakana','kanji','reading','listening']);
 for(const topic of ['hiragana','katakana']){
  const units=unitsForTopic(topic);
  assert.equal(units.filter(u=>u.index<8).reduce((sum,u)=>sum+u.items.length,0),46);
  assert.ok(units.reduce((sum,u)=>sum+u.items.length,0)>46);
  assert.ok(units.every(u=>u.items.length<=6&&u.items.length>=4));
 }
});
test('uma única próxima ação e microlição bloqueada até aprovação real',()=>{
 const s=initialState(),first=N5_UNITS[0],second=N5_UNITS[1];
 assert.equal(nextGuidedAction(s).lesson.id,first.id);
 assert.equal(unitAccessible(s,first.id),true);
 assert.equal(unitAccessible(s,second.id),false);
 for(const id of cardIdsForUnit(first))s.cards[id].seen=true;
 assert.equal(unitPracticed(s,first.id),true);
 assert.equal(nextGuidedAction(s).kind,'checkpoint');
 assert.equal(isAccessibleCheckpoint(s,first.id),true);
 assert.equal(unitAccessible(s,second.id),false);
 pass(s,first);assert.equal(nextGuidedAction(s).lesson.id,second.id);
 assert.equal(unitAccessible(s,second.id),true);
});
test('gramática exige prática por tópico, sem completar os cinco de uma vez',()=>{
 const s=initialState();const grammar=unitsForTopic('grammar');
 s.lessons[grammar[0].id]=true;
 assert.equal(unitPracticed(s,grammar[0].id),true);
 assert.equal(unitPracticed(s,grammar[1].id),false);
 assert.equal(topicPassed(s,'grammar'),false);
});
test('checkpoints variam por tentativa e salvam resultado com seed reproduzível',()=>{
 const s=initialState(),u=N5_UNITS[0];
 const a=checkpointQuestions(s,u.id,5,0),b=checkpointQuestions(s,u.id,5,1);
 assert.deepEqual(checkpointQuestions(s,u.id,5,0),a);
 assert.notDeepEqual(a.map(q=>q.id),b.map(q=>q.id));
 assert.equal(checkpointScore(a,Object.fromEntries(a.map(q=>[q.id,q.answer]))),100);
 assert.equal(checkpointScore(a,{}),null);
});
test('microcheckpoint persiste em v2 e backup v1 mantém aprovação antiga',()=>{
 const s=initialState();pass(s,N5_UNITS[0]);s.drafts['checkpoint:hiragana:1']={answers:{'hira:か':'ka'},result:null};s.attempts['checkpoint:hiragana:1']=2;
 const copy=normalizeState(JSON.parse(JSON.stringify(s)));
 assert.equal(copy.schemaVersion,SCHEMA_VERSION);
 assert.equal(unitPassed(copy,N5_UNITS[0].id),true);
 assert.equal(copy.drafts['checkpoint:hiragana:1'].answers['hira:か'],'ka');
 assert.equal(copy.attempts['checkpoint:hiragana:1'],2);
 const old=structuredClone(s);delete old.schemaVersion;old.checkpoints={hiragana:{score:80,date:DAY}};
 const restored=normalizeState(old);
 assert.ok(unitsForTopic('hiragana').filter(u=>u.index<8).every(u=>unitPassed(restored,u.id)));
 assert.ok(unitsForTopic('hiragana').filter(u=>u.index>=8).every(u=>!unitPassed(restored,u.id)));
 assert.equal(topicPassed(restored,'hiragana'),false);
});
test('N4 exige prova interna; checkpoints N5 sozinhos não certificam',()=>{
 const s=initialState();s.selectedLevel='N1';assert.equal(courseLevel(s),'N5');assert.equal(hasUnlockedN4(s),false);
 for(const u of N5_UNITS)pass(s,u);
 assert.equal(hasUnlockedN4(s),false);assert.equal(courseLevel(s),'N5');
 assert.ok(N5_TOPICS.every(topic=>topicPassed(s,topic)));
});
test('cartão pessoal novo entra em fila geral e fila nunca passa de dez',()=>{
 const s=initialState();s.cards['custom:myword']={id:'custom:myword',type:'Caderno Pessoal',prompt:'猫',answer:'gato',seen:false,reps:0,interval:0,ease:2.5,due:0};
 assert.ok(selectReview(s).includes('custom:myword'));
 for(const card of Object.values(s.cards)){card.seen=true;card.due=1;}
 assert.ok(selectReview(s).length<=10);
});
test('avaliação de flashcard errada não cria meta ou streak automaticamente',()=>{
 const s=initialState();rateCard(s,'hira:あ','again');
 assert.equal(s.stats.reviews,1);
 assert.equal(s.streak.days,0);
 assert.equal(dailyActivityCount(s,DAY),0);
});
test('sessão de revisão contabiliza só uma atividade, não cada cartão',()=>{
 const s=initialState();recordActivity(s,'review',DAY);recordActivity(s,'review',DAY);
 assert.equal(dailyActivityCount(s,DAY),1);
});
test('backup com versões futuras e tentativas malformadas é tratado sem perder dados originais',()=>{
 const s=initialState();assert.throws(()=>normalizeState({...s,schemaVersion:999}),/incompatível/);
 s.attempts={'checkpoint:hiragana:0':3,'nonsense':NaN};s.drafts={'checkpoint:hiragana:0':{answers:{'hira:あ':'a'},result:null},'evil':{answers:{},result:null}};
 const clean=normalizeState(s);assert.equal(clean.attempts['checkpoint:hiragana:0'],3);assert.equal(clean.attempts.nonsense,undefined);assert.equal(clean.drafts.evil,undefined);
});
test('meta diária contabiliza aprovação de microlição sem inflar segunda tentativa',()=>{
 const a=initialState(),b=structuredClone(a),u=N5_UNITS[0];pass(b,u);collectActivityChanges(a,b,DAY);
 assert.equal(dailyActivityCount(b,DAY),1);
 const c=structuredClone(b);c.checkpoints[u.id].score=80;collectActivityChanges(b,c,DAY);
 assert.equal(dailyActivityCount(c,DAY),1);
});
