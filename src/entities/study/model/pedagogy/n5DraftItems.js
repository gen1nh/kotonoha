import {N5_QUESTIONS} from '../n5Questions.js';
/** Existing in-app exercises migrate into editorial queue, NEVER into approved exam bank. */
const SKILL_MAP={Vocabulário:'vocabulary',Partículas:'grammar',Gramática:'grammar',Leitura:'reading'};
const COMPETENCY_MAP={Vocabulário:'n5-vocab-daily',Partículas:'n5-grammar-basic',Gramática:'n5-grammar-basic',Leitura:'n5-reading-messages'};
export const N5_DRAFT_ITEMS=Object.freeze(N5_QUESTIONS.map(question=>({
  id:question.id,
  level:'N5',
  skill:SKILL_MAP[question.skill]||'vocabulary',
  competencyId:COMPETENCY_MAP[question.skill]||'n5-vocab-daily',
  status:'draft',
  prompt:question.prompt,
  sentence:question.sentence,
  choices:[...question.choices],
  answerIndex:question.answer,
  explanation:question.explanation,
  provenance:{sourceId:'original',license:'Autoral Kotonoha (rascunho)',attribution:'Equipe Kotonoha'},
  review:null,
})));
