// DECK. Left to choose, a film reaches for the first move it remembers: the same push-in, the same
// bloom, the same end card. This deals from references/motion-deck.json instead, weighted toward
// what fits the film (its kind, its energy) and toward the quiet workhorses, and prints each card
// with its numbers. The seed is printed, so a deal can be repeated and written into the brief.
// A card is a prompt, never an order: keep it, adapt it to the subject and medium, or drop it and
// say why. Styles and motion are a grammar to compose from (references/motion-grammar.md).
//   node tools/deck.mjs deal --kind story --energy high --seconds 27 [--seed 7] [--avoid id,id] [--json]
//   node tools/deck.mjs deal --cat seam --n 3 --kind launch       # three seams only
//   node tools/deck.mjs list [--cat camera]                        # every card, one line each
//   node tools/deck.mjs test                                       # the deck and the dealer hold their own rules
// Weights: role (workhorse 3, accent 2, signature 1) x energy fit (same 1, "any" 0.7, other 0.25).
// A deal has one opening, one close, at most one signature card, and no card twice.
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { isMain } from "./is-main.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", ".."), DECK = JSON.parse(readFileSync(join(ROOT, "references", "motion-deck.json"), "utf8"));
const CATS = ["open", "seam", "camera", "reveal", "type", "acting", "emphasis", "close"], MIDDLE = CATS.filter((c) => c !== "open" && c !== "close");
const KINDS = ["story", "drawing", "loop", "explainer", "infographic", "launch", "interactive"], ENERGY = ["calm", "medium", "high"], ROLE_W = { workhorse: 3, accent: 2, signature: 1 };
// mulberry32: the deal is a pure function of the seed
const rand = (seed) => { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };

export const fits = (m, kind) => !kind || m.kinds.includes("any") || m.kinds.includes(kind);
export const weight = (m, energy) => ROLE_W[m.role] * (!energy || m.energy === energy ? 1 : m.energy === "any" ? 0.7 : 0.25);
export const count = (seconds) => Math.max(4, Math.min(12, Math.round(seconds / 4))); // a short film still gets an opening, a close and two more to choose from
/** A deal: one opening, one close, the rest spread over the middle categories in a shuffled order. */
export const deal = ({ kind, energy, seconds = 20, seed = 1, n, cat, avoid = [] } = {}) => {
  const r = rand(seed), skip = new Set(avoid), picked = [];
  const pool = (c) => DECK.moves.filter((m) => m.cat === c && fits(m, kind) && !skip.has(m.id) && !picked.includes(m) && !(m.role === "signature" && picked.some((p) => p.role === "signature")));
  const draw = (c) => { const p = pool(c); if (!p.length) return false; let x = r() * p.reduce((s, m) => s + weight(m, energy), 0); for (const m of p) { x -= weight(m, energy); if (x <= 0) { picked.push(m); return true; } } picked.push(p[p.length - 1]); return true; };
  if (cat) { for (let i = 0; i < (n ?? 3); i++) if (!draw(cat)) break; return picked; }
  const total = n ?? count(seconds), order = MIDDLE.map((c) => [r(), c]).sort((a, b) => a[0] - b[0]).map((x) => x[1]);
  draw("open");
  for (let i = 0, dry = 0; picked.length < total - 1 && dry < order.length; i++) dry = draw(order[i % order.length]) ? 0 : dry + 1;
  draw("close");
  return picked.sort((a, b) => CATS.indexOf(a.cat) - CATS.indexOf(b.cat));
};

const card = (m) => `  ${m.id}   [${m.cat} · ${m.role} · ${m.energy}]\n    ${m.move}\n    build: ${m.build}\n    not when: ${m.not}`;
const selfTest = () => {
  let fails = 0; const say = (ok, label) => { if (!ok) fails++; console.log(`  ${ok ? "PASS" : "FAIL"}  ${label}`); };
  const M = DECK.moves, ids = M.map((m) => m.id);
  say(new Set(ids).size === ids.length, `${ids.length} cards, every id unique`);
  say(M.every((m) => CATS.includes(m.cat) && ROLE_W[m.role] && [...ENERGY, "any"].includes(m.energy) && m.kinds.length && m.kinds.every((k) => k === "any" || KINDS.includes(k))), "every card has a known category, role, energy and kind");
  say(M.every((m) => m.move.length > 40 && m.build.length > 20 && m.not.length > 15), "every card says what happens, how it is built, and when not to use it");
  say(CATS.every((c) => M.filter((m) => m.cat === c).length >= 3), "every category has at least three cards to choose between");
  // every file a card cites exists: a card that points at nothing is a rumour
  const have = new Set(); const walk = (d) => { for (const e of readdirSync(d, { withFileTypes: true })) { if (e.name === "node_modules" || e.name.startsWith(".")) continue; if (e.isDirectory()) walk(join(d, e.name)); else have.add(e.name); } };
  walk(join(ROOT, "references")); walk(join(ROOT, "engine", "src")); walk(join(ROOT, "engine", "tools"));
  const cited = [...new Set(M.flatMap((m) => `${m.build} ${m.not} ${m.move}`.match(/[A-Za-z0-9-]+\.(?:ts|mjs|md)\b/g) ?? []))], missing = cited.filter((f) => !have.has(f));
  say(!missing.length, `all ${cited.length} files the cards cite exist${missing.length ? `   missing: ${missing.join(", ")}` : ""}`);
  say(!/\u2014/.test(JSON.stringify(DECK)), "no em dashes in the deck");
  const key = (d) => d.map((m) => m.id).join(",");
  say(key(deal({ kind: "story", energy: "high", seconds: 27, seed: 7 })) === key(deal({ kind: "story", energy: "high", seconds: 27, seed: 7 })), "the same seed deals the same hand");
  say(new Set(Array.from({ length: 40 }, (_, s) => key(deal({ kind: "story", energy: "high", seconds: 27, seed: s + 1 })))).size >= 30, "forty seeds deal at least thirty different hands");
  let rules = true, kinds = true, avoided = true, sizes = true;
  for (let s = 1; s <= 300; s++) for (const kind of KINDS) {
    const energy = ENERGY[s % 3], seconds = 6 + (s % 9) * 7, d = deal({ kind, energy, seconds, seed: s, avoid: ["cam-slow-push"] });
    if (d.filter((m) => m.cat === "open").length !== 1 || d.filter((m) => m.cat === "close").length !== 1 || d.filter((m) => m.role === "signature").length > 1 || new Set(d).size !== d.length) rules = false;
    if (!d.every((m) => fits(m, kind))) kinds = false; if (d.some((m) => m.id === "cam-slow-push")) avoided = false; if (d.length > 12 || d.length > count(seconds) || d.length < 3) sizes = false;
  }
  say(rules, "2100 deals: exactly one opening, exactly one close, at most one signature card, no card twice");
  say(kinds, "no deal holds a card its kind of film cannot use"); say(avoided, "an avoided card is never dealt"); say(sizes, "a deal is a card every four seconds, never fewer than three and never more than twelve");
  const tally = (energy) => { let hi = 0, n = 0; for (let s = 1; s <= 400; s++) for (const m of deal({ kind: "story", energy, seconds: 30, seed: s })) { n++; if (m.energy === "high") hi++; } return hi / n; };
  say(tally("high") > tally("calm") * 1.5, `a high-energy film is dealt more high-energy cards than a calm one (${(tally("high") * 100).toFixed(0)}% against ${(tally("calm") * 100).toFixed(0)}%)`);
  say(deal({ cat: "seam", n: 3, kind: "launch", seed: 3 }).every((m) => m.cat === "seam") && deal({ cat: "seam", n: 3, seed: 3 }).length === 3, "--cat deals from one category only");
  // run through a link, as an installed skill is: the tool must still know it is the one being run
  { const dir = mkdtempSync(join(tmpdir(), "deck-")), link = join(dir, "engine"); let out = "";
    const quiet = [];
    try { symlinkSync(join(ROOT, "engine"), link, "dir"); out = execFileSync(process.execPath, [join(link, "tools", "deck.mjs"), "deal", "--seed", "3", "--kind", "story"], { encoding: "utf8" });
      // every tool that can also be imported by another must still answer when it is the one being run
      for (const t of ["registry", "popscan", "captions", "audio", "build-page", "soundpack"]) { const r = spawnSync(process.execPath, [join(link, "tools", `${t}.mjs`)], { encoding: "utf8", cwd: link }); if (!`${r.stdout}${r.stderr}`.trim()) quiet.push(t); }
    } catch (e) { out = `failed: ${e.message}`; } finally { rmSync(dir, { recursive: true, force: true }); }
    say(out.startsWith("DECK   seed 3") && out.includes("build:"), "run through a symlinked folder, it still deals");
    say(!quiet.length, `six other tools answer through the link too${quiet.length ? `   silent: ${quiet.join(", ")}` : ""}`); }
  console.log(`\nDECK: ${fails ? "FAIL" : "PASS"}`); process.exit(fails ? 1 : 0);
};

if (isMain(import.meta.url)) {
  const die = (m) => { console.error(`deck: ${m}`); process.exit(2); };
  const [cmd, ...args] = process.argv.slice(2), val = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : undefined; };
  const num = (k, least, whole) => { if (!args.includes(k)) return undefined; const x = Number(val(k)); if (val(k) === undefined || !Number.isFinite(x) || x < least || (whole && !Number.isInteger(x))) die(`${k} takes ${whole ? "a whole number" : "a number"} of ${least} or more (got ${val(k)})`); return x; };
  if (cmd === "test") selfTest();
  else if (cmd === "list") { const c = val("--cat"); if (c && !CATS.includes(c)) die(`--cat is one of ${CATS.join(", ")}`); for (const m of DECK.moves.filter((m) => !c || m.cat === c)) console.log(`${m.id.padEnd(30)} ${m.cat.padEnd(9)} ${m.role.padEnd(10)} ${m.energy.padEnd(7)} ${m.kinds.join(",")}`); }
  else if (cmd === "deal") {
    const kind = val("--kind"), energy = val("--energy"), c = val("--cat");
    if (kind && !KINDS.includes(kind)) die(`--kind is one of ${KINDS.join(", ")}`); if (energy && !ENERGY.includes(energy)) die(`--energy is one of ${ENERGY.join(", ")}`); if (c && !CATS.includes(c)) die(`--cat is one of ${CATS.join(", ")}`);
    const seed = num("--seed", 0, true) ?? (Date.now() % 100000), o = { kind, energy, seconds: num("--seconds", 1) ?? 20, seed, n: num("--n", c ? 1 : 3, true), cat: c, avoid: (val("--avoid") ?? "").split(",").filter(Boolean) }, d = deal(o);
    if (args.includes("--json")) console.log(JSON.stringify({ ...o, cards: d }, null, 1));
    else { console.log(`DECK   seed ${seed}${kind ? ` · ${kind}` : ""}${energy ? ` · ${energy}` : ""}${c ? ` · ${c} only` : ` · ${o.seconds} s`} · ${d.length} cards\n`); console.log(d.map(card).join("\n\n")); console.log(`\nKeep, adapt or drop each card, and say why in the brief. To repeat this deal: --seed ${seed}. To deal the next film a different hand: --avoid ${d.map((m) => m.id).join(",")}`); }
  } else die("usage: deck.mjs deal|list|test (see the header of this file)");
}
