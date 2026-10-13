import { Gfx, PENCIL, line, type Ctx, type Env, type P } from "./core";
import type { Film } from "./film";

// KOTONOHA · One kana, one brush.
// Still spot illustration, 720 × 500, transparent ground. Focal point: a large, correctly set
// hiragana あ on a practice sheet. The calligraphy brush, red lesson seal and guide rules make the
// learning context legible when this image is displayed small in the green home card.
// Medium: a diluted sumi-e brush mark on warm washi, composed as a study card for the Kotonoha UI.
// Style plate consulted: engine/src/canvas-core/sumiE.ts and references/styles/sumiE.md.
const LIGHT: P = [-6, -8];
const WASHI: P[] = [
  [174, 55], [223, 45], [501, 50], [539, 69], [548, 410], [526, 438],
  [199, 445], [170, 422], [166, 90],
];
const EDGE: P[] = [[174, 55], [278, 48], [398, 52], [501, 50], [539, 69], [548, 410], [526, 438], [392, 433], [275, 445], [199, 445], [170, 422], [166, 90]];
export const drawKotonohaNook = (ctx: Ctx, _frame: number, env: Env) => {
  const g = new Gfx(ctx, env, 0, PENCIL);
  ctx.setTransform(env.scale, 0, 0, env.scale, 0, 0);
  ctx.clearRect(0, 0, env.W, env.H);
  const fit = Math.min(env.W / 720, env.H / 500);
  g.push((env.W - 720 * fit) / 2, (env.H - 500 * fit) / 2, fit);

  // Soft ink wash around one sheet of washi; the green halo ties it to the home card.
  g.group("paint", () => {
    g.wash([[146, 75], [205, 43], [511, 45], [563, 87], [561, 403], [522, 458], [192, 458], [150, 422]], "#477357", { seed: 11, alpha: 0.2, dx: 0, dy: 0, shrink: 0.92, rim: false });
    g.form(WASHI, "#f3eddf", "#bcb19b", { seed: 12, light: LIGHT, hi: [224, 91, 46, 21, -8] });
    g.wash([[195, 105], [261, 86], [486, 91], [515, 113], [515, 396], [483, 417], [226, 418], [192, 390]], "#e4e7d7", { seed: 13, alpha: 0.26, dx: 0, dy: 0, shrink: 0.94, rim: false });
    // The red corner seal is a familiar lesson-card cue, in the app's warm accent.
    g.form([[463, 84], [503, 80], [508, 121], [468, 125]], "#b85143", "#7f3f36", { seed: 14, light: LIGHT, alpha: 0.94 });
  });

  // Printed study labels say exactly what the image is, even when the art is displayed small.
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#59655b";
  ctx.font = '700 27px system-ui, sans-serif';
  ctx.fillText("HIRAGANA", 332, 111);
  ctx.fillStyle = "#202b28";
  ctx.font = '245px "Noto Serif JP", "Yu Mincho", "Hiragino Mincho ProN", serif';
  ctx.fillText("あ", 342, 252);
  ctx.fillStyle = "#796f60";
  ctx.font = '600 32px system-ui, sans-serif';
  ctx.fillText("a", 485, 277);
  ctx.fillStyle = "#fff2df";
  ctx.font = '700 22px system-ui, sans-serif';
  ctx.fillText("N5", 488, 102);
  ctx.restore();

  // A real brush on the lower margin makes the Japanese calligraphy context explicit.
  g.group("paint", () => {
    g.form([[233, 366], [433, 386], [494, 407], [481, 427], [414, 412], [232, 388]], "#777a71", "#424a46", { seed: 23, light: LIGHT });
    g.form([[211, 352], [245, 358], [238, 391], [207, 382], [198, 369]], "#d4c4a8", "#8e7c63", { seed: 24, light: LIGHT });
    g.form([[190, 344], [211, 352], [198, 369], [181, 366], [176, 357]], "#303b38", "#161d1b", { seed: 25, light: LIGHT });
  });

  g.group("ink", () => {
    g.pen(EDGE, { seed: 31, closed: true, w: 1, color: "#867e6e", opacity: 0.52, wobble: 0.4, boil: 0 });
    // Ruled guides are light and sparse; they frame rather than compete with the kana.
    [320, 348, 376].forEach((y, i) => g.pen(line([252, y], [430, y + 3], -1), { seed: 32 + i, w: 0.55, color: "#9ca58f", opacity: 0.56, retrace: false, boil: 0 }));
    g.pen([[477, 91], [495, 89], [498, 117], [479, 119], [477, 91]], { seed: 35, closed: true, w: 0.8, color: "#f5dfc8", opacity: 0.8, retrace: false, boil: 0 });
    // Brush handle, ferrule and individual bristle tips.
    g.pen([[233, 367], [305, 376], [410, 398], [486, 414]], { seed: 36, w: 1.1, color: "#524a3d", opacity: 0.76, taper: 0.25, boil: 0 });
    g.pen([[211, 352], [235, 359], [231, 389]], { seed: 37, w: 0.8, color: "#71604b", opacity: 0.72, taper: 0.25, boil: 0 });
    g.pen([[198, 365], [187, 367], [176, 357]], { seed: 38, w: 0.8, color: "#292f2c", opacity: 0.8, taper: 0.5, boil: 0 });
  });

  // The sheet keeps its fibre only; the rest of the PNG is clear against the green hero.
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(WASHI[0][0], WASHI[0][1]);
  WASHI.slice(1).forEach(([x, y]) => ctx.lineTo(x, y));
  ctx.closePath();
  ctx.clip();
  g.paper("coldpress", 0.08);
  ctx.restore();
  g.pop();
};

export const kotonohaNook: Film = {
  meta: { title: "Kotonoha · One kana, one brush", W: 720, H: 500, fps: 30, bpm: 60, durationFrames: 1 },
  assets: { images: {} },
  shots: [{ id: "kotonohaNook", start: 0, end: 1, draw: drawKotonohaNook }],
};
