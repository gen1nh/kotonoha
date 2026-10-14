import test from 'node:test';
import assert from 'node:assert/strict';
import { findReachability } from '../scripts/audit-dead-code.mjs';

const relative = name => './' + name;

test('traces static imports, re-exports and literal dynamic imports', () => {
  const data = {
    'src/main.jsx': `import '${relative('app.jsx')}'; import('${relative('lazy.jsx')}');`,
    'src/app.jsx': `export {value} from '${relative('shared.js')}';`,
    'src/shared.js': 'export const value = 1;',
    'src/lazy.jsx': `import '${relative('styles.css')}';`,
    'src/styles.css': '.a { color: red }',
    'src/unused.js': 'export default 42;'
  };
  const result = findReachability(Object.keys(data), file => data[file]);
  assert.deepEqual(result.unreachable, ['src/unused.js']);
  assert.deepEqual(result.unresolved, []);
});

test('reports unresolved imports without deleting anything', () => {
  const data = { 'src/main.jsx': `import '${relative('missing.js')}';` };
  const result = findReachability(Object.keys(data), file => data[file]);
  assert.deepEqual(result.unreachable, []);
  assert.deepEqual(result.unresolved, [{from:'src/main.jsx', request:'./missing.js'}]);
});
