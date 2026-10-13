/** Structural course audit only, NOT a language review or JLPT certification. */
import {VOCAB,GRAMMAR,HIRAGANA,KATAKANA} from '../src/data.js';
import {HIRAGANA_EXTENSIONS,KATAKANA_EXTENSIONS} from '../src/content/n5Kana.js';
import {N5_KANJI} from '../src/content/n5Kanji.js';
import {N5_READING_TASKS} from '../src/content/n5Reading.js';
import {N5_LISTENING_TASKS} from '../src/content/n5Listening.js';
import {N5_UNITS,N5_TOPICS,cardIdsForUnit} from '../src/courseUnits.js';
import {initialState,normalizeState} from '../src/state.js';
import {checkpointQuestions} from '../src/checkpoints.js';
import {buildN5PersonalReview,gradeN5PersonalReview} from '../src/pedagogy/n5Review.js';
import {n5ReleaseReadiness} from '../src/pedagogy/readiness.js';
import {APPROVED_EXAM_ITEMS} from '../src/pedagogy/publishedItems.js';
const state=initialState(),errors=[];
const unique=(items,label)=>{const bad=items.filter((x,i)=>items.indexOf(x)!==i);if(bad.length)errors.push(`${label}: duplicated ${[...new Set(bad)].slice(0,5).join(', ')}`);};
const minimum=(label,n,min)=>{if(n<min)errors.push(`${label}: ${n}/${min}`);};
minimum('basic hiragana',HIRAGANA.length,46);minimum('basic katakana',KATAKANA.length,46);
minimum('extra hiragana',HIRAGANA_EXTENSIONS.length,50);minimum('extra katakana',KATAKANA_EXTENSIONS.length,50);
minimum('vocabulary',VOCAB.length,500);minimum('kanji',N5_KANJI.length,80);
minimum('grammar',GRAMMAR.length,35);minimum('reading',N5_READING_TASKS.length,25);minimum('listening',N5_LISTENING_TASKS.length,40);
unique(VOCAB.map(w=>w[0]),'vocabulary');unique(N5_UNITS.map(u=>u.id),'micro-lessons');unique(N5_KANJI.map(k=>k.glyph),'kanji');
const rowCheck=(items,label,makeId)=>{
 for(const item of items){if(!item.prompt||!item.explanation||!Array.isArray(item.choices)||item.choices.length!==4||new Set(item.choices).size!==4||!item.choices[item.answerIndex])errors.push(`${label}: invalid activity ${makeId(item)}`);}
};
rowCheck(N5_READING_TASKS,'reading',x=>x.id);rowCheck(N5_LISTENING_TASKS,'listening',x=>x.id);
for(const unit of N5_UNITS){
 if(!N5_TOPICS.includes(unit.topic))errors.push(`unknown unit topic: ${unit.id}`);
 if(['kana','vocabulary','kanji'].includes(unit.kind)) for(const id of cardIdsForUnit(unit))if(!state.cards[id])errors.push(`missing flashcard: ${id}`);
 const questions=checkpointQuestions(state,unit.id);if(questions.length<4)errors.push(`unit without >=4 checkpoint questions: ${unit.id}`);
 for(const q of questions)if(q.options.length!==4||new Set(q.options).size!==4||!q.options.includes(q.answer))errors.push(`broken multiple choice: ${q.id}`);
}
const review=buildN5PersonalReview(12345);
if(review.length!==32||new Set(review.map(q=>q.id)).size!==32||review.some(q=>q.options.length!==4||new Set(q.options).size!==4))errors.push('personal review corrupted');
const result=gradeN5PersonalReview(review,Object.fromEntries(review.map(q=>[q.id,q.correct])),review.filter(q=>q.skill==='listening').map(q=>q.id));
if(result.status!=='practice-reviewed'||!result.practiceMastery||result.certificationEligible||result.unlocksN4)errors.push('personal review may leak certification');
const old=initialState();old.cards['hira:あ'].seen=true;old.checkpoints.hiragana={score:80,date:'2026-10-13'};
const restored=normalizeState(JSON.parse(JSON.stringify(old)));
if(!restored.cards['hira:あ'].seen||restored.checkpoints.hiragana.score!==80)errors.push('backup migration lost legacy progress');
const certification=n5ReleaseReadiness(APPROVED_EXAM_ITEMS);
if(certification.examAvailable)errors.push('unreviewed exam unexpectedly open');
const report={audit:'N5 personal course structural coverage',status:errors.length?'FAILED':'PASS',techCoverageReady:errors.length===0,
 linguisticReviewCompleted:false,officialJlptCertification:false,certificationExamAvailable:false,
 metrics:{units:N5_UNITS.length,topics:N5_TOPICS.length,vocabulary:VOCAB.length,kanji:N5_KANJI.length,
 grammar:GRAMMAR.length,reading:N5_READING_TASKS.length,listening:N5_LISTENING_TASKS.length,
 hiraganaBase:HIRAGANA.length,katakanaBase:KATAKANA.length,kanaExtensions:HIRAGANA_EXTENSIONS.length+KATAKANA_EXTENSIONS.length,
 flashcards:Object.keys(state.cards).length,personalReviewQuestions:review.length},errors};
console.log(JSON.stringify(report,null,2));if(errors.length)process.exitCode=1;
