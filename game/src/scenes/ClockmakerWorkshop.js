// Clockmaker's Midnight Workshop — scene 1 of Chronicle of Curiosities.
// A warm, wood-panelled workshop at night: round moon window, big brass wall clock,
// long-case clock with a swinging pendulum, pegboard of gears, and a workbench with
// an oil lamp, books, tools and a sleeping cat. 8 difference candidates; 7 are active.
import { mulberry32, hashSeed, wood, glow, gear, moon, stars, dust, vignette, goldFrame } from '../render/ProceduralTextures.js';

export const id = 'clockmaker';
export const title = "Clockmaker's Midnight Workshop";
export const tagline = 'Brass, lamplight and a hundred tiny gears.';

export const candidates = [
  { id: 'clock-hands', x: 308, y: 140, r: 30, label: 'Wall clock hands', kind: 'orientation' },
  { id: 'peg-gear', x: 525, y: 235, r: 20, label: 'Gear on the pegboard', kind: 'missing' },
  { id: 'lamp-flame', x: 150, y: 322, r: 16, label: 'Oil lamp flame', kind: 'color' },
  { id: 'bench-cat', x: 480, y: 345, r: 26, label: 'Sleeping cat', kind: 'missing' },
  { id: 'book-spine', x: 268, y: 330, r: 15, label: 'Book spine colour', kind: 'color' },
  { id: 'window-moon', x: 95, y: 95, r: 22, label: 'Moon in the window', kind: 'shape' },
  { id: 'pendulum', x: 70, y: 265, r: 18, label: 'Pendulum swing', kind: 'orientation' },
  { id: 'bench-key', x: 390, y: 368, r: 13, label: 'Brass key on the bench', kind: 'added' },
];

function clockFace(ctx, cx, cy, r, hourAngle, minAngle) {
  ctx.save();
  ctx.fillStyle = '#c9a227';
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.fill();
  ctx.fillStyle = '#f3e7c8';
  ctx.beginPath(); ctx.arc(cx, cy, r - 6, 0, 7); ctx.fill();
  ctx.strokeStyle = '#2c2417'; ctx.lineWidth = 2;
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const x1 = cx + Math.cos(a) * (r - 14), y1 = cy + Math.sin(a) * (r - 14);
    const x2 = cx + Math.cos(a) * (r - 20), y2 = cy + Math.sin(a) * (r - 20);
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  }
  const hand = (ang, len, w) => {
    ctx.strokeStyle = '#241d0e'; ctx.lineWidth = w; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(ang) * len, cy + Math.sin(ang) * len); ctx.stroke();
  };
  hand(hourAngle, r * 0.5, 5);
  hand(minAngle, r * 0.72, 3.5);
  ctx.fillStyle = '#8a6d1c';
  ctx.beginPath(); ctx.arc(cx, cy, 5, 0, 7); ctx.fill();
  ctx.restore();
}

function sleepingCat(ctx, x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = '#c77b3a';
  ctx.beginPath(); ctx.ellipse(0, 0, 30, 16, 0, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.arc(26, -6, 12, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.moveTo(18, -14); ctx.lineTo(21, -24); ctx.lineTo(26, -15); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(28, -15); ctx.lineTo(33, -24); ctx.lineTo(36, -14); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#8a4d1c'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(38, 6, 12, -0.4, 1.2); ctx.stroke();
  ctx.strokeStyle = '#e8a860'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(-6, -8, 12, 0.3, 2.4); ctx.stroke();
  ctx.beginPath(); ctx.arc(8, -10, 10, 0.4, 2.6); ctx.stroke();
  ctx.restore();
}

export function drawBase(ctx, W, H, t, opts = {}) {
  const omit = opts.omit || new Set();
  const alter = opts.alter || new Set();
  const rng = mulberry32(hashSeed(id));
  // Wall.
  wood(ctx, 0, 0, W, H, '#4a3220', '#2e1d10', 36, rng);
  // Round moon window, top left.
  ctx.save();
  ctx.fillStyle = '#0e1524';
  ctx.beginPath(); ctx.arc(95, 95, 58, 0, 7); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.arc(95, 95, 54, 0, 7); ctx.clip();
  stars(ctx, { x: 40, y: 40, w: 110, h: 110 }, 22, rng);
  moon(ctx, 95, 95, 20, alter.has('window-moon') ? 'full' : 'crescent');
  ctx.restore();
  ctx.strokeStyle = '#6d4a26'; ctx.lineWidth = 7;
  ctx.beginPath(); ctx.arc(95, 95, 58, 0, 7); ctx.stroke();
  ctx.strokeStyle = '#c9a227'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(95, 95, 51, 0, 7); ctx.stroke();
  ctx.restore();
  // Long-case clock, left.
  ctx.save();
  ctx.fillStyle = '#5a3a20'; ctx.fillRect(38, 168, 64, 136);
  ctx.fillStyle = '#6d4a26'; ctx.fillRect(32, 160, 76, 12);
  ctx.fillStyle = '#3a2412'; ctx.fillRect(30, 300, 80, 10);
  ctx.fillStyle = '#f3e7c8'; ctx.fillRect(48, 176, 44, 44);
  ctx.strokeStyle = '#c9a227'; ctx.lineWidth = 2; ctx.strokeRect(48, 176, 44, 44);
  ctx.fillStyle = '#241d0e';
  ctx.beginPath(); ctx.arc(70, 198, 2.5, 0, 7); ctx.fill();
  ctx.restore();
  // Pendulum (swings left or right).
  const pAng = alter.has('pendulum') ? 0.32 : -0.32;
  ctx.save(); ctx.translate(70, 226); ctx.rotate(pAng);
  ctx.strokeStyle = '#c9a227'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 58); ctx.stroke();
  ctx.fillStyle = '#c9a227'; ctx.beginPath(); ctx.arc(0, 62, 11, 0, 7); ctx.fill();
  ctx.restore();
  // Big brass wall clock, centre.
  clockFace(ctx, 308, 140, 72,
    alter.has('clock-hands') ? -0.6 : -2.4,
    alter.has('clock-hands') ? 0.9 : 0.5);
  ctx.save(); ctx.fillStyle = '#2c2417'; ctx.font = 'italic 13px Georgia, serif'; ctx.textAlign = 'center';
  ctx.fillText('Chronicle', 308, 168); ctx.restore();
  // Cuckoo clock, right.
  ctx.save();
  ctx.fillStyle = '#5a3a20';
  ctx.beginPath(); ctx.moveTo(478, 118); ctx.lineTo(520, 72); ctx.lineTo(562, 118); ctx.closePath(); ctx.fill();
  ctx.fillRect(484, 118, 72, 44);
  ctx.fillStyle = '#f3e7c8'; ctx.beginPath(); ctx.arc(520, 140, 15, 0, 7); ctx.fill();
  ctx.strokeStyle = '#2c2417'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(520, 140); ctx.lineTo(520, 128); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(520, 140); ctx.lineTo(529, 143); ctx.stroke();
  ctx.fillStyle = '#c9a227'; ctx.beginPath(); ctx.arc(520, 168, 5, 0, 7); ctx.fill();
  ctx.restore();
  // Pegboard of gears, right.
  ctx.save();
  ctx.fillStyle = '#3d2a16'; ctx.fillRect(452, 182, 148, 112);
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  for (let gy = 196; gy < 286; gy += 18) for (let gx = 466; gx < 590; gx += 18) { ctx.fillRect(gx, gy, 2, 2); }
  ctx.restore();
  gear(ctx, 482, 216, 15, 8, '#c9a227');
  gear(ctx, 548, 206, 11, 7, '#a8821f');
  gear(ctx, 566, 262, 17, 9, '#c9a227');
  gear(ctx, 486, 272, 12, 8, '#b08d2e');
  if (!omit.has('peg-gear')) gear(ctx, 525, 235, 14, 8, '#d9b23a');
  // Workbench.
  wood(ctx, 0, 300, W, 104, '#6d4a26', '#4a2e14', 26, rng);
  ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(0, 300, W, 4);
  // Oil lamp with flickering glow.
  const flick = 0.75 + 0.25 * Math.sin(t * 3.1);
  glow(ctx, 150, 322, 70 * flick, '#ffb347', 0.5);
  ctx.save();
  ctx.fillStyle = '#8a6d1c'; ctx.fillRect(138, 340, 26, 8);
  ctx.fillStyle = '#c9a227'; ctx.beginPath(); ctx.ellipse(151, 332, 12, 9, 0, 0, 7); ctx.fill();
  ctx.fillStyle = alter.has('lamp-flame') ? '#3ec9b8' : '#ff8c1a';
  ctx.beginPath(); ctx.ellipse(151, 322, 6, 11 + 2 * Math.sin(t * 5), 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#ffe9a8';
  ctx.beginPath(); ctx.ellipse(151, 325, 2.6, 5, 0, 0, 7); ctx.fill();
  ctx.restore();
  // Stack of books (middle spine changes colour).
  ctx.save();
  ctx.fillStyle = '#7a2e2e'; ctx.fillRect(232, 342, 72, 12);
  ctx.fillStyle = alter.has('book-spine') ? '#2e4a7a' : '#a33a3a'; ctx.fillRect(236, 330, 64, 12);
  ctx.fillStyle = '#3a6d2e'; ctx.fillRect(240, 318, 56, 12);
  ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.fillRect(236, 332, 64, 2);
  ctx.restore();
  // Small brass clock on the bench.
  clockFace(ctx, 336, 352, 22, -1.2, 2.2);
  // Added brass key (only on the altered picture).
  if (alter.has('bench-key')) {
    ctx.save(); ctx.translate(390, 368);
    ctx.strokeStyle = '#d9b23a'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, 0, 7, 0, 7); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(7, 0); ctx.lineTo(22, 0); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(17, 0); ctx.lineTo(17, 6); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(22, 0); ctx.lineTo(22, 6); ctx.stroke();
    ctx.restore();
  }
  // Sleeping cat (missing on the altered picture).
  if (!omit.has('bench-cat')) sleepingCat(ctx, 480, 348, 1);
  // Scattered screws and a screwdriver.
  ctx.save();
  ctx.fillStyle = '#9a9a9a';
  ctx.beginPath(); ctx.arc(210, 372, 3, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.arc(420, 388, 3, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.arc(560, 380, 3, 0, 7); ctx.fill();
  ctx.strokeStyle = '#7a2e2e'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(120, 386); ctx.lineTo(168, 386); ctx.stroke();
  ctx.restore();
  // Dust motes + frame.
  dust(ctx, { x: 0, y: 0, w: W, h: H }, 16, t, rng);
  vignette(ctx, W, H);
  goldFrame(ctx, W, H);
}
