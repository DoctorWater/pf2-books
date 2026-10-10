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
    // Бой: меч рядом с круглым щитом.
    reset(P('M314 146L404 38', 'a') + P('M308 122L338 147') + C(306, 156, 6) +
      C(480, 100, 52) + C(480, 100, 10, 'a') + P('M480 48V90M480 110V152M428 100H470M490 100H532', 'faint')),
    // Восприятие: глаз и лучи факела.
    reset(P('M330 96Q420 26 510 96Q420 166 330 96Z') + C(420, 96, 26, 'a') + C(420, 96, 9) +
      P('M420 30V14M372 40L362 26M468 40L478 26M420 162V176', 'faint')),
    // Магия: раскрытая книга и восьмилучевая искра над ней.
    reset(P('M330 150Q380 130 420 150Q460 130 510 150V100Q460 80 420 100Q380 80 330 100Z') + P('M420 100V150', 'a') +
      P('M420 22V66M398 44H442M405 29L435 59M435 29L405 59', 'a')),
    // Вне боя: костёр у дороги, дорога уходит вдаль.
    reset(P('M380 150L420 92L460 150', 'a') + P('M372 156H468') + P('M420 92Q404 70 420 46Q436 70 420 92', 'faint') +
      P('M480 170Q520 120 560 60', 'faint') + P('M530 170Q550 120 570 60', 'faint')),
    // Развитие: ступени вверх и стрелка.
    reset(P('M320 160H380V130H440V100H500V70H560') + P('M330 120L520 30', 'a') + P('M496 28L520 30L510 52', 'a')),
  ];
})();
