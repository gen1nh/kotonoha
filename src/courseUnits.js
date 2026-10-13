/** A única definição do percurso N5. Capítulos agrupam microlições de 4–6 itens.
 * IDs legados de capítulo são aceitos exclusivamente para preservar backups antigos.
 */
import {HIRAGANA,KATAKANA,VOCAB,GRAMMAR} from './data.js';

const partition=(items,size)=>Array.from({length:Math.ceil(items.length/size)},(_,i)=>items.slice(i*size,(i+1)*size));
const chapterNames={hiragana:'Hiragana',katakana:'Katakana',words:'Palavras essenciais',grammar:'Gramática básica'};
const build=(topic,items,size,kind)=>partition(items,size).map((part,index)=>({
  id:`${topic}:${index}`,topic,index,kind,level:'N5',items:part,
  title:topic==='grammar'?part[0].title:`${chapterNames[topic]} · ${index+1}/${Math.ceil(items.length/size)}`,
  detail:topic==='grammar'?'Aprenda a regra, ouça o exemplo e responda a prática.':`Aprenda ${part.length} ${topic==='words'?'palavras':'caracteres'} por vez, em vez de todos de uma vez.`,
}));
export const N5_UNITS=Object.freeze([
 ...build('hiragana',HIRAGANA,6,'kana'),
 ...build('katakana',KATAKANA,6,'kana'),
 ...build('words',VOCAB,5,'vocabulary'),
 ...build('grammar',GRAMMAR,1,'grammar'),
]);
export const N5_TOPICS=Object.freeze(Object.keys(chapterNames));
export const unitById=id=>N5_UNITS.find(unit=>unit.id===id)||null;
export const unitsForTopic=topic=>N5_UNITS.filter(unit=>unit.topic===topic);
export const cardIdsForUnit=unit=>!unit||unit.kind==='grammar'?[]:unit.items.map(row=>{
 const value=row[0];return unit.topic==='hiragana'?`hira:${value}`:unit.topic==='katakana'?`kata:${value}`:`vocab:${value}`;
});
/** A aprovação antiga de capítulo concede equivalência aos seus micro-passos (migração não destrutiva). */
export function unitPassed(state,id){
 const unit=unitById(id);
 if(!unit)return false;
 return Number(state.checkpoints?.[unit.topic]?.score)>=80 || Number(state.checkpoints?.[id]?.score)>=80;
}
export function topicPassed(state,topic){
 if(Number(state.checkpoints?.[topic]?.score)>=80)return true;
 const units=unitsForTopic(topic);
 return units.length>0&&units.every(unit=>unitPassed(state,unit.id));
}
export function unitAccessible(state,id){
 const index=N5_UNITS.findIndex(unit=>unit.id===id);
 return index>=0&&N5_UNITS.slice(0,index).every(unit=>unitPassed(state,unit.id));
}
export function unitPracticed(state,id){
 const unit=unitById(id);
 if(!unit)return false;
 if(unit.kind==='grammar')return state.lessons?.[id]===true || state.lessons?.grammar===true;
 const cards=cardIdsForUnit(unit);
 return cards.length>0&&cards.every(cardId=>state.cards?.[cardId]?.seen===true);
}
export function nextN5Unit(state){return N5_UNITS.find(unit=>!unitPassed(state,unit.id))||null;}
export function unitProgress(state,id){
 const unit=unitById(id);
 if(!unit)return {total:0,studied:0};
 if(unit.kind==='grammar')return {total:1,studied:unitPracticed(state,id)?1:0};
 const ids=cardIdsForUnit(unit);
 return {total:ids.length,studied:ids.filter(cid=>state.cards?.[cid]?.seen).length};
}
