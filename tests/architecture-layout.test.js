import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
test('Estrutura FSD, APIs públicas e imports são válidos',()=>{
 const r=spawnSync(process.execPath,['scripts/check-architecture.mjs'],{cwd:root,encoding:'utf8'});
 assert.equal(r.status,0,r.stdout+'\n'+r.stderr);
});
