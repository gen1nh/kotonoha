/** Browser storage has a limited quota; keep a small rolling set of recoveries.
 * Write the new copy BEFORE pruning older ones. A failed write must abort sync.
 * Manual downloads remain the recommended durable backup.
 */
export const RECOVERY_PREFIX='kotonoha.sync.recovery.';
export const MAX_RECOVERY_SNAPSHOTS=5;
export function listRecoverySnapshots(storage=localStorage) {
  return Object.keys(storage).filter(key=>key.startsWith(RECOVERY_PREFIX)).sort().reverse();
}
export function saveRecoverySnapshot(local,cloud,storage=localStorage,now=()=>new Date().toISOString(),id=()=>crypto.randomUUID()) {
  const stamp=now();
  const key=RECOVERY_PREFIX+stamp+'.'+id();
  storage.setItem(key,JSON.stringify({createdAt:stamp,local,cloud}));
  const keys=listRecoverySnapshots(storage);
  for(const old of keys.slice(MAX_RECOVERY_SNAPSHOTS)) {
    try{storage.removeItem(old);}catch{/* Preserve new snapshot even if pruning fails. */}
  }
  return key;
}
