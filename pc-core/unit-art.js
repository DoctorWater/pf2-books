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
    reset(P('M400 20L470 60V130L400 170L330 130V60Z') + P('M400 60L450 125H350Z', 'a') +
      P('M400 20L400 60M470 60L450 125M330 60L350 125M400 170L450 125M400 170L350 125M330 130L350 125M470 130L450 125', 'faint') +
      Tx(400, 112, '20', 30, '', 'middle')),
    // Создание героя: лист персонажа с портретом и строками.
    reset(P('M300 20H500V165H300Z') + C(345, 62, 24) + P('M385 50H480M385 72H460', 'a') +
      P('M320 110H480M320 132H480M320 154H430', 'a')),
  ];
})();
