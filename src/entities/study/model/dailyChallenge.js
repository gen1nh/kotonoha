import { N5_UNITS, unitPassed } from './courseUnits.js';
import { todayKey } from './state.js';
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
 const makeBank=units=>units.flatMap(unit=>checkpointQuestions(state,unit.id,5,0))
   .filter(q=>q.options?.length>=3&&q.options.includes(q.answer));
 const bank=makeBank(recent);
 if(!bank.length)return null;
 const key=`${todayKey(date)}:${level}`;
 const pinned=state.dailyQuestionIds?.[key];
 const saved=pinned && (bank.find(q=>q.id===pinned)||makeBank(completed).find(q=>q.id===pinned));
 const day=Math.floor(Date.UTC(date.getFullYear(),date.getMonth(),date.getDate())/86400000);
 const question=saved||bank[day%bank.length];
 return {id:question.id,skill:'Conteúdo já aprendido',prompt:question.prompt,
   sentence:question.text||question.spokenText||'',choices:question.options,
   answer:question.options.indexOf(question.answer),explanation:question.explanation||'Veja a explicação na lição.'};
}
