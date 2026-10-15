import test from 'node:test';
import assert from 'node:assert/strict';
import { initialState, rateCard } from '../src/entities/study/index.js';
import { cardMastery, levelInsights, nextStudyAction } from '../src/entities/study/index.js';
test('cartões novos não contam como dominados', () => {
 const state = initialState(); const stats = levelInsights(state, 'N5');
 assert.equal(stats.stable, 0); assert.equal(stats.new, stats.total);
 assert.equal(nextStudyAction(state, 'N5').kind, 'learn');
});

test('indicadores N5 incluem kanji sem contar notas pessoais como conteúdo do curso',()=>{
 const state=initialState();
 const expected=Object.values(state.cards).filter(card=>['Hiragana','Katakana','Vocabulário N5','Kanji N5'].includes(card.type)).length;
 assert.equal(levelInsights(state,'N5').total,expected);
 const kanji=Object.values(state.cards).find(card=>card.type==='Kanji N5');
 kanji.seen=true;kanji.due=1;
 assert.equal(levelInsights(state,'N5',2).due,1);
});
test('avaliação de revisão atualiza os indicadores', () => {
 const state = initialState(); const id = Object.keys(state.cards)[0];
 rateCard(state, id, 'again', 1000);
 assert.equal(cardMastery(state.cards[id]), 'retry');
 rateCard(state, id, 'good', 2000);
 assert.equal(cardMastery(state.cards[id]), 'learning');
 state.cards[id].reps = 3; state.cards[id].interval = 7;
 assert.equal(cardMastery(state.cards[id]), 'stable');
});
test('revisões vencidas têm prioridade sobre conteúdo novo', () => {
 const state = initialState(); const card = Object.values(state.cards)[0];
 card.seen = true; card.due = 10;
 assert.equal(nextStudyAction(state, 'N5', 20).kind, 'review');
});
