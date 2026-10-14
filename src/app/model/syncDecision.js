// Compare canonical JSON: Postgres jsonb may return object keys in another order.
export function fingerprint(value) {
  if (Array.isArray(value)) return '[' + value.map(fingerprint).join(',') + ']';
  if (value && typeof value === 'object') return '{' + Object.keys(value).sort().map(k => JSON.stringify(k) + ':' + fingerprint(value[k])).join(',') + '}';
  return JSON.stringify(value);
}

export function syncDecision({ owner, base, local, remote, userId }) {
  if (owner !== userId || !base) return 'choose';
  if (!remote) return 'choose'; // Deleted server row must never silently recreate itself.
  const localKey = fingerprint(local);
  const remoteKey = fingerprint(remote.payload);
  if (localKey === remoteKey) return 'equal';
  const localChanged = localKey !== base.fingerprint;
  const remoteChanged = remote.revision !== base.revision;
  if (localChanged && remoteChanged) return 'conflict';
  if (remoteChanged) return 'receive';
  return localChanged ? 'send' : 'equal';
}
