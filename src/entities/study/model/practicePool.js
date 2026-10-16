/** Optional speed practice may only ask about items encountered in lessons.
 * Avoid repetition until the available pool is exhausted; no remote database needed.
 */
export function speedPracticePool(state,mode='all'){
 const types=mode==='hiragana'?['Hiragana']:mode==='katakana'?['Katakana']:
   mode==='vocab'?['Vocabulário N5']:['Hiragana','Katakana','Vocabulário N5'];
 return Object.values(state?.cards||{}).filter(card=>card.seen===true&&types.includes(card.type)&&card.prompt&&card.answer)
   .map(card=>({id:card.id,prompt:card.prompt,answer:card.answer,hint:card.type,
     spoken:card.spoken||card.reading||card.prompt}));
}
export function speedPracticeQuestion(pool,used=[],random=Math.random){
 const candidates=pool.filter(item=>pool.filter(row=>row.answer===item.answer).length===1);
 if(new Set(candidates.map(c=>c.answer)).size<4)return null;
 const remaining=candidates.filter(item=>!used.includes(item.id));
 const available=remaining.length?remaining:candidates;
 const target=available[Math.floor(random()*available.length)];
 const others=candidates.filter(item=>item.id!==target.id&&item.answer!==target.answer);
 const picked=[];
 while(picked.length<3){
  const candidate=others[Math.floor(random()*others.length)].answer;
  if(!picked.includes(candidate))picked.push(candidate);
 }
 const choices=[target.answer,...picked];
 for(let i=choices.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[choices[i],choices[j]]=[choices[j],choices[i]];}
 return {...target,choices};
}
