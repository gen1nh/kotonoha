import {HIRAGANA_EXTENSIONS,KATAKANA_EXTENSIONS} from "../content/n5Kana.js";
import {GRAMMAR,HIRAGANA,KATAKANA,VOCAB} from './data.js';
import {CURRICULUM} from './curriculum.js';
import {unitById,unitProgress,cardIdsForUnit} from './courseUnits.js';
export const LESSON_CARD_TYPE={hiragana:'Hiragana',katakana:'Katakana',words:'Vocabulário N5'};
export function guidedLesson(state,id,level='N5'){
 return level==='N5'?unitById(id):(CURRICULUM[level]||[]).find(l=>l.id===id)||null;
}
export function advancedLessonScore(lesson,answers){
 if(!lesson?.questions?.length||lesson.questions.some(q=>!Number.isInteger(answers[q.id])))return null;
 return Math.round(100*lesson.questions.filter(q=>answers[q.id]===q.answer).length/lesson.questions.length);
}
export function guidedLessonProgress(state,id){
 const unit=unitById(id);
 if(unit)return unitProgress(state,id);
 if(['hiragana','katakana','words'].includes(id)){
   const types=Object.values(state.cards||{}).filter(c=>c.type===LESSON_CARD_TYPE[id]);
   return {total:types.length,studied:types.filter(c=>c.seen).length};
 }
 if(id==='grammar')return {total:GRAMMAR.length,studied:state.lessons?.grammar?GRAMMAR.length:0};
 const advanced=Object.values(CURRICULUM).flat().find(l=>l.id===id);
 return advanced?{total:advanced.questions.length,studied:state.lessons?.[id]?advanced.questions.length:0}:{total:0,studied:0};
}
export function guidedSamples(id){
 const unit=unitById(id);
 if(unit){return unit.items.map(row=>unit.kind==='kanji'?({glyph:row.glyph,reading:row.reading,meaning:row.meaning,spoken:row.exampleReading,example:row.example,exampleReading:row.exampleReading}):unit.kind==='grammar'?({glyph:row.example,reading:row.title,meaning:row.meaning,text:row.text}):unit.topic==='words'?({glyph:row[0],kana:row[1],reading:row[2],meaning:row[3]}):({glyph:row[0],reading:row[1],meaning:unit.topic==='hiragana'?'Hiragana':'Katakana'}));}
 if(id==='hiragana')return [...HIRAGANA,...HIRAGANA_EXTENSIONS].map(([glyph,reading])=>({glyph,reading,meaning:'Hiragana'}));
 if(id==='katakana')return [...KATAKANA,...KATAKANA_EXTENSIONS].map(([glyph,reading])=>({glyph,reading,meaning:'Katakana'}));
 if(id==='words')return VOCAB.map(([glyph,kana,reading,meaning])=>({glyph,kana,reading,meaning}));
 if(id==='grammar')return GRAMMAR.map(g=>({glyph:g.example,reading:g.title,meaning:g.meaning,text:g.text}));
 return [];
}
