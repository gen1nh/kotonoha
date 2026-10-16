import { HOME_QUESTION } from './curriculum.js';
import { N5_UNITS, unitPassed } from './courseUnits.js';
import { checkpointQuestions } from './checkpoints.js';

/** Build a deterministic daily challenge from material actually passed.
 * Questions expand as the learner progresses. No API, login or backend required.
 */
export function dailyChallenge(state,level='N5',date=new Date()){
 if(level!=='N5')return null; // Other levels have no fully reviewed daily bank yet.
 const completed=N5_UNITS.filter(unit=>unitPassed(state,unit.id));
 if(!completed.length)return null;
 // Use recent mastered units rather than selecting arbitrary future material.
 const recent=completed.slice(-Math.min(10,completed.length));
 const bank=recent.flatMap(unit=>checkpointQuestions(state,unit.id,5,0))
   .filter(q=>q.options?.length>=3&&q.options.includes(q.answer));
 if(!bank.length)return null;
 const start=new Date(date.getFullYear(),0,0);
 const day=Math.floor((new Date(date.getFullYear(),date.getMonth(),date.getDate())-start)/86400000);
 const question=bank[(day+Math.floor(day/Math.max(1,bank.length)))%bank.length];
 return {id:question.id,skill:'Conteúdo já aprendido',prompt:question.prompt,
   sentence:question.text||question.spokenText||'',choices:question.options,
   answer:question.options.indexOf(question.answer),explanation:question.explanation||'Veja a explicação na lição.'};
}
