/** Canonical N5 learning track. Existing basic unit IDs are preserved for backups.
 * New units never inherit a legacy topic-wide checkpoint: old users must study
 * the newly added material rather than silently skipping it.
 */
import {HIRAGANA,KATAKANA,VOCAB,GRAMMAR} from './data.js';
import {HIRAGANA_EXTENSIONS,KATAKANA_EXTENSIONS} from './content/n5Kana.js';
import {N5_KANJI} from './content/n5Kanji.js';
import {N5_VOCAB_GROUPS} from './content/n5Words.js';
import {N5_READING_TASKS} from './content/n5Reading.js';
import {N5_LISTENING_TASKS} from './content/n5Listening.js';
const partition=(items,size)=>{
 const groups=Array.from({length:Math.ceil(items.length/size)},(_,i)=>items.slice(i*size,(i+1)*size));
 if(size>1&&groups.length>1&&groups.at(-1).length<4){
  const tail=groups.pop();const previous=groups.pop();const joined=[...previous,...tail];
  if(joined.length<=8)groups.push(joined);
  else groups.push(joined.slice(0,4),joined.slice(4));
 }
 return groups;
};
export const N5_TOPICS=Object.freeze(['hiragana','katakana','words','kanji','grammar','reading','listening']);
export const N5_TOPIC_LABELS=Object.freeze({hiragana:'Hiragana',katakana:'Katakana',words:'Vocabulário contextualizado',kanji:'Kanji em palavras',grammar:'Gramática N5',reading:'Leitura em japonês',listening:'Compreensão auditiva'});
export const LEGACY_N5_UNIT_COUNTS=Object.freeze({hiragana:8,katakana:8,words:4,grammar:5});
const build=(topic,items,size,kind,startIndex=0,chapter=N5_TOPIC_LABELS[topic])=>partition(items,size).map((part,index,all)=>({
 id:`${topic}:${startIndex+index}`,topic,index:startIndex+index,kind,level:'N5',items:part,chapter,
 title:kind==='grammar'?part[0].title:`${chapter} · ${index+1}/${all.length}`,
 detail:kind==='grammar'?'Aprenda a regra, escute o exemplo e realize a prática.':
   kind==='reading'?'Leia os textos sem traduzir automaticamente. Observe a informação pedida.':
   kind==='listening'?'Escute cada frase sem olhar a transcrição. A voz vem do dispositivo.':
   kind==='kanji'?'Aprenda o caractere e sua leitura em palavras comuns, sem decorar uma leitura universal.':
   `Aprenda ${part.length} ${kind==='kana'?'sons ou caracteres':'itens'} por vez, depois pratique e revise.`,
}));
const initialWords=VOCAB.slice(0,20);
let wordIndex=4;
const seen=new Set(initialWords.map(row=>row[0]));
const themedWords=N5_VOCAB_GROUPS.flatMap(group=>{
 const items=group.words.filter(row=>{if(seen.has(row[0]))return false;seen.add(row[0]);return true;});
 const units=build('words',items,5,'vocabulary',wordIndex,group.title);
 wordIndex+=units.length;return units;
});
export const N5_UNITS=Object.freeze([
 ...build('hiragana',HIRAGANA,6,'kana'),
 ...build('hiragana',HIRAGANA_EXTENSIONS,6,'kana',8,'Hiragana · sons modificados'),
 ...build('katakana',KATAKANA,6,'kana'),
 ...build('katakana',KATAKANA_EXTENSIONS,6,'kana',8,'Katakana · sons modificados'),
 ...build('words',initialWords,5,'vocabulary'),
 ...themedWords,
 ...build('kanji',N5_KANJI,6,'kanji'),
 ...build('grammar',GRAMMAR,1,'grammar'),
 ...build('reading',N5_READING_TASKS,5,'reading'),
 ...build('listening',N5_LISTENING_TASKS,5,'listening'),
]);
export const unitById=id=>N5_UNITS.find(unit=>unit.id===id)||null;
export const unitsForTopic=topic=>N5_UNITS.filter(unit=>unit.topic===topic);
export const cardIdsForUnit=unit=>!unit||!['hiragana','katakana','words','kanji'].includes(unit.topic)?[]:unit.items.map(row=>{
 const value=unit.topic==='kanji'?row.glyph:row[0];
 return unit.topic==='hiragana'?`hira:${value}`:unit.topic==='katakana'?`kata:${value}`:unit.topic==='kanji'?`kanji:${value}`:`vocab:${value}`;
});
export function unitPassed(state,id){
 const unit=unitById(id);if(!unit)return false;
 const legacy=unit.index<(LEGACY_N5_UNIT_COUNTS[unit.topic]||0) && Number(state?.checkpoints?.[unit.topic]?.score)>=80;
 return Boolean(legacy||Number(state?.checkpoints?.[id]?.score)>=80);
}
export function topicPassed(state,topic){const units=unitsForTopic(topic);return units.length>0&&units.every(unit=>unitPassed(state,unit.id));}
export function unitAccessible(state,id){const index=N5_UNITS.findIndex(unit=>unit.id===id);return index>=0&&N5_UNITS.slice(0,index).every(unit=>unitPassed(state,unit.id));}
export function unitPracticed(state,id){const unit=unitById(id);if(!unit)return false;
 if(['grammar','reading','listening'].includes(unit.kind))return state?.lessons?.[id]===true || (unit.kind==='grammar' && unit.index<5 && state?.lessons?.grammar===true);
 const cards=cardIdsForUnit(unit);return cards.length>0&&cards.every(cardId=>state?.cards?.[cardId]?.seen===true);
}
export function nextN5Unit(state){return N5_UNITS.find(unit=>!unitPassed(state,unit.id))||null;}
export function unitProgress(state,id){const unit=unitById(id);if(!unit)return {total:0,studied:0};
 if(['grammar','reading','listening'].includes(unit.kind))return {total:1,studied:unitPracticed(state,id)?1:0};
 const ids=cardIdsForUnit(unit);return {total:ids.length,studied:ids.filter(cid=>state?.cards?.[cid]?.seen).length};
}
