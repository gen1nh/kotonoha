import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {readFileSync,existsSync,mkdtempSync,mkdirSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {N5_UNITS} from '../src/entities/study/index.js';

const root=fileURLToPath(new URL('..',import.meta.url));
const queueFile=resolve(root,'data/editorial/n5-prerequisite-review.json');
const script=resolve(root,'scripts/audit-n5-prerequisites.mjs');
const run=(args=[],cwd=root)=>spawnSync(process.execPath,[script,...args],{encoding:'utf8',cwd});
const withFixture=(queue,callback)=>{
 const directory=mkdtempSync(join(tmpdir(),'kotonoha-n5-editorial-'));
 try{
  mkdirSync(join(directory,'data/editorial'),{recursive:true});
  writeFileSync(join(directory,'data/editorial/n5-prerequisite-review.json'),JSON.stringify(queue));
  return callback(directory);
 }finally{rmSync(directory,{recursive:true,force:true});}
};

test('editorial report is read-only and never confers N5 certification',()=>{
 const before=existsSync(queueFile)?readFileSync(queueFile):null;
 const result=run();
 assert.equal(result.status,0,result.stderr||result.stdout);
 const report=JSON.parse(result.stdout);
 assert.equal(report.units,220);
 assert.equal(report.stages.reduce((total,stage)=>total+stage.total,0),220);
 assert.equal(report.stages.reduce((total,stage)=>total+stage.recordedReviews,0),report.humanReviewsRecorded);
 assert.equal(report.pendingHumanReviews+report.humanReviewsRecorded,220);
 assert.equal(report.certificationEligible,false);
 if(before)assert.deepEqual(readFileSync(queueFile),before);
 else assert.equal(existsSync(queueFile),false);
});

test('saved reviewer notes are never overwritten, including with --write',()=>{
 const queue={units:N5_UNITS.map((unit,index)=>({
  id:unit.id,
  languageReview:index===0
   ?{status:'reviewed',reviewer:'Revisor editorial',reviewedAt:'2026-10-15',accuracyNotes:'Conferir homônimos'}
   :{status:'pending',reviewer:null,reviewedAt:null},
 }))};
 withFixture(queue,directory=>{
  const path=join(directory,'data/editorial/n5-prerequisite-review.json');
  const before=readFileSync(path);
  const read=run([],directory);
  // A fixture lacks the published structural inventory; this does not invalidate its review counts.
  const report=JSON.parse(read.stdout);
  assert.equal(report.humanReviewsRecorded,1);
  assert.equal(report.pendingHumanReviews,219);
  assert.equal(report.stages.reduce((count,stage)=>count+stage.recordedReviews,0),1);
  assert.equal(report.certificationEligible,false);
  assert.deepEqual(readFileSync(path),before);
  const write=run(['--write'],directory);
  assert.notEqual(write.status,0);
  assert.match(write.stderr,/already exists/i);
  assert.deepEqual(readFileSync(path),before);
 });
});

test('duplicate or unknown reviewer IDs are rejected',()=>{
 for(const ids of [[N5_UNITS[0].id,N5_UNITS[0].id],['not-an-n5-unit']]){
  withFixture({units:ids.map(id=>({id,languageReview:{status:'reviewed',reviewer:'x',reviewedAt:'2026-10-15'}}))},directory=>{
   const output=run([],directory);
   assert.notEqual(output.status,0);
   assert.match(output.stderr,/duplicate or unknown unit IDs/i);
  });
 }
});
