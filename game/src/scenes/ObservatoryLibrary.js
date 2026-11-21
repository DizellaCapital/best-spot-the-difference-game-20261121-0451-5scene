// Grand Observatory Library — scene 4 of Chronicle of Curiosities.
// Tall bookshelves, a rolling ladder, a brass telescope under a domed star window,
// a globe, a desk with an open book and a candle, and a brass orrery.
import { mulberry32, hashSeed, glow, bookRow, stars, moon, dust, vignette, goldFrame, vGrad, shadeColor } from '../render/ProceduralTextures.js';

export const id = 'observatory';
export const title = 'Grand Observatory Library';
export const tagline = 'Every book a world, every star a question.';

export const candidates = [
  { id: 'telescope', x: 320, y: 200, r: 24, label: 'Telescope angle', kind: 'orientation' },
  { id: 'globe', x: 420, y: 300, r: 18, label: 'Globe oceans', kind: 'color' },
  { id: 'shelf-book', x: 80, y: 120, r: 14, label: 'Book on the shelf', kind: 'missing' },
  { id: 'candle', x: 120, y: 340, r: 14, label: 'Candle flame', kind: 'color' },
  { id: 'chart-symbol', x: 215, y: 95, r: 16, label: 'Star chart symbol', kind: 'pattern' },
  { id: 'orrery', x: 410, y: 320, r: 16, label: 'Orrery planet', kind: 'orientation' },
  { id: 'bookmark', x: 150, y: 350, r: 12, label: 'Bookmark in the book', kind: 'added' },
  { id: 'rug', x: 308, y: 380, r: 20, label: 'Rug border pattern', kind: 'pattern' },
];

function shelf(ctx, x, y, w, rows, rng, omitBook) {
  ctx.save();
  ctx.fillStyle = '#4a3220'; ctx.fillRect(x, y, w, rows * 46 + 8);
  const palette = ['#7a2e2e', '#2e4a7a', '#3a6d2e', '#8a6d1c', '#6d3a7a', '#a35a2e'];
  for (let r = 0; r < rows; r++) {
    const ry = y + 8 + r * 46;
    ctx.fillStyle = '#2e1d10'; ctx.fillRect(x + 6, ry, w - 12, 36);
    // The missing book lives on the top shelf, third from the left.
    if (r === 0 && omitBook) {
      bookRow(ctx, x + 8, ry + 2, 52, 32, palette, rng);
      ctx.fillStyle = '#2e1d10'; ctx.fillRect(x + 60, ry + 2, 14, 32);
      bookRow(ctx, x + 76, ry + 2, w - 84, 32, palette, rng);
    } else {
      bookRow(ctx, x + 8, ry + 2, w - 16, 32, palette, rng);
    }
    ctx.fillStyle = '#6d4a26'; ctx.fillRect(x, ry + 36, w, 6);
  }
  ctx.restore();
}

export function drawBase(ctx, W, H, t, opts = {}) {
  const omit = opts.omit || new Set();
  const alter = opts.alter || new Set();
  const rng = mulberry32(hashSeed(id));
  // Wall.
  ctx.fillStyle = vGrad(ctx, 0, 0, W, H, [[0, '#2e3a2e'], [1, '#1c2417']]);
  ctx.fillRect(0, 0, W, H);
  // Domed star window, centre-top.
  ctx.save();
  ctx.fillStyle = '#0e1524';
  ctx.beginPath(); ctx.moveTo(230, 130); ctx.lineTo(230, 60); ctx.arc(308, 60, 78, Math.PI, 0); ctx.lineTo(386, 130); ctx.closePath(); ctx.fill();
  ctx.save();
  ctx.beginPath(); ctx.moveTo(230, 130); ctx.lineTo(230, 60); ctx.arc(308, 60, 74, Math.PI, 0); ctx.lineTo(386, 130); ctx.closePath(); ctx.clip();
  stars(ctx, { x: 230, y: 0, w: 156, h: 130 }, 30, rng);
  moon(ctx, 340, 50, 13, 'full');
  ctx.fillStyle = '#e8c766';
  ctx.beginPath(); ctx.arc(268, 100, 4, 0, 7); ctx.fill();
  ctx.restore();
  ctx.strokeStyle = '#c9a227'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(230, 130); ctx.lineTo(230, 60); ctx.arc(308, 60, 78, Math.PI, 0); ctx.lineTo(386, 130); ctx.closePath(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(308, 0); ctx.lineTo(308, 130); ctx.stroke();
  ctx.restore();
  // Bookshelves left and right.
  shelf(ctx, 8, 30, 150, 3, rng, omit.has('shelf-book'));
  shelf(ctx, 458, 30, 150, 3, rng, false);
  // Rolling ladder against the left shelf.
  ctx.save();
  ctx.strokeStyle = '#8a6d1c'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(150, 60); ctx.lineTo(176, 300); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(166, 60); ctx.lineTo(192, 300); ctx.stroke();
  ctx.lineWidth = 3;
  for (let i = 0; i < 6; i++) {
    const y = 84 + i * 38;
    ctx.beginPath(); ctx.moveTo(152 + (y - 60) * 0.11, y); ctx.lineTo(168 + (y - 60) * 0.11, y); ctx.stroke();
  }
  ctx.restore();
  // Star chart on the wall (symbol changes).
  ctx.save();
  ctx.fillStyle = '#e8d9ae'; ctx.fillRect(186, 60, 58, 70);
  ctx.strokeStyle = '#8a6d1c'; ctx.lineWidth = 2; ctx.strokeRect(186, 60, 58, 70);
  ctx.strokeStyle = '#2c2417'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(215, 95, 16, 0, 7); ctx.stroke();
  if (alter.has('chart-symbol')) {
    ctx.beginPath(); ctx.moveTo(215, 82); ctx.lineTo(215, 108); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(202, 95); ctx.lineTo(228, 95); ctx.stroke();
  } else {
    ctx.beginPath(); ctx.moveTo(215, 82); ctx.lineTo(220, 99); ctx.lineTo(203, 90); ctx.lineTo(227, 90); ctx.lineTo(210, 99); ctx.closePath(); ctx.stroke();
  }
  ctx.restore();
  // Rug (border pattern changes).
  ctx.save();
  ctx.fillStyle = '#7a2e2e'; ctx.fillRect(220, 356, 176, 40);
  ctx.fillStyle = '#a33a3a'; ctx.fillRect(228, 362, 160, 28);
  if (alter.has('rug')) {
    ctx.fillStyle = '#e8c766';
    for (let x = 236; x < 380; x += 18) { ctx.beginPath(); ctx.arc(x, 376, 3.4, 0, 7); ctx.fill(); }
  } else {
    ctx.strokeStyle = '#e8c766'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(232, 366); ctx.lineTo(384, 366); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(232, 386); ctx.lineTo(384, 386); ctx.stroke();
  }
  ctx.restore();
  // Brass telescope (angle changes).
  ctx.save();
  const tAng = alter.has('telescope') ? -0.5 : 0.5;
  ctx.translate(320, 260); ctx.rotate(tAng);
  ctx.fillStyle = '#8a6d1c'; ctx.fillRect(-14, -96, 10, 110);
  ctx.fillStyle = '#c9a227';
  ctx.beginPath(); ctx.moveTo(-14, -96); ctx.lineTo(6, -96); ctx.lineTo(2, -116); ctx.lineTo(-10, -116); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#6d5614'; ctx.beginPath(); ctx.arc(-4, -112, 7, 0, 7); ctx.fill();
  ctx.restore();
  ctx.save();
  ctx.strokeStyle = '#6d5614'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(316, 260); ctx.lineTo(292, 330); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(324, 260); ctx.lineTo(348, 330); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(320, 268); ctx.lineTo(320, 330); ctx.stroke();
  ctx.fillStyle = '#c9a227'; ctx.beginPath(); ctx.arc(320, 262, 8, 0, 7); ctx.fill();
  ctx.restore();
  // Globe (oceans change colour).
  ctx.save();
  ctx.fillStyle = '#6d5614'; ctx.fillRect(416, 330, 8, 30);
  ctx.beginPath(); ctx.arc(420, 300, 26, 0, 7);
  ctx.fillStyle = alter.has('globe') ? '#3a7a4a' : '#2e5d8a'; ctx.fill();
  ctx.fillStyle = '#c9a86d';
  ctx.beginPath(); ctx.ellipse(412, 292, 9, 6, 0.5, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.ellipse(428, 308, 7, 5, -0.4, 0, 7); ctx.fill();
  ctx.strokeStyle = '#8a6d1c'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(420, 300, 26, 0, 7); ctx.stroke();
  ctx.restore();
  // Orrery (planet on the other side).
  ctx.save();
  ctx.fillStyle = '#8a6d1c'; ctx.fillRect(386, 344, 48, 6);
  ctx.strokeStyle = '#c9a227'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(410, 330, 16, 0, 7); ctx.stroke();
  ctx.fillStyle = '#e8c766'; ctx.beginPath(); ctx.arc(410, 330, 6, 0, 7); ctx.fill();
  const px = alter.has('orrery') ? 394 : 426;
  ctx.fillStyle = '#c94a4a'; ctx.beginPath(); ctx.arc(px, 330, 4.5, 0, 7); ctx.fill();
  ctx.restore();
  // Desk with open book and candle, bottom-left.
  ctx.save();
  ctx.fillStyle = '#5a3a20'; ctx.fillRect(36, 336, 180, 12);
  ctx.fillStyle = '#4a2e14'; ctx.fillRect(44, 348, 10, 48); ctx.fillRect(198, 348, 10, 48);
  // Open book.
  ctx.fillStyle = '#f3e7c8';
  ctx.beginPath(); ctx.moveTo(150, 336); ctx.lineTo(96, 322); ctx.lineTo(96, 336); ctx.lineTo(150, 336); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(150, 336); ctx.lineTo(204, 322); ctx.lineTo(204, 336); ctx.lineTo(150, 336); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#8a7a5a'; ctx.lineWidth = 1;
  for (let i = 0; i < 4; i++) {
    ctx.beginPath(); ctx.moveTo(104, 326 + i * 3); ctx.lineTo(142, 330 + i * 3); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(158, 330 + i * 3); ctx.lineTo(196, 326 + i * 3); ctx.stroke();
  }
  // Bookmark (only on the altered picture).
  if (alter.has('bookmark')) {
    ctx.fillStyle = '#c94a4a'; ctx.fillRect(146, 322, 8, 18);
    ctx.beginPath(); ctx.moveTo(146, 340); ctx.lineTo(150, 334); ctx.lineTo(154, 340); ctx.closePath(); ctx.fill();
  }
  // Candle with flame (colour changes).
  const flick = 0.75 + 0.25 * Math.sin(t * 3.4);
  glow(ctx, 120, 336, 44 * flick, '#ffb347', 0.45);
  ctx.fillStyle = '#f3e7c8'; ctx.fillRect(116, 322, 8, 16);
  ctx.fillStyle = alter.has('candle') ? '#3ec9b8' : '#ff8c1a';
  ctx.beginPath(); ctx.ellipse(120, 316, 4, 7 + Math.sin(t * 5) * 1.5, 0, 0, 7); ctx.fill();
  ctx.restore();
  // Armchair, right.
  ctx.save();
  ctx.fillStyle = '#6d2e2e';
  ctx.beginPath(); ctx.roundRect(486, 306, 90, 60, 10); ctx.fill();
  ctx.beginPath(); ctx.roundRect(486, 280, 90, 34, 10); ctx.fill();
  ctx.fillStyle = '#8a3a3a';
  ctx.beginPath(); ctx.roundRect(496, 288, 70, 22, 8); ctx.fill();
  ctx.fillStyle = '#e8c766'; ctx.beginPath(); ctx.arc(530, 320, 12, 0, 7); ctx.fill();
  ctx.restore();
  dust(ctx, { x: 0, y: 0, w: W, h: H }, 14, t, rng);
  vignette(ctx, W, H);
  goldFrame(ctx, W, H);
}
