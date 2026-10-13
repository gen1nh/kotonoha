import {CURRICULUM} from './curriculum.js';
import {unitById,unitAccessible,unitPracticed,topicPassed} from './courseUnits.js';
import {hasPassedInternalN5,hasCompletedN5Basics} from './pedagogy/readiness.js';
export const VIEWS=Object.freeze(['home','path','lesson','checkpoint','practice','review','progress','learn','notebook','syntax','errors','line','pitch','settings']);
export const N5_FOUNDATIONS=Object.freeze(['hiragana','katakana','words','grammar']);
export const ADVANCED_LABS=Object.freeze(['line','pitch']);
export const hasUnlockedN4=state=>hasPassedInternalN5(state);
export function isAccessibleLesson(state,id,level='N5'){
 if(level==='N5')return unitAccessible(state,id);
 const levels=['N4','N3','N2','N1'];
 const position=levels.indexOf(level);
 const lessons=CURRICULUM[level]||[];
 const index=lessons.findIndex(l=>l.id===id);
 if(position<0||index<0||!hasUnlockedN4(state))return false;
 if(!levels.slice(0,position).every(prev=>(CURRICULUM[prev]||[]).every(l=>state.lessons?.[l.id])))return false;
 return lessons.slice(0,index).every(l=>state.lessons?.[l.id]);
}
export function isAccessibleCheckpoint(state,id){return Boolean(unitById(id))&&isAccessibleLesson(state,id,'N5')&&unitPracticed(state,id);}
export function resolveView(requested,state={}){
 if(requested==='jlpt'||requested==='paper')return {view:'path',blocked:false};
 if(requested==='errors')return {view:'notebook',blocked:false};
 if(!VIEWS.includes(requested))return {view:'home',blocked:false};
 if(ADVANCED_LABS.includes(requested)&&!hasCompletedN5Basics(state))return {view:'practice',blocked:true};
 return {view:requested,blocked:false};
}
export const viewFromSearch=(search,state)=>resolveView(new URLSearchParams(search).get('view')||'home',state);
