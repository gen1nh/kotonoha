/** Generate a reproducible REVIEW QUEUE, not a claim of linguistic correctness.
 * Non-destructive: never writes back to the authored N5 bank or learner data.
 * Usage: npm run editorial:prerequisites [-- --write]
 */
import fs from 'node:fs';
import {N5_STAGES,N5_UNITS,initialState,checkpointQuestions} from '../src/entities/study/index.js';

const stageById=new Map(N5_STAGES.flatMap(stage=>stage.units.map(unit=>[unit.id,stage])));
const state=initialState();
const published=fs.existsSync('data/editorial/n5-course-review.json')
 ?JSON.parse(fs.readFileSync('data/editorial/n5-course-review.json','utf8')):null;
const reviewed=new Map((published?.units||[]).map(unit=>[unit.id,unit]));
const queueFile='data/editorial/n5-prerequisite-review.json';
const existingQueue=fs.existsSync(queueFile)
 ?JSON.parse(fs.readFileSync(queueFile,'utf8')):null;
const noJapanese=/[^\u3040-\u30ff\u3400-\u9fff]/g;
const candidates=N5_UNITS.map((unit,index)=>{
 const content=JSON.stringify(unit.items);
 const stage=stageById.get(unit.id);
 const questions=checkpointQuestions(state,unit.id);
 const previous=N5_UNITS.slice(0,index);
 const earlierGrammar=previous.filter(item=>item.kind==='grammar').slice(-6);
 const editorial=reviewed.get(unit.id);
 const gaps=[];
 if(!editorial)gaps.push('Unidade sem registro no pacote editorial');
 if(!unit.detail?.trim())gaps.push('Objetivo da unidade não descrito');
 if(questions.length<4)gaps.push('Menos de quatro questões');
 for(const question of questions){
  if(!question.explanation?.trim())gaps.push('Explicação ausente: '+question.id);
  if(new Set(question.options||[]).size!==4)gaps.push('Alternativas repetidas: '+question.id);
  if(!(question.options||[]).includes(question.answer))gaps.push('Gabarito não corresponde às alternativas: '+question.id);
 }
 return {
  id:unit.id,
  stage:stage?.id||'unknown',
  title:unit.title,
  modality:unit.kind,
  accessPrerequisiteId:previous.at(-1)?.id||null,
  suggestedGrammarContext:earlierGrammar.map(item=>({id:item.id,title:item.title})),
  // A Unicode count is ONLY a quick triage indicator, not a language analysis.
  japaneseCharactersCount:[...content.replace(noJapanese,'')].length,
  questionCount:questions.length,
  structuralFlags:[...new Set(gaps)],
  languageReview:{status:'pending',grammarDependencies:[],vocabularyDependencies:[],kanaOrKanjiDependencies:[],accuracyNotes:'',reviewer:null,reviewedAt:null},
 };
});
if(candidates.length!==220 || new Set(candidates.map(item=>item.id)).size!==220)throw new Error('Incomplete/duplicate N5 course review queue');
const open=candidates.filter(x=>x.structuralFlags.length);
// Count human records without assuming that their judgments are correct.
const expectedIds=new Set(candidates.map(item=>item.id));
const recordedUnits=existingQueue?.units||[];
if(existingQueue && (!Array.isArray(recordedUnits) ||
 new Set(recordedUnits.map(item=>item.id)).size!==recordedUnits.length ||
 recordedUnits.some(item=>!expectedIds.has(item.id)))) {
 throw new Error('Existing editorial queue has duplicate or unknown unit IDs');
}
const humanReviews=recordedUnits.filter(item=>
 item.languageReview?.status==='reviewed' &&
 typeof item.languageReview.reviewer==='string' &&
 item.languageReview.reviewer.trim() &&
 typeof item.languageReview.reviewedAt==='string' &&
 item.languageReview.reviewedAt.trim()
);
const completedIds=new Set(humanReviews.map(item=>item.id));
const report={
 type:'n5-linguistic-prerequisite-review',
 version:1,
 note:'Candidate prerequisites and structural triage only. No automatic grammatical approval.',
 totalUnits:candidates.length,
 stageSummary:N5_STAGES.map(stage=>({stage:stage.id,total:stage.units.length,recordedReviews:stage.units.filter(unit=>completedIds.has(unit.id)).length})),
 structuralFlags:open.map(({id,structuralFlags})=>({id,structuralFlags})),
 humanReviewsRecorded:humanReviews.length,
 certificationEligible:false,
 units:candidates,
};
if(process.argv.includes('--write')){
 if(existingQueue)throw new Error('Review file already exists. Do not overwrite human notes.');
 fs.writeFileSync(queueFile,JSON.stringify(report,null,2)+'\n');
 console.log('Created '+queueFile);
}
console.log(JSON.stringify({units:report.totalUnits,stages:report.stageSummary,
 structurallyFlagged:open.length,humanReviewsRecorded:humanReviews.length,
 pendingHumanReviews:report.totalUnits-humanReviews.length,
 certificationEligible:false},null,2));
if(open.length)process.exitCode=1;
