import test from 'node:test';
import assert from 'node:assert/strict';
import { fingerprint, syncDecision } from '../src/app/model/syncDecision.js';
const payload = { cards: { a: { due: 3 } }, notes: ['a', 'b'] };
const base = { revision: 4, fingerprint: fingerprint(payload) };
const remote = { revision: 4, payload };
const decide = overrides => syncDecision({ owner: 'one', userId: 'one', base, local: payload, remote, ...overrides });
test('jsonb key order does not create false dirty state; array order matters', () => {
  assert.equal(fingerprint(payload), fingerprint({ notes: ['a', 'b'], cards: { a: { due: 3 } } }));
  assert.notEqual(fingerprint(payload), fingerprint({ ...payload, notes: ['b', 'a'] }));
});
test('first login, different account, and deleted remote need explicit choice', () => {
  assert.equal(decide({ base: null }), 'choose');
  assert.equal(decide({ userId: 'two' }), 'choose');
  assert.equal(decide({ remote: null }), 'choose');
});
test('local edits can upload only against unchanged server revision', () => {
  const local = { ...payload, notes: ['edited offline'] };
  assert.equal(decide({ local }), 'send');
  assert.equal(decide({ local, remote: { revision: 5, payload: { ...payload, notes: ['other device'] } } }), 'conflict');
});
test('remote edits request receipt, never overwrite silently; lost acknowledgement converges', () => {
  assert.equal(decide({ remote: { revision: 5, payload: { ...payload, notes: [] } } }), 'receive');
  assert.equal(decide({ remote: { revision: 5, payload } }), 'equal');
});
