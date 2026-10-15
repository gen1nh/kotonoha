import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {readFileSync,existsSync} from 'node:fs';

const queueFile='data/editorial/n5-prerequisite-review.json';
const script='scripts/audit-n5-prerequisites.mjs';
const run=(args=[])=>spawnSync(process.execPath,[script,...args],{encoding:'utf8',cwd:new URL('..',import.meta.url)});

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

test('explicit --write never overwrites a saved editorial queue',()=>{
 if(!existsSync(queueFile))return; // Only relevant after an editor creates a queue.
 const before=readFileSync(queueFile);
 const result=run(['--write']);
 assert.notEqual(result.status,0);
 assert.match(result.stderr,/already exists/i);
 assert.deepEqual(readFileSync(queueFile),before);
});
