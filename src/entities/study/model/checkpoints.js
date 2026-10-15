import {GRAMMAR} from './data.js';
import {grammarApplication} from '../content/n5Applications.js';
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
     return {id:`grammar:${i}`,prompt:`Traduza: ${entry.example}`,answer:entry.meaning,options:rotate([entry.meaning,...wrong],(attempt+i)%4),explanation:entry.text};
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
   let questionOrdinal=0;
   const make=(id,prompt,answer,wrong)=>({
     id,prompt,answer,
     explanation:`${g.text} Exemplo: ${g.example} — ${g.meaning}`,
     options:rotate([answer,...wrong.slice(0,3)],(attempt+i+questionOrdinal++)%4),
     // Explanations are grounded in the existing authored grammar rows.
     distractorContext:Object.fromEntries(other.filter(row=>
       row.meaning!==answer&&row.example!==answer&&row.text!==answer
     ).flatMap(row=>[[row.meaning,row.title],[row.example,row.title],[row.text,row.title]])),
   });
   const application=grammarApplication(unit,attempt);
   return [
     make(`${topic}:translation`,`Traduza: ${g.example}`,g.meaning,other.map(x=>x.meaning)),
     make(`${topic}:example`,`Qual frase corresponde a “${g.meaning}”?`,g.example,other.map(x=>x.example)),
     make(`${topic}:rule`,`Qual explicação corresponde a “${g.title}”?`,g.text,other.map(x=>x.text)),
     application?{...application,options:rotate(application.options,(attempt+i+questionOrdinal)%4)}:make(`${topic}:usage`,`Qual frase demonstra “${g.title}”?`,g.example,other.slice().reverse().map(x=>x.example)),
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
   const options=rotate([card.answer,...wrong],(i+attempt)%4);
   const distractorContext=Object.fromEntries(wrong.map(option=>{
     const other=cards.find(x=>x.id!==card.id&&x.answer===option);
     return [option,other?.prompt||''];
   }).filter(([,prompt])=>prompt));
   return {
     id:card.id,
     prompt:unit?.kind==='kanji'?`Qual leitura e sentido estão associados a ${card.prompt} neste capítulo?`:card.prompt,
     answer:card.answer,options,distractorContext,
     explanation:unit?.kind==='kana'
       ?'Observe a forma do sinal e associe a leitura correta. Compare os sinais parecidos, sem usar somente a posição da alternativa.'
       :unit?.kind==='kanji'
         ?'Reconheça esta leitura dentro da palavra estudada; um mesmo kanji pode ter outras leituras em contextos diferentes.'
         :'Associe a palavra japonesa à leitura e ao significado usados nesta lição.',
   };
 }).filter(Boolean);
}
function rotate(options,shift){return [...options.slice(shift),...options.slice(0,shift)];}
export function checkpointScore(questions,answers){
 if(!questions.length||questions.some(q=>!Object.prototype.hasOwnProperty.call(answers,q.id)))return null;
 return Math.round(100*questions.filter(q=>answers[q.id]===q.answer).length/questions.length);
}

/** Post-checkpoint feedback. Never disclose the correct answer before grading. */
export function explainCheckpointAnswer(question,selected){
 if(!question||!question.options?.includes(selected))return '';
 if(selected===question.answer)return question.explanation||'Resposta correta. Confira a associação estudada na lição.';
 const contrast=question.distractorContext?.[selected];
 const base=question.explanation||'Retome o exemplo da lição e compare a leitura e o significado.';
 if(!contrast)return base;
 return `${base} Você marcou “${selected}”, associado a “${contrast}” em outro item estudado. Compare os dois antes de tentar novamente.`;
}
