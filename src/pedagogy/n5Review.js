/** Personal N5 capstone review. A formative assessment from the material taught
 * in the course. It NEVER grants JLPT credentials or unlocks N4. */
import {VOCAB,GRAMMAR} from '../data.js';
import {N5_READING_TASKS} from '../content/n5Reading.js';
import {N5_LISTENING_TASKS} from '../content/n5Listening.js';
export const PERSONAL_N5_SKILLS=Object.freeze(['vocabulary','grammar','reading','listening']);
export const PERSONAL_N5_PER_SKILL=8;
function shuffle(array,seed){
 const a=[...array];let n=(Number(seed)||1)>>>0;
 for(let i=a.length-1;i>0;i--){n=(Math.imul(1664525,n)+1013904223)>>>0;const j=n%(i+1);[a[i],a[j]]=[a[j],a[i]];}return a;
}
function options(correct,pool,seed){
 const wrong=shuffle(pool.filter(x=>x!==correct),seed).filter((x,i,a)=>a.indexOf(x)===i).slice(0,3);
 if(wrong.length!==3)throw new Error('Insufficient distinct answer choices');
 return shuffle([correct,...wrong],seed+117);
}
export function buildN5PersonalReview(seed=42){
 if(!Number.isInteger(seed)||seed<=0)throw new Error('Invalid personal review seed');
 const vocab=shuffle(VOCAB.filter(row=>row[3]&&row[0]),seed).slice(0,PERSONAL_N5_PER_SKILL).map((word,i)=>({
  id:`personal-v-${word[0]}`,skill:'vocabulary',prompt:`Qual o sentido de ${word[0]}?`,
  text:word[0],correct:word[3],options:options(word[3],VOCAB.map(row=>row[3]),seed+i),
  explanation:`${word[0]} (${word[1]}) — ${word[3]}.`,
 }));
 const grammar=shuffle(GRAMMAR,seed+173).slice(0,PERSONAL_N5_PER_SKILL).map((item,i)=>({
  id:`personal-g-${GRAMMAR.indexOf(item)}`,skill:'grammar',prompt:'Qual é o sentido mais adequado desta frase?',
  text:item.example,correct:item.meaning,options:options(item.meaning,GRAMMAR.map(row=>row.meaning),seed+i+1200),
  explanation:item.text,
 }));
 const reading=shuffle(N5_READING_TASKS,seed+386).slice(0,PERSONAL_N5_PER_SKILL).map((item,i)=>({
  id:`personal-r-${item.id}`,skill:'reading',prompt:item.prompt,text:item.text,
  correct:item.choices[item.answerIndex],options:shuffle(item.choices,seed+i+2500),explanation:item.explanation,
 }));
 const listening=shuffle(N5_LISTENING_TASKS,seed+496).slice(0,PERSONAL_N5_PER_SKILL).map((item,i)=>({
  id:`personal-l-${item.id}`,skill:'listening',prompt:item.prompt,context:item.context,spokenText:item.spokenText,
  correct:item.choices[item.answerIndex],options:shuffle(item.choices,seed+i+3700),explanation:item.explanation,
 }));
 return [...vocab,...grammar,...reading,...listening];
}
export function gradeN5PersonalReview(questions,answers={},played=[],transcripts=[]){
 if(!Array.isArray(questions)||questions.length!==PERSONAL_N5_PER_SKILL*PERSONAL_N5_SKILLS.length||
    questions.some(q=>typeof answers[q.id]!=='string'||!q.options.includes(answers[q.id])))return {status:'incomplete'};
 const bySkill=Object.fromEntries(PERSONAL_N5_SKILLS.map(skill=>{
  const items=questions.filter(q=>q.skill===skill);
  return [skill,{correct:items.filter(q=>answers[q.id]===q.correct).length,total:items.length}];
 }));
 const correct=Object.values(bySkill).reduce((n,s)=>n+s.correct,0);
 const listeningItems=questions.filter(q=>q.skill==='listening');
 const audioEvidence=listeningItems.every(q=>played.includes(q.id)&&!transcripts.includes(q.id));
 const strong=correct>=Math.ceil(questions.length*.8)&&Object.values(bySkill).every(x=>x.correct/x.total>=.6);
 return {status:'practice-reviewed',kind:'kotonoha-n5-formative',level:'N5',total:questions.length,correct,bySkill,
  practiceMastery:strong,audioEvidence,certificationEligible:false,unlocksN4:false,officialJlptCertification:false};
}
