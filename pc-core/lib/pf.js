// Shared drawing helpers and conventions of this book (BOOK.md). Load after engine.js, before a chapter's script.
'use strict';
const HERO = COL.whole, FOE = COL.nat, RULE = COL.task, OK = COL.good, NO = COL.bad, GMC = COL.rat;
// Modes of play: exploration, encounter, downtime.
const EXP = COL.irr, ENC = COL.nat, DOWN = COL.real;
const WIDE = { x: 96, y: 56, w: 1408, cls: 'side', maxH: 790 };

const say = (p, str, x, y, t0, { size = 30, fill = COL.chalk, anchor = 'middle', weight = 500 } = {}) => {
  const e = T(p, str, { x, y, size, fill, anchor, weight, o: 0 });
  show(e, t0);
  return e;
};
// A participant: ring with the first letter, name below.
function who(p, label, color, x, y, t0, r = 46) {
  const g = G(p, { x, y, o: 0 });
  mk('circle', { r, fill: COL.board, stroke: color, 'stroke-width': 4 }, g);
  T(g, label[0], { y: r * .36, size: r, fill: color, weight: 700, anchor: 'middle' });
  T(g, label, { y: r + 36, size: 24, fill: COL.dim, weight: 600, anchor: 'middle' });
  show(g, t0);
  return g;
}
// PF2e action glyphs: n diamonds, or 'r' for a reaction.
function actGlyph(p, n, x, y, color, t0) {
  const g = G(p, { x, y, o: 0 });
  if (n === 'r') {
    path(g, 'M-6 22A24 24 0 1 1 20 8', { stroke: color, 'stroke-width': 7 });
    mk('path', { d: 'M8 -2L24 12L30 -8Z', fill: color }, g);
  } else for (let i = 0; i < n; i++) mk('path', { d: `M${i * 36 - (n - 1) * 18} -24l24 24l-24 24l-24 -24z`, fill: color }, g);
  show(g, t0);
  return g;
}
function yesNo(p, good, x, y, t0, s = 1) {
  const g = G(p, { x, y, o: 0, s });
  path(g, good ? 'M-14 0L-4 11L16 -12' : 'M-12 -12L12 12M12 -12L-12 12', { stroke: good ? OK : NO, 'stroke-width': 6 });
  show(g, t0);
  return g;
}
const arrowTo = (p, x1, y1, x2, y2, color, t0, dash) => {
  const a = Math.atan2(y2 - y1, x2 - x1), hx = x2 - 22 * Math.cos(a), hy = y2 - 22 * Math.sin(a);
  const g = G(p, { o: 0 });
  path(g, `M${x1} ${y1}L${hx} ${hy}`, { stroke: color, 'stroke-width': 5, ...(dash ? { 'stroke-dasharray': '14 10' } : {}) });
  mk('path', { d: `M${x2} ${y2}L${hx - 12 * Math.sin(a)} ${hy + 12 * Math.cos(a)}L${hx + 12 * Math.sin(a)} ${hy - 12 * Math.cos(a)}Z`, fill: color }, g);
  show(g, t0);
  return g;
};
// A card of short lines: title in colour, then text lines.
function infoCard(p, x, y, w, title, lines, color, t0, step = .5) {
  const box = mk('rect', { x, y, width: w, height: 86 + lines.length * 46, rx: 18, fill: '#22322d', stroke: color, 'stroke-width': 2.5 }, p);
  put(box, { o: 0 }); show(box, t0);
  say(p, title, x + 28, y + 50, t0, { size: 30, fill: color, anchor: 'start', weight: 700 });
  return lines.map((ln, i) => {
    const [str, fill = COL.chalk] = [].concat(ln);
    return say(p, str, x + 28, y + 100 + i * 46, t0 + .3 + i * step, { size: 25, fill, anchor: 'start' });
  });
}
// Die outline by number of sides (4, 6, 8, 10, 12, 20), drawn around (0,0) with a «кN» label below; label null hides it,
// inner false keeps only the contour (room for a number inside).
const DIE_SHAPES = {
  4: 'M0 -1L.95 .7H-.95Z',
  6: 'M-.75 -.75H.75V.75H-.75Z',
  8: 'M0 -1L.8 0L0 1L-.8 0ZM-.8 0H.8',
  10: 'M0 -1L.85 -.15L0 1L-.85 -.15ZM-.85 -.15L0 .25L.85 -.15M0 .25V1',
  12: 'M0 -1L.95 -.31L.59 .81H-.59L-.95 -.31Z',
  20: 'M0 -1L.87 -.5V.5L0 1L-.87 .5V-.5ZM0 -.5L.5 .3H-.5Z',
};
function dieShape(p, sides, x, y, color, t0, size = 60, label = 'к' + sides, inner = true) {
  const g = G(p, { x, y, o: 0 });
  const d = inner ? DIE_SHAPES[sides] : DIE_SHAPES[sides].split('Z')[0] + 'Z';
  path(g, d.replace(/-?[\d.]+/g, v => +(v * size).toFixed(1)), { stroke: color, 'stroke-width': 4, 'stroke-linejoin': 'round', fill: '#22322d' });
  if (label) T(g, label, { y: size + 44, size: 28, fill: color, weight: 700, anchor: 'middle' });
  if (t0 != null) show(g, t0);
  return g;
}
// A spoken line in a pill-shaped frame centred on (x, y); the tail sits under the middle ('down') or near the left/right end.
function bubble(p, str, x, y, color, t0, { size = 26, w = str.length * size * .54 + 64, side = 'down' } = {}) {
  const g = G(p, { x, y, o: 0 }), r = (size + 34) / 2, a = w / 2 - r;
  const tx = { down: 0, left: -a - 6, right: a + 6 }[side];
  path(g, `M${-a} ${-r}H${a}A${r} ${r} 0 0 1 ${a} ${r}H${tx + 14}L${tx} ${r + 18}L${tx - 14} ${r}H${-a}A${r} ${r} 0 0 1 ${-a} ${-r}Z`,
    { fill: '#22322d', stroke: color, 'stroke-width': 2.5, 'stroke-linejoin': 'round' });
  T(g, str, { y: size * .36, size, fill: color, weight: 600, anchor: 'middle' });
  if (t0 != null) show(g, t0);
  return g;
}
// A word in a rounded frame (UI font, unlike the engine's math chip), centred on (x, y); hidden until t0.
function pill(p, str, color, x, y, t0, size = 30) {
  const g = G(p, { x, y, o: 0 }), w = str.length * size * .56 + 44, h = size + 26;
  mk('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: h / 2, fill: '#22322d', stroke: color, 'stroke-width': 2.5 }, g);
  T(g, str, { y: size * .36, size, fill: color, weight: 600, anchor: 'middle' });
  if (t0 != null) { put(g, { s: .6 }); pop(g, t0); }
  return g;
}
// A line of coloured pieces [[text, colour], …] in one text element; hidden until t0.
function colorLine(p, parts, x, y, t0, { size = 30, anchor = 'middle', weight = 600 } = {}) {
  const e = T(p, '', { x, y, size, anchor, weight, o: 0 });
  parts.forEach(([s, c = COL.chalk]) => { mk('tspan', { fill: c }, e).textContent = s; });
  if (t0 != null) show(e, t0);
  return e;
}
// Numbered takeaways for a wrap beat: items [[text, mark], …] slide in on their marks (ch03).
function numbered(p, items, m, y0 = 230, dy = 130, size = 32) {
  items.forEach(([str, mark], i) => {
    const g = G(p, { x: -16, y: y0 + i * dy, o: 0 });
    mk('circle', { cx: 110, cy: -12, r: 26, fill: RULE }, g);
    T(g, String(i + 1), { x: 110, y: -1, size: 30, fill: COL.board, weight: 700, anchor: 'middle' });
    T(g, str, { x: 166, size, weight: 600 });
    tw(g, { o: 1, x: 0 }, m(mark), .6);
  });
}

// The attribute board (ch04, ch05): six columns, a zero line, four dashed cells up to the +4 line and one below for a flaw.
const ATTRS = ['Сила', 'Ловкость', 'Выносливость', 'Интеллект', 'Мудрость', 'Харизма'];
const CH = 42;   // one cell of the attribute board
const sgn = v => v > 0 ? '+' + v : v < 0 ? '−' + -v : '0';
// A boost or flaw token centred on (x, y): 'fix' — solid amber (a named attribute), 'free' — dashed amber, 'flaw' — red.
function boostToken(p, str, kind, x, y, t0, size = 24) {
  const colr = kind === 'flaw' ? NO : RULE, w = uiW(str, size) + 40, h = size + 22;
  const g = G(p, { x, y, o: 0, s: .6 });
  mk('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: h / 2, fill: kind === 'free' ? '#22322d' : mix(COL.board, colr, .3),
    stroke: colr, 'stroke-width': 2.5, ...(kind === 'free' ? { 'stroke-dasharray': '7 5' } : {}) }, g);
  T(g, str, { y: size * .36, size, fill: colr, weight: 600, anchor: 'middle' });
  if (t0 != null) pop(g, t0);
  return g;
}
// The board centred on cx with its zero line at y0; value under each name.
function attrBoard(p, cx, y0, t0, { dx = 200, cw = 100, nameSize = 24 } = {}) {
  const g = G(p, { o: 0 }), cols = [];
  const xL = cx - 2.5 * dx - cw / 2 - 20, xR = cx + 2.5 * dx + cw / 2 + 20;
  ATTRS.forEach((name, i) => {
    const x = cx + (i - 2.5) * dx;
    for (let k = 0; k < 5; k++) {
      const y = k < 4 ? y0 - (k + 1) * CH + 3 : y0 + 3;
      mk('rect', { x: x - cw / 2, y, width: cw, height: CH - 6, rx: 6, fill: 'none', stroke: COL.faint, 'stroke-width': 2, 'stroke-dasharray': '6 5' }, g);
    }
    T(g, name, { x, y: y0 + CH + 36, size: nameSize, weight: 600, anchor: 'middle' });
    const val = T(g, '0', { x, y: y0 + CH + 84, size: 38, fill: HERO, weight: 700, anchor: 'middle' });
    cols.push({ x, val, up: [], dn: null, v: 0 });
  });
  path(g, `M${xL} ${y0}H${xR}`, { stroke: COL.dim, 'stroke-width': 3 });
  const capY = y0 - 4 * CH, cap = path(g, `M${xL} ${capY}H${xR}`, { stroke: COL.faint, 'stroke-width': 2 });
  show(g, t0);
  return { p, cols, y0, cw, capY, cap, xL, xR };
}
// Column i changes by d (+1 boost, −1 flaw) at t0: a cell fills and the value updates.
// ponytail: a boost on a flawed column stacks above zero instead of cancelling the flaw; no example needs that.
function bump(b, i, d, t0) {
  const c = b.cols[i], colr = d > 0 ? RULE : NO;
  const y = d > 0 ? b.y0 - (c.up.length + 1) * CH + 3 : b.y0 + 3;
  const r = mk('rect', { x: c.x - b.cw / 2, y, width: b.cw, height: CH - 6, rx: 6, fill: colr, 'fill-opacity': .55, stroke: colr, 'stroke-width': 2 }, b.p);
  put(r, { o: 0 }); show(r, t0, .3);
  if (d > 0) c.up.push(r); else c.dn = r;
  const v = (c.v += d);
  prog(() => { c.val.textContent = sgn(v); }, t0, 0);
  pulse(c.val, t0, 1.35);
  return r;
}
// A token flies into column i and becomes a cell there.
function give(b, tk, i, d, t0) {
  const c = b.cols[i], ty = d > 0 ? b.y0 - (c.up.length + .5) * CH : b.y0 + CH / 2;
  tw(tk, { x: c.x, y: ty, s: .7 }, t0, .7);
  hide(tk, t0 + .6, .25);
  return bump(b, i, d, t0 + .65);
}
// Every column back to 0 at t0.
function clearBoard(b, t0) {
  b.cols.forEach(c => {
    [...c.up, c.dn].forEach(r => r && hide(r, t0, .4));
    c.up = []; c.dn = null; c.v = 0;
    prog(() => { c.val.textContent = '0'; }, t0 + .2, 0);
  });
}
