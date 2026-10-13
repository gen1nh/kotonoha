#!/usr/bin/env node
/** No dependencies: validate folder boundaries and relative import resolution. */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const errors=[];
const files=(dir)=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(x=>x.isDirectory()?files(path.join(dir,x.name)):[path.join(dir,x.name)]);
const normalized=p=>path.relative(root,p).replaceAll(path.sep,'/');
const obsolete=['src/components','src/content','src/pedagogy'];
for(const p of obsolete)if(fs.existsSync(path.join(root,p)))errors.push(`Pasta legada: ${p}`);
for(const x of fs.readdirSync(path.join(root,'src'),{withFileTypes:true}))if(x.isFile()&&x.name!=='main.jsx')errors.push(`Arquivo solto em src/: ${x.name}`);
const sources=['src','tests','scripts'].flatMap(dir=>files(path.join(root,dir))).filter(p=>/\.(?:jsx?|mjs)$/.test(p));
const rx=/(?:\bfrom\s*|\bimport\s*\(|\bimport\s*)["']([^"'\n]+)["']/g;
for(const p of sources){
 const a=normalized(p),src=fs.readFileSync(p,'utf8');
 for(const [,request] of src.matchAll(rx)){
  if(!request.startsWith('.'))continue;
  const raw=path.resolve(path.dirname(p),request);
  const options=[raw,raw+'.js',raw+'.jsx',raw+'.mjs',raw+'.css',path.join(raw,'index.js'),path.join(raw,'index.jsx')];
  const resolved=options.find(q=>fs.existsSync(q)&&fs.statSync(q).isFile());
  if(!resolved){errors.push(`${a}: import não existe: ${request}`);continue;}
  const b=normalized(resolved);
  if(!a.startsWith('src/'))continue;
  if(a.startsWith('src/shared/')&&/^src\/(?:app|pages|entities)\//.test(b))errors.push(`${a}: shared importa ${b}`);
  if(a.startsWith('src/entities/')&&/^src\/(?:app|pages)\//.test(b))errors.push(`${a}: entities importa ${b}`);
  if(a.startsWith('src/pages/')&&/^src\/app\//.test(b))errors.push(`${a}: pages importa ${b}`);
  if(a.startsWith('src/pages/')&&b.startsWith('src/pages/')&&a.split('/')[2]!==b.split('/')[2])errors.push(`${a}: pages cruzadas: ${b}`);
  if(a.startsWith('src/pages/')&&b.startsWith('src/entities/study/')&&b!=='src/entities/study/index.js')errors.push(`${a}: bypass da API do domínio: ${b}`);
  if(a.startsWith('src/app/')&&b.startsWith('src/pages/')&&!/^src\/pages\/[^/]+\/index\.js$/.test(b))errors.push(`${a}: bypass da API da página: ${b}`);
 }
}
for(const f of ['src/app/App.jsx','src/app/Shell.jsx','src/entities/study/index.js','src/shared/ui/index.jsx'])if(!fs.existsSync(path.join(root,f)))errors.push(`Ponto de entrada ausente: ${f}`);
if(errors.length){for(const msg of errors)console.error('ARCH:',msg);process.exitCode=1;}
else console.log(`Arquitetura OK: ${sources.length} fontes verificadas, imports resolvidos e camadas respeitadas.`);
