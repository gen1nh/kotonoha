import {GRAMMAR} from './data.js';
import {unitById,cardIdsForUnit,topicPassed,unitPassed,unitPracticed} from './courseUnits.js';
export const PASS_PERCENT=80;
export const TOPIC_TYPES={hiragana:'Hiragana',katakana:'Katakana',words:'Vocabulário N5'};
export const topicCards=(state,topic)=>Object.values(state.cards||{}).filter(card=>card.type===TOPIC_TYPES[topic]);
export const exposureComplete=(state,topic)=>unitById(topic)?unitPracticed(state,topic):topic==='grammar'?Boolean(state.lessons?.grammar):topicCards(state,topic).length>0&&topicCards(state,topic).every(card=>card.seen);
export const checkpointPassed=(state,topic)=>unitById(topic)?unitPassed(state,topic):topicPassed(state,topic);

// Rotação determinística por tentativa: as perguntas não permanecem sempre na mesma ordem.
export function checkpointQuestions(state,topic,count=5,attempt=0){
 const unit=unitById(topic);
 if(topic==='grammar' && !unit){
   return GRAMMAR.slice(0,count).map((entry,i)=>{
     const wrong=GRAMMAR.filter(g=>g!==entry).map(g=>g.meaning).slice(0,3);
     return {id:`grammar:${i}`,prompt:`Traduza: ${entry.example}`,answer:entry.meaning,options:rotate([entry.meaning,...wrong],(attempt+i)%4)};
   });
 }
 if(unit?.kind==='reading'||unit?.kind==='listening'){
   return unit.items.slice().map((item,i)=>({
     id:item.id,prompt:item.prompt,answer:item.choices[item.answerIndex],
     options:rotate(item.choices,(attempt+i)%4),
     text:unit.kind==='reading'?item.text:null,
     spokenText:unit.kind==='listening'?item.spokenText:null,
     explanation:item.explanation,
   }));
 }
 if(unit?.kind==='grammar'){
   const g=unit.items[0];
   const i=GRAMMAR.indexOf(g);
   const other=GRAMMAR.filter(row=>row!==g);
   const make=(id,prompt,answer,wrong)=>({id,prompt,answer,options:rotate([answer,...wrong.slice(0,3)],(attempt+i)%4)});
   return [
     make(`${topic}:translation`,`Traduza: ${g.example}`,g.meaning,other.map(x=>x.meaning)),
     make(`${topic}:example`,`Qual frase corresponde a “${g.meaning}”?`,g.example,other.map(x=>x.example)),
     make(`${topic}:rule`,`Qual explicação corresponde a “${g.title}”?`,g.text,other.map(x=>x.text)),
     make(`${topic}:usage`,`Qual frase demonstra “${g.title}”?`,g.example,other.slice().reverse().map(x=>x.example)),
   ];
 }
 const cards=unit?cardIdsForUnit(unit).map(id=>state.cards?.[id]).filter(Boolean):topicCards(state,topic);
 if(cards.length<4)return [];
 const size=Math.min(count,cards.length);
 const offset=attempt%cards.length;
 const selected=Array.from({length:size},(_,i)=>cards[(offset+i)%cards.length]);
 return selected.map((card,i)=>{
   const wrong=cards.filter(x=>x.id!==card.id&&x.answer!==card.answer).map(x=>x.answer).slice(0,3);
   if(wrong.length<3)return null;
   return {id:card.id,prompt:unit?.kind==='kanji'?`Qual leitura e sentido estão associados a ${card.prompt} neste capítulo?`:card.prompt,answer:card.answer,options:rotate([card.answer,...wrong],(i+attempt)%4)};
 }).filter(Boolean);
}
function rotate(options,shift){return [...options.slice(shift),...options.slice(0,shift)];}
export function checkpointScore(questions,answers){
 if(!questions.length||questions.some(q=>!Object.prototype.hasOwnProperty.call(answers,q.id)))return null;
 return Math.round(100*questions.filter(q=>answers[q.id]===q.answer).length/questions.length);
}
