// FRAMECHECK. A design fault the determinism gate cannot see: type or content cut by the frame's
// edge. Every line of text (fillText, writeOn, setType) and every content box the art reports
// (probeRect: an answer card, a product window, a film's card) must lie wholly inside the frame or
// wholly outside it, on every frame checked. A deliberate full-bleed is not reported as a box.
//   node tools/framecheck.mjs <film>[-<shape>] [--every 1] [--from F] [--to T]
import { resolve } from "node:path";
import { buildPage } from "./build-page.mjs";
import { detect } from "./detect.mjs";
import * as playwright from "./adapters/playwright.mjs";
import { requireFilm } from "./names.mjs";

const pos = [], opt = {};
for (let i = 2; i < process.argv.length; i++) { const a = process.argv[i]; if (a.startsWith("--")) opt[a.slice(2)] = process.argv[++i]; else pos.push(a); }
const film = requireFilm(pos[0], "framecheck", "node tools/framecheck.mjs <film>[-<shape>] [--every 1] [--from F] [--to T]");
export const frameCheck = async (film, { every = 1, from = 0, to } = {}) => {
  const page = await buildPage({ entry: `src/hosts/page-${film}.ts`, out: resolve(`dist/${film}.html`), title: film });
  const s = await playwright.open(detect(), page.out, { workers: 1 }), meta = await s.info(), N = to ?? meta.durationFrames;
  const frames = []; for (let f = from; f < N; f += every) frames.push(f);
  const bad = []; for (let i = 0; i < frames.length; i += 40) bad.push(...(await s.probe(frames.slice(i, i + 40))));
  await s.close();
  return { meta, frames: frames.length, bad };
};
const r = await frameCheck(film, { every: Number(opt.every ?? 1), from: Number(opt.from ?? 0), to: opt.to === undefined ? undefined : Number(opt.to) });
const groups = new Map(); for (const b of r.bad) { const k = `${b.kind} "${b.label.slice(0, 48)}"`; const g = groups.get(k) ?? []; g.push(b.frame); groups.set(k, g); }
console.log(`FRAMECHECK   ${film}   ${r.meta.W}x${r.meta.H}, ${r.frames} frames`);
for (const [k, fs] of groups) { const b = r.bad.find((x) => `${x.kind} "${x.label.slice(0, 48)}"` === k); console.log(`  FAIL  ${k} cut by the frame's edge on ${fs.length} frame(s): ${fs.slice(0, 8).join(", ")}${fs.length > 8 ? " ..." : ""}   box ${[b.x0, b.y0, b.x1, b.y1].map((v) => Math.round(v)).join(",")}`); }
console.log(r.bad.length ? `FRAMECHECK: FAIL   ${groups.size} item(s) cut by the frame's edge` : `FRAMECHECK: PASS   no text or content box cut by the frame's edge`);
process.exit(r.bad.length ? 1 : 0);
