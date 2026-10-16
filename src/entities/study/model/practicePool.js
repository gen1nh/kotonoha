import {N5_UNITS,unitPracticed} from './courseUnits.js';
/** Optional speed practice may only ask about items encountered in lessons.
 * Avoid repetition until the available pool is exhausted; no remote database needed.
 */
export function speedPracticePool(state,mode='all'){
 const types=mode==='hiragana'?['Hiragana']:mode==='katakana'?['Katakana']:
   mode==='vocab'?['Vocabulário N5']:['Hiragana','Katakana','Vocabulário N5'];
 return Object.values(state?.cards||{}).filter(card=>card.seen===true&&types.includes(card.type)&&card.prompt&&card.answer)
   .map(card=>({id:card.id,prompt:card.prompt,answer:card.answer,hint:card.type,
     spoken:card.spoken||card.reading||card.prompt}))
   // In mixed mode, kana from two alphabets can share a romaji answer.
   // Keep one representative per answer so distractors remain distinct.
   .filter((item,index,all)=>all.findIndex(other=>other.answer===item.answer)===index);
}
export function speedPracticeQuestion(pool,used=[],random=Math.random){
 const candidates=pool.filter(item=>pool.filter(row=>row.answer===item.answer).length===1);
 if(new Set(candidates.map(c=>c.answer)).size<4)return null;
 const remaining=candidates.filter(item=>!used.includes(item.id));
 const available=remaining.length?remaining:candidates;
 const target=available[Math.floor(random()*available.length)];
 const others=candidates.filter(item=>item.id!==target.id&&item.answer!==target.answer).map(item=>item.answer);
 // Fisher-Yates: guaranteed termination and distinct distractors.
 for(let i=others.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[others[i],others[j]]=[others[j],others[i]];}
 const choices=[target.answer,...others.slice(0,3)];
 for(let i=choices.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[choices[i],choices[j]]=[choices[j],choices[i]];}
 return {...target,choices};
}

/** Progressive listening: first heard kana/words, then the authored listening
 * situations from lessons already practiced. Nothing from future N5 units.
 */
export function listeningPracticePool(state){
 const pool=speedPracticePool(state);
 const distinct=pool.filter(item=>pool.filter(other=>other.answer===item.answer).length===1);
 const heard=distinct.length<4?[]:distinct.map((item,index)=>{
  const distractors=distinct.filter(other=>other.answer!==item.answer);
  const wrong=Array.from({length:3},(_,offset)=>distractors[(index+offset)%distractors.length].answer);
  const position=index%4;
  const choices=[...wrong];choices.splice(position,0,item.answer);
  return {id:`heard:${item.id}`,context:item.hint,spokenText:item.spoken,
    prompt:item.hint==='Vocabulário N5'?'Qual palavra você ouviu?':'Qual som você ouviu?',
    choices,answerIndex:position,explanation:`${item.prompt} corresponde a ${item.answer}.`};
 });
 // The canonical authored listening course already contains much more than six samples.
 // Reuse that content only after the learner practices the relevant lesson.
 const learnedUnits=N5_UNITS.filter(unit=>unit.kind==='listening'&&unitPracticed(state,unit.id));
 const situations=learnedUnits.flatMap(unit=>unit.items);
 return [...heard,...situations];
}
