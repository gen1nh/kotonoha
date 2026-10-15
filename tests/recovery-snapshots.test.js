import test from 'node:test';
import assert from 'node:assert/strict';
import {listRecoverySnapshots,saveRecoverySnapshot,MAX_RECOVERY_SNAPSHOTS,RECOVERY_PREFIX} from '../src/shared/lib/recoverySnapshots.js';

function storage(){
  const values=new Map();
  return {
    setItem(k,v){values.set(k,v);this[k]=v;},
    getItem(k){return values.get(k)||null;},
    removeItem(k){values.delete(k);delete this[k];},
    get values(){return values;}
  };
}
test('recovers most recent five snapshots while retaining unrelated app data',()=>{
  const mem=storage();
  mem.setItem('kotonoha.v1','progress');
  for(let n=0;n<8;n++)saveRecoverySnapshot({n},{n},mem,()=>`2026-10-14T20:00:0${n}.000Z`,()=>String(n));
  const keys=listRecoverySnapshots(mem);
  assert.equal(keys.length,MAX_RECOVERY_SNAPSHOTS);
  assert.ok(keys[0].includes('20:00:07'));
  assert.ok(keys[4].includes('20:00:03'));
  assert.equal(mem.getItem('kotonoha.v1'),'progress');
  assert.ok(keys.every(k=>k.startsWith(RECOVERY_PREFIX)));
});
test('failed snapshot write leaves previous progress and recovery copies untouched',()=>{
  const mem=storage();
  saveRecoverySnapshot({answer:1},null,mem,()=> '2026-10-14T19:00:00Z',()=> 'old');
  const before=listRecoverySnapshots(mem);
  mem.setItem=()=>{throw new DOMException('Quota full','QuotaExceededError');};
  assert.throws(()=>saveRecoverySnapshot({answer:2},null,mem));
  assert.deepEqual(listRecoverySnapshots(mem),before);
});
