import fs from 'node:fs';
import {N5_STAGES,N5_UNITS,initialState,checkpointQuestions,guidedSamples} from '../src/entities/study/index.js';

// Read-only snapshot of the course for human editorial review; never marks approval.
const state=initialState();
const reviewPath='data/editorial/n5-course-review.json';
if(fs.existsSync(reviewPath)){
 const previous=JSON.parse(fs.readFileSync(reviewPath,'utf8'));
 if(previous.units?.some(unit=>unit.editorialStatus!=='pending'||unit.reviewer||unit.reviewedAt||unit.notes)){
  throw new Error('O pacote contém revisão humana. Preserve essa revisão antes de gerar um novo inventário.');
 }
}
const units=N5_STAGES.flatMap((stage,index)=>stage.units.map(unit=>({
 id:unit.id,stage:index+1,stageTitle:stage.title,title:unit.title,
 objective:stage.goal,detail:unit.detail,kind:unit.kind,
 prerequisites:N5_UNITS.slice(0,N5_UNITS.findIndex(candidate=>candidate.id===unit.id)).map(candidate=>candidate.id),
 editorialStatus:'pending',reviewer:null,reviewedAt:null,
 content:unit.items,
 samples:['reading','listening'].includes(unit.kind)?[]:guidedSamples(unit.id),
 questions:checkpointQuestions(state,unit.id),
 reviewChecklist:['Japanese','Portuguese translation','Prerequisites','Explanation','Distractors','Audio when applicable'],
})));
fs.mkdirSync('data/editorial',{recursive:true});
fs.writeFileSync(reviewPath,JSON.stringify({version:1,note:'Editorial review pending. This file does not approve or certify content.',units},null,2)+'\n');
const rows=units.map(unit=>`| ${unit.id} | ${unit.stage} | ${unit.title.replaceAll('|','/')} | ${unit.kind} | ${unit.questions.length} | Pendente |`);
fs.writeFileSync('docs/N5_CURRICULUM_MAP.md',`# Mapa verificável do currículo N5\n\nGerado por \`node scripts/export-course-review.mjs\`. ${units.length} unidades. IDs preservados; sequência situacional v2 implementada. Revisão editorial independente pendente. Os pré-requisitos de acesso estão explicitados no pacote JSON; não equivalem a uma análise linguística de cada palavra.\n\n${N5_STAGES.map((stage,i)=>`## ${i+1}. ${stage.title}\n\n${stage.goal}\n\nMétodo: ${stage.method}\n\nConclusão: checkpoints de ${stage.units.length} microlições aprovados.\n`).join('\n')}\n## Inventário por unidade\n\n| ID | Etapa | Título | Modalidade | Questões | Revisão editorial |\n| --- | --- | --- | --- | --- | --- |\n${rows.join('\n')}\n`);
console.log(`Exportadas ${units.length} unidades para revisão; nenhum progresso foi alterado.`);
