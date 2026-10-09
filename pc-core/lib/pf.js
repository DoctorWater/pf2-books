// Shared drawing helpers and conventions of this book (BOOK.md). Load after engine.js, before a chapter's script.
'use strict';
const HERO = COL.whole, FOE = COL.nat, RULE = COL.task, OK = COL.good, NO = COL.bad, GMC = COL.rat;
// Modes of play: exploration, encounter, downtime.
const EXP = COL.irr, ENC = COL.nat, DOWN = COL.real;
const WIDE = { x: 96, y: 56, w: 1408, cls: 'side', maxH: 830 };

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
// PF2e action glyphs: n diamonds, 'r' for a reaction, 'f' for a free action (hollow diamond, ch08).
function actGlyph(p, n, x, y, color, t0) {
  const g = G(p, { x, y, o: 0 });
  if (n === 'f') mk('path', { d: 'M0 -22l22 22l-22 22l-22 -22z', fill: 'none', stroke: color, 'stroke-width': 5, 'stroke-linejoin': 'round' }, g);
  else if (n === 'r') {
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
// Die outline by number of sides (4, 6, 8, 10, 12, 20), drawn around (0,0) with a «dN» label below; label null hides it,
// inner false keeps only the contour (room for a number inside).
const DIE_SHAPES = {
  4: 'M0 -1L.95 .7H-.95Z',
  6: 'M-.75 -.75H.75V.75H-.75Z',
  8: 'M0 -1L.8 0L0 1L-.8 0ZM-.8 0H.8',
  10: 'M0 -1L.85 -.15L0 1L-.85 -.15ZM-.85 -.15L0 .25L.85 -.15M0 .25V1',
  12: 'M0 -1L.95 -.31L.59 .81H-.59L-.95 -.31Z',
  20: 'M0 -1L.87 -.5V.5L0 1L-.87 .5V-.5ZM0 -.62L.54 .31H-.54Z' +  // icosahedron face-on: front face at 0.618 of the outline
    'M0 -.62V-1M0 -.62L.87 -.5M0 -.62L-.87 -.5M.54 .31L.87 -.5M.54 .31L.87 .5M.54 .31L0 1M-.54 .31L-.87 -.5M-.54 .31L-.87 .5M-.54 .31L0 1',
};
function dieShape(p, sides, x, y, color, t0, size = 60, label = 'd' + sides, inner = true) {
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
  b.sheet?.set('a' + b.cols.indexOf(c), sgn(v), t0);
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

// The character sheet (ch04–ch06): a fixed panel with every field of a PF2e sheet; unfilled fields show a dim «—».
// Page 1 fields: name, lvl, anc, her, bg, cls, a0…a5 (attributes in ATTRS order), hp, ac, per, fort, ref, will, sk0…sk4 (name + rank),
// ft_anc, ft_skill, ft_cls, size, spd, sense, lang, prof.
// Page 2 (equipment, ch06; page(2) flips to it): gold, it0…it6 (item + price), st0…st2 (Strike + bonus and damage), bulk, cdc, hero.
const SHEET = { x: 1110, y: 16, w: 474, h: 868 };
const SHEET_FIELDS = [   // key, kind (plain | stack: label above | inline: label left | row: list line), label, x, y, size, colour, offset, highlight width, page (1 by default)
  ['name', 'plain', '', 20, 50, 34, HERO, 0, 240], ['lvl', 'inline', 'Уровень', 300, 48, 24, COL.chalk, 84, 80],
  ['anc', 'stack', 'Народ', 20, 70, 22, COL.chalk, 0, 215], ['her', 'stack', 'Родословная', 245, 70, 22, COL.chalk, 0, 215],
  ['bg', 'stack', 'Происхождение', 20, 126, 22, COL.chalk, 0, 215], ['cls', 'stack', 'Класс', 245, 126, 22, COL.chalk, 0, 215],
  ...ATTRS.map((n, i) => ['a' + i, 'stack', n, 20 + (i % 3) * 155, 188 + (i > 2) * 62, 32, HERO, 0, 140]),
  ['hp', 'stack', 'ПЗ', 20, 322, 32], ['ac', 'stack', 'КБ', 175, 322, 32], ['per', 'stack', 'Внимание', 330, 322, 32],
  ['fort', 'stack', 'Стойкость', 20, 386, 32], ['ref', 'stack', 'Реакция', 175, 386, 32], ['will', 'stack', 'Воля', 330, 386, 32],
  ...[0, 1, 2, 3, 4].map(i => ['sk' + i, 'row', '', 20, 512 + i * 26, 22, COL.chalk, 0, 434]),
  ['ft_anc', 'inline', 'Черта народа', 20, 654, 21, COL.chalk, 140, 300], ['ft_skill', 'inline', 'Черта навыка', 20, 682, 21, COL.chalk, 140, 300],
  ['ft_cls', 'inline', 'Черта класса', 20, 710, 19, COL.chalk, 140, 300],
  ['size', 'inline', 'Размер', 20, 756, 21, COL.chalk, 76, 150], ['spd', 'inline', 'Скорость', 245, 756, 21, COL.chalk, 92, 150],
  ['sense', 'inline', 'Чувства', 20, 784, 21, COL.chalk, 84, 300], ['lang', 'inline', 'Языки', 20, 812, 21, COL.chalk, 70, 340],
  ['prof', 'inline', 'Оружие, броня, магия', 20, 840, 21, RULE, 218, 120],
  ['gold', 'stack', 'Кошелёк', 20, 70, 32, COL.chalk, 0, 400, 2],
  ...[0, 1, 2, 3, 4, 5, 6].map(i => ['it' + i, 'row', '', 20, 206 + i * 34, 22, COL.chalk, 0, 434, 2]),
  ...[0, 1, 2].map(i => ['st' + i, 'row', '', 20, 494 + i * 34, 22, COL.chalk, 0, 434, 2]),
  ['bulk', 'inline', 'Вес', 20, 636, 24, COL.chalk, 66, 150, 2], ['cdc', 'inline', 'Классовая СЛ', 20, 682, 24, COL.chalk, 132, 100, 2],
  ['hero', 'inline', 'Пункты героизма', 20, 728, 24, COL.chalk, 168, 100, 2],
];
function charSheet(p, t0) {
  const g = G(p, { x: SHEET.x, y: SHEET.y, o: 0 }), f = {};
  mk('rect', { width: SHEET.w, height: SHEET.h, rx: 18, fill: '#22322d', stroke: COL.faint, 'stroke-width': 2.5 }, g);
  const pg = [G(g), G(g, { o: 0 })], line = (q, y) => path(q, `M20 ${y}H${SHEET.w - 20}`, { stroke: COL.faint, 'stroke-width': 1.5 });
  [62, 180, 312, 454, 636, 738].forEach(y => line(pg[0], y));
  T(pg[0], 'Навыки', { x: 20, y: 482, size: 17, fill: COL.dim, weight: 600 });
  [62, 150, 438, 594].forEach(y => line(pg[1], y));
  [['Страница 2 · снаряжение', 40, 20], ['Куплено', 178, 17], ['Удары', 466, 17]].forEach(([s, y, size]) => T(pg[1], s, { x: 20, y, size, fill: COL.dim, weight: 600 }));
  SHEET_FIELDS.forEach(([key, kind, label, x, y, size, col = COL.chalk, off = 0, bw = 150, n = 1]) => {
    const q = pg[n - 1], lab = (s, x, y) => T(q, s, { x, y, size: 17, fill: COL.dim, weight: 600 });
    let vx = x, vy = y;
    if (kind === 'stack') { lab(label, x, y + 15); vy = y + 15 + size + 8; }
    else if (kind === 'inline') { lab(label, x, y); vx = x + off; }
    const hl = put(mk('rect', { x: vx - 6, y: vy - size, width: bw, height: size + 12, rx: 8, fill: RULE, 'fill-opacity': .28 }, q), { o: 0 });
    const v = T(q, '—', { x: vx, y: vy, size, fill: COL.faint, weight: kind === 'plain' ? 700 : 600 });
    const row = kind === 'row';
    const sub = T(q, '', { x: row ? SHEET.w - 20 : vx + 58, y: vy, size: row ? 18 : 17, fill: RULE, weight: 600, anchor: row ? 'end' : 'start' });
    f[key] = { v, sub, hl, col };
  });
  show(g, t0);
  let cur = 1;
  return {
    g,
    // flip to page 1 or 2 at t0 (immediately if t0 is omitted)
    page(n, t0) {
      if (n === cur) return;
      const [a, b] = n === 2 ? pg : [pg[1], pg[0]];
      cur = n;
      if (t0 == null) { put(a, { o: 0 }); put(b, { o: 1 }); } else { tw(a, { o: 0 }, t0, .35); tw(b, { o: 1 }, t0 + .2, .35); }
    },
    // a value already on the sheet from an earlier chapter (no animation)
    fill(key, val, sub) { const q = f[key]; q.v.textContent = val; if (sub !== undefined) q.sub.textContent = sub; put(q.v, { c_fill: q.col }); },
    // the value is written at t0 and briefly lit
    set(key, val, t0, sub) {
      const q = f[key];
      prog(() => { q.v.textContent = val; if (sub !== undefined) q.sub.textContent = sub; put(q.v, { c_fill: RULE }); }, t0, 0);
      this.flash(key, t0, true);
    },
    // only the small tag next to the value (a rank) changes at t0
    tag(key, sub, t0) {
      const q = f[key];
      prog(() => { q.sub.textContent = sub; }, t0, 0);
      tw(q.hl, { o: 1 }, t0, .15); tw(q.hl, { o: 0 }, t0 + .3, 1.3);
      pulse(q.sub, t0, 1.2);
    },
    flash(key, t0, withText) {
      const q = f[key];
      if (!withText) tw(q.v, { c_fill: RULE }, t0, .15);
      tw(q.v, { c_fill: q.col }, t0 + .5, 1);
      tw(q.hl, { o: 1 }, t0, .15); tw(q.hl, { o: 0 }, t0 + .3, 1.3);
      pulse(q.v, t0, 1.2);
    },
  };
}

// Degrees of success, best first: key, label, colour, fill opacity (ch02, shared since ch07).
const DEG = [['cs', 'крит. успех', OK, .5], ['s', 'успех', OK, .2], ['f', 'провал', NO, .2], ['cf', 'крит. провал', NO, .5]];
const degOf = (total, dc) => DEG[total >= dc + 10 ? 0 : total >= dc ? 1 : total > dc - 10 ? 2 : 3];
const DEGREES = [['cs', 'Крит. успех', OK], ['s', 'Успех', OK], ['f', 'Провал', NO], ['cf', 'Крит. провал', NO]];
// A d20 outline with the rolled number inside.
function numDie(p, n, x, y, t0, size = 50, color = RULE) {
  const d = dieShape(p, 20, x, y, color, t0, size, null, false);
  T(d, String(n), { y: size * .22, size: size * .62, fill: color, weight: 700, anchor: 'middle' });
  return d;
}
