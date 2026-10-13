import {CURRICULUM} from './curriculum.js';
import {hasPassedInternalN5} from './pedagogy/readiness.js';
import {N5_UNITS,N5_TOPICS,topicPassed,nextN5Unit,unitPassed,unitPracticed} from './courseUnits.js';
export const GUIDED_LEVELS=['N5','N4','N3','N2','N1'];
export const N5_FOUNDATIONS=N5_TOPICS;
/** Nível curricular obtido por avaliações, separado do filtro de referência. */
export function courseLevel(state){
 if(!hasPassedInternalN5(state))return 'N5';
 for(const level of GUIDED_LEVELS.slice(1)){
   if((CURRICULUM[level]||[]).some(l=>!state.lessons?.[l.id]))return level;
 }
 return 'N1';
}
export function lessonsFor(level){return level==='N5'?N5_UNITS:(CURRICULUM[level]||[]);}
export function isDone(state,level,lesson){return level==='N5'?unitPassed(state,lesson.id):Boolean(state.lessons?.[lesson.id]);}
export function nextGuidedAction(state,level=courseLevel(state)){
 const lesson=level==='N5'?nextN5Unit(state):lessonsFor(level).find(l=>!isDone(state,level,l));
 if(!lesson)return {kind:level==='N5'?'assessment-pending':'complete',lesson:null,label:level==='N5'?'Ver preparação para a prova N5':'Explorar minha trilha'};
 const ready=level==='N5'?unitPracticed(state,lesson.id):false;
 return {kind:ready?'checkpoint':'learn',lesson,label:ready?'Fazer checkpoint':'Continuar aprendendo'};
}
export const getNextAction=nextGuidedAction;
