#!/usr/bin/env node
/**
 * Dependency-free inventory of unreachable application modules.
 * Static analysis is a candidate finder, NOT proof that files can be deleted.
 * Supports static imports, re-exports, bare imports and literal dynamic imports.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const IMPORT_PATTERN = /\b(?:from\s*|import\s*\(\s*|import\s*)["']([^"'\n]+)["']/g;
export const SOURCE_EXTENSIONS = ['.js', '.jsx', '.mjs', '.css'];
export function discover(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? discover(full) : [full];
  });
}
export function findReachability(files, read, rootEntry = 'src/main.jsx') {
  const known = new Set(files);
  const imports = new Map();
  const unresolved = [];
  for (const file of files) {
    const dependencies = [];
    const text = read(file);
    for (const match of text.matchAll(new RegExp(IMPORT_PATTERN.source, 'g'))) {
      const request = match[1];
      if (!request.startsWith('.')) continue;
      const base = path.posix.normalize(path.posix.join(path.posix.dirname(file), request));
      const candidates = [base, ...SOURCE_EXTENSIONS.map(extension => base + extension),
        ...['index.js', 'index.jsx'].map(index => base + '/' + index)];
      const target = candidates.find(candidate => known.has(candidate));
      if (target) dependencies.push(target);
      else if (!/\.(?:svg|png|jpe?g|webp|woff2?|json|txt)$/i.test(request))
        unresolved.push({ from: file, request });
    }
    // CSS @import is not a JS import; still forms part of the runtime graph.
    if (file.endsWith('.css')) {
      for (const match of text.matchAll(/@import\s+["']([^"']+)["']/g)) {
        if (!match[1].startsWith('.')) continue;
        const target = path.posix.normalize(path.posix.join(path.posix.dirname(file), match[1]));
        if (known.has(target)) dependencies.push(target);
      }
    }
    imports.set(file, dependencies);
  }
  const visited = new Set();
  const visit = file => {
    if (visited.has(file) || !known.has(file)) return;
    visited.add(file);
    for (const dependency of imports.get(file) || []) visit(dependency);
  };
  visit(rootEntry);
  return { unreachable: files.filter(file => !visited.has(file)).sort(), unresolved };
}

function main() {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const src = path.join(root, 'src');
  const files = discover(src).filter(file => SOURCE_EXTENSIONS.some(ext => file.endsWith(ext)))
    .map(file => path.relative(root, file).replaceAll(path.sep, '/'));
  const { unreachable, unresolved } = findReachability(files,
    file => fs.readFileSync(path.join(root, file), 'utf8'));
  console.log('Runtime modules: ' + (files.length - unreachable.length) + '/' + files.length + ' reachable.');
  if (unreachable.length) {
    console.log('Review candidates (may be referenced by tests or tooling):');
    unreachable.forEach(file => console.log('  ? ' + file));
  } else console.log('No unreachable src modules identified.');
  if (unresolved.length) {
    console.log('Unresolved relative imports:');
    unresolved.forEach(item => console.log('  ! ' + item.from + ': ' + item.request));
  }
  // This scan is intentionally informational until all candidates have been reviewed.
  // The existing architecture checker is the blocking gate for unresolved imports.
  if (process.argv.includes('--strict') && (unreachable.length || unresolved.length)) process.exitCode = 1;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
