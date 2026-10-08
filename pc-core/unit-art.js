// Chalk sketches for the unit headers on the contents page, one per unit, drawn in the unit's colour.
// Each entry is the inside of an SVG with viewBox 0 0 600 180; keep the left ~200 px light (the unit title sits there
// on narrow screens). Classes, styled in book.html:
//   d  a stroke that draws itself in when the unit scrolls into view (--k orders the strokes)
//   t  text or a filled shape that fades in
//   a  faint chalk white instead of the unit colour;  faint  even fainter
// A sketch may add one looping motion after it is drawn: give an element a class and add a .seen .unit-art .NAME
// rule with its keyframes in book.html (see the examples there: swap-a, hop, spin, tilt, breathe, ...).
'use strict';
(() => {
  let k = 0;
  const P = (d, cls = '', extra = '') => `<path class="d ${cls}" pathLength="1" style="--k:${k++}" d="${d}" ${extra}/>`;
  const Tx = (x, y, s, size = 24, cls = '', anchor = 'start') => `<text class="t ${cls}" style="--k:${k++}" x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}">${s}</text>`;
  const C = (cx, cy, r, cls = '') => `<circle class="d ${cls}" pathLength="1" style="--k:${k++}" cx="${cx}" cy="${cy}" r="${r}"/>`;
  const reset = s => { k = 0; return s; };

  window.UNIT_ART = [
    // Основы: двадцатигранник, на верхней грани 20.
    reset(P('M400 20L465 57.5V132.5L400 170L335 132.5V57.5Z') + P('M400 48.6L440.2 118.2H359.8Z', 'a') +
      P('M400 48.6V20M400 48.6L335 57.5M400 48.6L465 57.5M440.2 118.2L465 57.5M440.2 118.2L465 132.5M440.2 118.2L400 170' +
        'M359.8 118.2L335 57.5M359.8 118.2L335 132.5M359.8 118.2L400 170', 'faint') +
      Tx(400, 105, '20', 26, '', 'middle')),
    // Создание героя: лист персонажа с портретом и строками.
    reset(P('M300 20H500V165H300Z') + C(345, 62, 24) + P('M385 50H480M385 72H460', 'a') +
      P('M320 110H480M320 132H480M320 154H430', 'a')),
    // Игра: ключ рядом с навесным замком.
    reset(P('M440 80V60A32 32 0 0 1 504 60V80', 'a') + P('M424 80H520V160H424Z') + C(472, 112, 9) + P('M472 121V140') +
      C(300, 120, 22) + P('M322 120H400M370 120V138M386 120V134', 'faint')),
  ];
})();
