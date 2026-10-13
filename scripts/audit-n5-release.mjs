/** Fail-closed N5 release audit, distinct from standard unit tests. */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {APPROVED_EXAM_ITEMS} from '../src/entities/study/index.js';
import {n5ReleaseReadiness} from '../src/entities/study/index.js';
import {validateN5Curriculum} from '../src/entities/study/index.js';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const errors=[...validateN5Curriculum()];
const availability=n5ReleaseReadiness(APPROVED_EXAM_ITEMS);
const seen=new Set();
for(const item of APPROVED_EXAM_ITEMS){
  if(seen.has(item.id)) errors.push(`duplicate item id: ${item.id}`);
  seen.add(item.id);
  if(item.skill!=='listening')continue;
  if(!item.audio?.path?.startsWith('/audio/')){errors.push(`audio path invalid: ${item.id}`);continue;}
  const resolved=path.resolve(ROOT,'public',item.audio.path.slice(1));
  if(!resolved.startsWith(path.resolve(ROOT,'public/audio')+path.sep)) {errors.push(`audio escapes public/audio: ${item.id}`);continue;}
  if(!fs.existsSync(resolved)) errors.push(`missing offline audio: ${item.id} — ${item.audio.path}`);
}
if(!availability.examAvailable){
  for(const [skill,stats] of Object.entries(availability.bySkill)) {
    if(stats.missing)errors.push(`${skill}: missing ${stats.missing} editor-approved items`);
    const missingCompetencies=availability.missingCompetencies[skill];
    if(missingCompetencies?.length)errors.push(`${skill}: missing reviewed competencies: ${missingCompetencies.join(', ')}`);
  }
}
const report={release:'Kotonoha 1.0 — N5',approvedForPublication:errors.length===0,items:APPROVED_EXAM_ITEMS.length,competencyMapValidated:validateN5Curriculum().length===0,errors};
console.log(JSON.stringify(report,null,2));
if(errors.length)process.exitCode=2;
