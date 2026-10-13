// Auditoria: variáveis CSS usadas mas nunca definidas + tamanho dos arquivos.
import fs from "node:fs";
import path from "node:path";

const root = "src";
const files = [];
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (/\.(css|jsx?)$/.test(entry.name)) files.push(p);
  }
})(root);

const defined = new Set();
const used = new Map();
for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  for (const m of text.matchAll(/^\s*(--[a-z0-9-]+)\s*:/gim)) defined.add(m[1]);
  for (const m of text.matchAll(/var\((--[a-z0-9-]+)/g)) {
    if (!used.has(m[1])) used.set(m[1], new Set());
    used.get(m[1]).add(path.basename(file));
  }
}
console.log("VARIAVEIS USADAS E NUNCA DEFINIDAS:");
for (const [name, where] of used) {
  if (!defined.has(name)) console.log(" ", name.padEnd(18), [...where].join(", "));
}
console.log("\nLINHAS POR ARQUIVO:");
for (const file of files) {
  const lines = fs.readFileSync(file, "utf8").split("\n").length;
  console.log(String(lines).padStart(6), file);
}
