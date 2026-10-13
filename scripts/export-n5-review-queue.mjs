import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {N5_DRAFT_ITEMS} from '../src/pedagogy/n5DraftItems.js';
import {validateItem} from '../src/pedagogy/engine.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const output=process.argv[2] || 'data/editorial/n5-draft-questions.json';
const target=path.resolve(root,output);
if(!target.startsWith(root+path.sep))throw Error('Output must be inside project');
const errors=N5_DRAFT_ITEMS.flatMap(item=>validateItem(item).map(message=>`${item.id}: ${message}`));
if(errors.length)throw Error('Invalid draft records:\n'+errors.join('\n'));
fs.mkdirSync(path.dirname(target),{recursive:true});
fs.writeFileSync(target,JSON.stringify({
  version:1,
  level:'N5',
  editorialStatus:'draft',
  note:'Do not copy straight to the published bank. Independently verify Japanese, choices, source rights and audio.',
  items:N5_DRAFT_ITEMS,
},null,2)+'\n');
console.log(`Exported ${N5_DRAFT_ITEMS.length} drafts → ${path.relative(root,target)}`);
