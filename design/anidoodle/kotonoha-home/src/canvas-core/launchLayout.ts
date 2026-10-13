// LAUNCH LAYOUT. One timeline, four frame shapes, and a layout function between them: the chat, the
// type frames, the cards, the split feature beats and the end card are RE-COMPOSED for each shape,
// never cropped out of a wide render. 16x9 is the desktop composition (the numbers the template was
// built on, kept exactly); 1x1, 4x5 and 9x16 are phone compositions with phone-safe type: every line
// a viewer must read is at least `minPx` tall at the delivered size (32 px at 1080 across is about
// 11 pt on a 360 pt wide phone, the smallest body size a platform UI uses).
//
//   const L = launchLayout("9x16", { prompts, install, tagline });
//   L.W, L.H            the frame
//   L.chat              the chat component's geometry (drawChatFrame, caretAt, inkDrop, inkCard)
//   L.thread / L.cam    the thread's rhythm and the camera's rests
//   L.type / L.end      the word pages and the end card
//   L.split             a feature beat: the words' column and the live UI's, which never overlap
//   L.stage / L.band    the picture's area and, with captions burned in, the captions' own band
//   L.roles             every text role and its size, which launchLayout checks against minPx
import { CHAT_GEOM, chatGeom, type ChatGeom, type Rect } from "./launchKit";
import type { Cam } from "./launchKit";
import type { P } from "./core";

export type Shape = "16x9" | "1x1" | "4x5" | "9x16";
export const SHAPES: Record<Shape, { W: number; H: number; use: string }> = {
  "16x9": { W: 1920, H: 1080, use: "YouTube, the site, the README" },
  "1x1": { W: 1080, H: 1080, use: "X and LinkedIn feeds" },
  "4x5": { W: 1080, H: 1350, use: "Instagram and LinkedIn feeds (the tallest feed post)" },
  "9x16": { W: 1080, H: 1920, use: "Reels, Shorts, TikTok, Stories" },
};
export const isShape = (s: string): s is Shape => s in SHAPES;
export const parseShapes = (s: string): Shape[] => {
  const out = s.split(",").map((x) => x.trim()).filter(Boolean);
  const bad = out.filter((x) => !isShape(x));
  if (bad.length || !out.length) throw new Error(`shapes: '${bad.join(", ") || s}' is not a shape; use ${Object.keys(SHAPES).join(", ")}`);
  return out as Shape[];
};
// phone-safe minimums, px at the delivered size: `read` = a line the viewer must read (a prompt, a
// label, the words, the install lines); `chrome` = the UI around them (a header, a button's word)
export const MIN_PX = { phone: { read: 32, chrome: 24, type: 64 }, desk: { read: 18, chrome: 16, type: 80 } };

// A build-time estimate of a sans line's width, deliberately a little wide: layout decisions (how
// many lines a bubble or a composer needs) are taken before any canvas exists, and an estimate that
// errs wide wraps one word early instead of running under the button.
const NARROW = new Set([..."il.,:;'|!ijtf()[] "]), SEMI = new Set([..."rsz-\"*"]), WIDE = new Set([..."mw"]), CAPW = new Set([..."MW"]);
export const estWidth = (text: string, px: number) => [...text].reduce((a, ch) => a + px * (NARROW.has(ch) ? 0.3 : SEMI.has(ch) ? 0.48 : WIDE.has(ch) ? 0.88 : CAPW.has(ch) ? 0.98 : /[A-Z]/.test(ch) ? 0.72 : /[0-9]/.test(ch) ? 0.6 : 0.6), 0);
export const monoWidth = (text: string, px: number) => text.length * px * 0.61;
export const wrapEst = (text: string, px: number, maxW: number): string[] => {
  const out: string[] = []; let line = "";
  for (const w of text.split(" ")) { const t = line ? `${line} ${w}` : w; if (!line || estWidth(t, px) <= maxW) line = t; else { out.push(line); line = w; } }
  out.push(line); return out;
};

export type Role = { role: string; px: number; min: number };
export type LaunchLayout = {
  shape: Shape; W: number; H: number; k: number; phone: boolean;
  chat: ChatGeom;
  thread: { top: number; viewBottom: number; clip: [number, number, number, number]; bubbleH: number; bubbleLineH: number; bubblePad: number; bubbleR: number; bubbleMaxW: number; bubbleRad: number; gap: number; card: number; cardX: number; cardDy: number; bubbles: string[][] };
  cam: { home: Cam; macroZ: number; macroCreep: number; macroX0: number; macroY: number; follow: boolean; leanZ: number; pointerOff: P; pointerS: number; pointerOn: P };
  bug: { x: number; y: number; px: number };
  type: { maxW: number; cap1: number; capN: number; minPx: number; cover: number };
  end: { cx: number; titleY: number; titleMax: number; titleW: number; tagline: string[]; taglineY: number; taglinePx: number; taglineLH: number; panelY: number; monoPx: number; rowH: number; padX: number; lineY0: number; footerPx: number; footerY: number; caret: [number, number] };
  split: { words: Rect; ui: Rect; vertical: boolean; wordsPx: number };
  stage: Rect; band: Rect | null;
  roles: Role[];
};
export type LayoutContent = { prompts: string[]; install: string[]; tagline: string; title?: string; band?: boolean };

// the desktop composition: the exact numbers of the 1920x1080 film
const desk = (c: LayoutContent): LaunchLayout => {
  const W = 1920, H = 1080, g = CHAT_GEOM, VIEW_BOTTOM = g.INPUT.y - 26, py = 590, n = c.install.length, ph = 60 * n + 50;
  return {
    shape: "16x9", W, H, k: 1, phone: false, chat: g,
    thread: { top: 170, viewBottom: VIEW_BOTTOM, clip: [300, 158, 1320, VIEW_BOTTOM - 158], bubbleH: 58, bubbleLineH: 34, bubblePad: 26, bubbleR: 1560, bubbleMaxW: 1080, bubbleRad: 22, gap: 26, card: 460, cardX: g.REPLY.x, cardDy: 34, bubbles: c.prompts.map((p) => [p]) },
    cam: { home: { c: [960, 540], z: 1 }, macroZ: 2.4, macroCreep: 0.25, macroX0: 330, macroY: 934, follow: true, leanZ: 1.18, pointerOff: [1780, 1140], pointerS: 1.35, pointerOn: [g.GEN.x + g.GEN.w / 2 + 18, g.GEN.y + g.GEN.h / 2 + 6] },
    bug: { x: W - 40, y: H - 34, px: 24 },
    type: { maxW: 1560, cap1: 190, capN: 130, minPx: MIN_PX.desk.type, cover: 1110 },
    end: { cx: W / 2, titleY: 400, titleMax: 150, titleW: 1300, tagline: [c.tagline], taglineY: 520, taglinePx: 30, taglineLH: 40, panelY: py, monoPx: 30, rowH: 60, padX: 60, lineY0: py + 55, footerPx: 24, footerY: py + ph + 60, caret: [16, 34] },
    // a two-column grid on the frame's centre line: words 40 %, a 100 px gutter, the live UI 46 %, equal margins
    split: { words: { x: 150, y: 150, w: 720, h: 780 }, ui: { x: 970, y: 120, w: 800, h: 840 }, vertical: false, wordsPx: 96 },
    stage: { x: 0, y: 0, w: W, h: H }, band: null,
    roles: [],
  };
};

// the phone compositions: one column, the chat as tall as the frame allows, type sizes floored at the phone minimums
const phone = (shape: Exclude<Shape, "16x9">, c: LayoutContent, H0: number): LaunchLayout => {
  const W = 1080, H = H0, m = 40, k = { "1x1": 1.12, "4x5": 1.22, "9x16": 1.36 }[shape], min = MIN_PX.phone;
  const px = { head: Math.max(22 * k, min.chrome), sub: Math.max(18 * k, min.chrome), bubble: Math.max(26 * k, min.read), label: Math.max(20 * k, min.read), gen: Math.max(24 * k, min.chrome) };
  // the window stops above the corner mark's own strip: the mark never sits on the UI
  const bugPx = Math.max(24 * k, min.chrome), bugStrip = Math.round(bugPx + 34);
  const promptPx = Math.max(34 * k, min.read), chatR = { x: m, y: m, w: W - 2 * m, h: H - m - bugStrip, r: 34 * k };
  // the composer holds the longest prompt; the button sits on its last line
  const base = chatGeom(chatR, k, px, promptPx, 1), textW = base.GEN.x - 20 * k - base.TEXT.x;
  const lines = Math.min(3, Math.max(1, ...c.prompts.map((p) => wrapEst(p, promptPx, textW).length)));
  const g = chatGeom(chatR, k, px, promptPx, lines);
  const top = g.CHAT.y + 114 * k, viewBottom = g.INPUT.y - 26 * k, bubbleMaxW = g.INPUT.w * 0.86, bubbleLineH = Math.round(px.bubble * 1.3);
  const bubbles = c.prompts.map((p) => wrapEst(p, px.bubble, bubbleMaxW - 52 * k));
  // the answer card: as wide as the thread allows, and short enough that a card and the prompt above it both fit the view
  const card = Math.round(Math.min(g.INPUT.w, viewBottom - top - 58 * k - 2 * bubbleLineH - 60 * k));
  const cardX = g.CHAT.x + (g.CHAT.w - card) / 2;
  // the end card, stacked and centred in the frame
  const mono = Math.min(30 * k, ...c.install.map((s) => (W - 2 * 32 - 2 * 36) / (s.length * 0.61)));
  const taglinePx = Math.max(30 * k, min.read), tagline = wrapEst(c.tagline, taglinePx, W - 2 * m - 60), tLH = Math.round(taglinePx * 1.3);
  const titleMax = 150 * k, rowH = Math.round(mono * 2), ph = rowH * c.install.length + 50 * k;
  const block = titleMax + 60 + tagline.length * tLH + 60 + ph + 80, y0 = (H - block) / 2 - 20;
  const titleY = y0 + titleMax * 0.62, taglineY = y0 + titleMax + 60 + tLH / 2, panelY = taglineY + (tagline.length - 0.5) * tLH + 50;
  const split = shape === "9x16"
    ? { words: { x: 90, y: 150, w: W - 180, h: 520 }, ui: { x: m + 20, y: 720, w: W - 2 * m - 40, h: H - 720 - 150 }, vertical: true, wordsPx: 96 }
    : { words: { x: 80, y: 90, w: W - 160, h: Math.round(H * 0.3) }, ui: { x: m + 20, y: Math.round(H * 0.3) + 130, w: W - 2 * m - 40, h: H - Math.round(H * 0.3) - 130 - 90 }, vertical: true, wordsPx: shape === "1x1" ? 76 : 84 };
  // the hook: the prompt big, the camera gliding after the caret (and down a line when the words wrap)
  const macroZ = { "1x1": 1.85, "4x5": 1.95, "9x16": 2.05 }[shape];
  return {
    shape, W, H, k, phone: true, chat: g,
    thread: { top, viewBottom, clip: [g.CHAT.x, g.CHAT.y + 102 * k, g.CHAT.w, viewBottom - (g.CHAT.y + 102 * k)], bubbleH: 58 * k + (px.bubble - 26 * k) * 1.2, bubbleLineH, bubblePad: 26 * k, bubbleR: g.INPUT.x + g.INPUT.w, bubbleMaxW, bubbleRad: 22 * k, gap: 26 * k, card, cardX, cardDy: 34 * k + (px.label - 20 * k), bubbles },
    cam: { home: { c: [W / 2, H / 2], z: 1 }, macroZ, macroCreep: macroZ * 0.08, macroX0: W / 2 / macroZ - 60 * k, macroY: g.INPUT.y + g.INPUT.h / 2, follow: true, leanZ: 1.1, pointerOff: [W - 110, H + 70], pointerS: 1.35 * k, pointerOn: [g.GEN.x + g.GEN.w / 2 + 18 * k, g.GEN.y + g.GEN.h / 2 + 6 * k] },
    bug: { x: W - m - 10, y: H - bugStrip / 2 + bugPx * 0.1, px: bugPx },
    type: { maxW: W - 2 * 90, cap1: 190, capN: 150, minPx: min.type, cover: Math.ceil(Math.hypot(W, H) / 2) + 9 },
    end: { cx: W / 2, titleY, titleMax, titleW: W - 2 * m - 80, tagline, taglineY, taglinePx, taglineLH: tLH, panelY, monoPx: mono, rowH, padX: 36, lineY0: panelY + 25 * k + rowH / 2, footerPx: Math.max(24 * k, min.read), footerY: panelY + ph + 60, caret: [Math.round(mono * 0.53), Math.round(mono * 1.13)] },
    split, stage: { x: 0, y: 0, w: W, h: H }, band: null,
    roles: [],
  };
};

// the caption band, when captions are burned in: its own strip under the picture, never over it.
// The layout is composed for the picture's area (the stage), and the band is drawn below it.
const BAND = { "16x9": 0, "1x1": 150, "4x5": 170, "9x16": 230 };

/** The layout of a launch film in `shape`, for this content. Throws when a line a viewer must read cannot be phone-safe. */
export const launchLayout = (shape: Shape, c: LayoutContent): LaunchLayout => {
  if (!isShape(shape)) throw new Error(`launchLayout: '${shape}' is not a shape; use ${Object.keys(SHAPES).join(", ")}`);
  const { W, H } = SHAPES[shape], band = c.band ? BAND[shape] : 0;
  if (c.band && shape === "16x9") throw new Error("launchLayout 16x9: burned-in captions are for the phone shapes (1x1, 4x5, 9x16); a 16x9 film ships its captions as a .srt/.vtt sidecar");
  // (a wide frame plays where sidecar captions work, YouTube, LinkedIn, the site: its captions ship as .srt/.vtt)
  const L = shape === "16x9" ? desk(c) : phone(shape, c, H - band);
  L.H = H; L.stage = { x: 0, y: 0, w: W, h: H - band }; L.band = band ? { x: 0, y: H - band, w: W, h: band } : null;
  const min = L.phone ? MIN_PX.phone : MIN_PX.desk, g = L.chat;
  L.roles = [
    { role: "prompt", px: g.TEXT.px, min: min.read }, { role: "bubble", px: g.px.bubble, min: min.read }, { role: "card label", px: g.px.label, min: min.read },
    { role: "thread title", px: g.px.head, min: min.chrome }, { role: "thread subtitle", px: g.px.sub, min: min.chrome }, { role: "button", px: g.px.gen, min: min.chrome },
    { role: "tagline", px: L.end.taglinePx, min: min.read }, { role: "install lines", px: L.end.monoPx, min: min.read }, { role: "footer", px: L.end.footerPx, min: min.chrome },
    { role: "corner mark", px: L.bug.px, min: min.chrome }, { role: "feature words", px: L.split.wordsPx, min: min.type * 0.75 },
  ];
  const small = L.roles.filter((r) => r.px < r.min - 1e-9);
  if (small.length) throw new Error(`launchLayout ${shape}: ${small.map((r) => `${r.role} would be ${r.px.toFixed(1)} px (phone-safe minimum ${r.min} px)`).join("; ")}${small.some((r) => r.role === "install lines") ? ". Shorten the install line, or ship this shape without it" : ""}`);
  return L;
};

