import test from 'node:test';
import assert from 'node:assert/strict';
import {N5_STAGES,N5_UNITS,LEGACY_N5_UNITS,stageProgress,stageForUnit,initialState,normalizeState,unitAccessible,unitPassed,checkpointQuestions} from '../src/entities/study/index.js';

test('etapas cobrem todas as unidades uma vez e preservam o conjunto legado de IDs',()=>{
 assert.deepEqual(N5_STAGES.flatMap(stage=>stage.units.map(unit=>unit.id)),N5_UNITS.map(unit=>unit.id));
 assert.deepEqual(N5_UNITS.map(u=>u.id).sort(),LEGACY_N5_UNITS.map(u=>u.id).sort());
 for(const stage of N5_STAGES){assert.ok(stage.goal);assert.ok(stage.method);assert.ok(stage.units.length);}
});

test('migração preserva acesso e aprovação em cada ponto do currículo antigo',()=>{
 for(let boundary=0;boundary<LEGACY_N5_UNITS.length;boundary++){
  const old=initialState();delete old.curriculumVersion;delete old.curriculumAccess;
  for(const unit of LEGACY_N5_UNITS.slice(0,boundary))old.checkpoints[unit.id]={score:80,date:'2026-10-15'};
  const migrated=normalizeState(old);
  for(const unit of LEGACY_N5_UNITS.slice(0,boundary+1))assert.ok(unitAccessible(migrated,unit.id),unit.id);
  for(const unit of LEGACY_N5_UNITS.slice(0,boundary))assert.ok(unitPassed(migrated,unit.id),unit.id);
  assert.deepEqual(normalizeState(migrated).curriculumAccess,migrated.curriculumAccess);
 }
});

test('iniciante usa a sequência nova sem herdar atalhos da migração',()=>{
 const state=normalizeState(initialState());
 assert.deepEqual(state.curriculumAccess,[]);
 for(const unit of N5_UNITS.slice(0,8))state.checkpoints[unit.id]={score:100};
 assert.ok(unitAccessible(state,'words:43'));
 assert.equal(unitAccessible(state,'hiragana:8'),false);
});
test('etapa atual acompanha checkpoints, não exposição ou filtro de nível',()=>{
 const state=initialState();state.selectedLevel='N1';
 for(const card of Object.values(state.cards))card.seen=true;
 assert.equal(stageProgress(state,N5_STAGES[0]).status,'current');
 assert.equal(stageProgress(state,N5_STAGES[1]).status,'upcoming');
 for(const unit of N5_STAGES[0].units)state.checkpoints[unit.id]={score:80};
 assert.equal(stageProgress(state,N5_STAGES[0]).status,'completed');
 assert.equal(stageProgress(state,N5_STAGES[1]).status,'current');
 assert.equal(stageForUnit(N5_UNITS[0].id).id,'first-steps');
});
test('checkpoints de gramática incluem explicação ancorada na regra da lição',()=>{
 const state=initialState();
 for(const unit of N5_UNITS.filter(unit=>unit.kind==='grammar')){
  for(const question of checkpointQuestions(state,unit.id))assert.ok(question.explanation.includes(unit.items[0].text));
 }
});

test('questões de aplicação reconstituem a frase e não reutilizam o ID da questão antiga',()=>{
 const state=initialState();let count=0;
 for(const unit of N5_UNITS.filter(unit=>unit.kind==='grammar')){
  const question=checkpointQuestions(state,unit.id).find(q=>q.id.endsWith(':application-v2'));
  if(!question)continue;
  count++;
  assert.equal(question.text.replace('＿＿＿',question.answer),unit.items[0].example);
  assert.equal(new Set(question.options).size,4);
  assert.ok(question.prompt.includes(unit.items[0].meaning));
 }
 assert.equal(count,21);
});

test('nova tentativa aplica gramática em frases diferentes sem alterar questões antigas',()=>{
 const state=initialState();
 for(const index of [14,15,16,17]){
  const id=`grammar:${index}`;
  const original=checkpointQuestions(state,id,5,0);
  const retry=checkpointQuestions(state,id,5,1);
  const originalApplication=original.find(q=>q.id.endsWith(':application-v2'));
  const transfer=retry.find(q=>q.id.endsWith(':transfer-v1'));
  assert.ok(originalApplication,`missing original application for ${id}`);
  assert.ok(transfer,`missing transfer for ${id}`);
  assert.notEqual(transfer.text,originalApplication.text);
  assert.notEqual(transfer.prompt,originalApplication.prompt);
  assert.equal(new Set(transfer.options).size,4);
  assert.ok(transfer.options.includes(transfer.answer));
  assert.ok(transfer.explanation.includes(transfer.text.replace('＿＿＿',transfer.answer)));
  assert.ok(transfer.explanation.length>40);
  assert.equal(original.length,4);
  assert.equal(retry.length,4);
  assert.equal(checkpointQuestions(state,id,5,0).find(q=>q.id.endsWith(':application-v2')).text,originalApplication.text);
 }
 // Outros tópicos e unidades continuam com os mesmos IDs.
 for(const id of ['grammar:0','grammar:21','hiragana:0','words:0']){
  assert.deepEqual(checkpointQuestions(state,id,5,1).map(q=>q.id),checkpointQuestions(state,id,5,0).map(q=>q.id));
 }
});
