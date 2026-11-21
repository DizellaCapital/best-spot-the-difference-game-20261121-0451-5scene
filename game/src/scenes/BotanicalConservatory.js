// Botanical Conservatory at Dusk — scene 2 of Chronicle of Curiosities.
// A glasshouse at sunset: arched panes, a purple-orange sky, hanging lanterns,
// ferns and flowering pots, a stone fountain with a frog, and butterflies.
import { mulberry32, hashSeed, glow, lantern, moon, stars, foliage, waterShimmer, dust, vignette, goldFrame, vGrad } from '../render/ProceduralTextures.js';

export const id = 'botanical';
export const title = 'Botanical Conservatory at Dusk';
export const tagline = 'Glass, green leaves and the last light of day.';

export const candidates = [
  { id: 'flower-color', x: 300, y: 300, r: 18, label: 'Flower colour', kind: 'color' },
  { id: 'butterfly', x: 180, y: 130, r: 16, label: 'Butterfly', kind: 'missing' },
  { id: 'lantern-glow', x: 440, y: 96, r: 18, label: 'Lantern glow colour', kind: 'color' },
  { id: 'frog', x: 388, y: 330, r: 16, label: 'Frog on the lily pad', kind: 'added' },
  { id: 'leaf-pattern', x: 90, y: 320, r: 18, label: 'Leaf pattern', kind: 'pattern' },
  { id: 'sky-moon', x: 540, y: 70, r: 20, label: 'Moon in the sky', kind: 'shape' },
  { id: 'watering-can', x: 520, y: 350, r: 18, label: 'Watering can', kind: 'missing' },
  { id: 'pot-color', x: 210, y: 352, r: 16, label: 'Flower pot colour', kind: 'color' },
];

function fern(ctx, x, y, s, color, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.strokeStyle = color; ctx.lineWidth = 2.4; ctx.lineCap = 'round';
  for (let f = -3; f <= 3; f++) {
    const sway = Math.sin(t * 0.8 + f) * 3;
    ctx.beginPath(); ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(f * 9 + sway, -26, f * 16 + sway, -52 - Math.abs(f) * -4);
    ctx.stroke();
    ctx.beginPath(); ctx.moveTo(f * 6, -18); ctx.lineTo(f * 13 + sway, -34); ctx.stroke();
  }
  ctx.restore();
}

function butterfly(ctx, x, y, t, color = '#e8a0c8') {
  const flap = Math.sin(t * 6) * 0.5;
  ctx.save(); ctx.translate(x, y + Math.sin(t * 2) * 4);
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.ellipse(-6, -3, 8, 5 + flap * 4, -0.5, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.ellipse(6, -3, 8, 5 + flap * 4, 0.5, 0, 7); ctx.fill();
  ctx.fillStyle = '#2c2417';
  ctx.beginPath(); ctx.ellipse(0, 0, 2.5, 7, 0, 0, 7); ctx.fill();
  ctx.restore();
}

export function drawBase(ctx, W, H, t, opts = {}) {
  const omit = opts.omit || new Set();
  const alter = opts.alter || new Set();
  const rng = mulberry32(hashSeed(id));
  // Dusk sky.
  ctx.fillStyle = vGrad(ctx, 0, 0, W, 300, [[0, '#2c2140'], [0.55, '#7a4a6e'], [0.85, '#e08a4a'], [1, '#f7c873']]);
  ctx.fillRect(0, 0, W, 300);
  stars(ctx, { x: 0, y: 0, w: W, h: 120 }, 26, rng);
  moon(ctx, 540, 70, 18, alter.has('sky-moon') ? 'full' : 'crescent');
  // Setting sun glow.
  glow(ctx, 120, 250, 120, '#ffb347', 0.6);
  ctx.fillStyle = '#ffd27a';
  ctx.beginPath(); ctx.arc(120, 258, 26, 0, 7); ctx.fill();
  // Glasshouse arches + mullions.
  ctx.save();
  ctx.strokeStyle = 'rgba(40,30,50,0.9)'; ctx.lineWidth = 5;
  for (let i = 0; i <= 6; i++) {
    const x = 20 + i * 96;
    ctx.beginPath(); ctx.moveTo(x, 300); ctx.lineTo(x, 60); ctx.stroke();
    ctx.beginPath(); ctx.arc(20 + i * 96, 60, 0, 0, 0); ctx.stroke();
  }
  ctx.beginPath(); ctx.moveTo(0, 300); ctx.lineTo(W, 300); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, 180); ctx.lineTo(W, 180); ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.14)'; ctx.lineWidth = 10;
  ctx.beginPath(); ctx.moveTo(60, 0); ctx.lineTo(180, 300); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(420, 0); ctx.lineTo(330, 300); ctx.stroke();
  ctx.restore();
  // Stone floor.
  ctx.fillStyle = '#6d675c'; ctx.fillRect(0, 300, W, 104);
  ctx.fillStyle = '#5a5348';
  for (let i = 0; i < 8; i++) { ctx.fillRect(i * 80, 300, 3, 104); ctx.fillRect(0, 300 + i * 14, W, 2); }
  // Hanging lanterns.
  lantern(ctx, 170, 96, 15, '#ffb347', true);
  lantern(ctx, 300, 78, 17, '#ffb347', true);
  lantern(ctx, 440, 96, 15, alter.has('lantern-glow') ? '#7fd4ff' : '#ffb347', true);
  // Ferns left + right.
  fern(ctx, 90, 320, 1.1, '#3f7a44', t);
  fern(ctx, 560, 330, 0.95, '#4a8a4a', t);
  foliage(ctx, 60, 260, 14, rng, ['#2e5d33', '#3f7a44', '#57a05a']);
  foliage(ctx, 580, 250, 12, rng, ['#2e5d33', '#3f7a44']);
  // Flowering plant, centre (petals change colour).
  ctx.save();
  ctx.fillStyle = '#8a5a2e'; ctx.fillRect(296, 330, 8, 40);
  ctx.strokeStyle = '#2e5d33'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(300, 340); ctx.quadraticCurveTo(280, 320, 268, 306); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(300, 336); ctx.quadraticCurveTo(322, 318, 334, 304); ctx.stroke();
  const petal = alter.has('flower-color') ? '#e87ab8' : '#ff9a3d';
  for (let p = 0; p < 6; p++) {
    const a = (p / 6) * Math.PI * 2;
    ctx.fillStyle = petal;
    ctx.beginPath(); ctx.ellipse(300 + Math.cos(a) * 11, 292 + Math.sin(a) * 11, 9, 6, a, 0, 7); ctx.fill();
  }
  ctx.fillStyle = '#7a2e5e'; ctx.beginPath(); ctx.arc(300, 292, 7, 0, 7); ctx.fill();
  ctx.restore();
  // Leaf with a pattern (stripes or dots).
  ctx.save(); ctx.translate(90, 320);
  ctx.fillStyle = '#3f7a44';
  ctx.beginPath(); ctx.ellipse(0, 0, 26, 13, -0.5, 0, 7); ctx.fill();
  if (alter.has('leaf-pattern')) {
    ctx.fillStyle = '#e8c766';
    ctx.beginPath(); ctx.arc(-10, -3, 2.4, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.arc(0, 2, 2.4, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.arc(11, -4, 2.4, 0, 7); ctx.fill();
  } else {
    ctx.strokeStyle = '#e8c766'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-18, -6); ctx.lineTo(18, 4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-16, 2); ctx.lineTo(16, -6); ctx.stroke();
  }
  ctx.restore();
  // Stone fountain, centre-right.
  ctx.save();
  ctx.fillStyle = '#8a8578'; ctx.fillRect(352, 318, 84, 14);
  ctx.fillStyle = '#7a7568'; ctx.fillRect(360, 332, 68, 34);
  ctx.fillStyle = '#3f6d8a';
  ctx.beginPath(); ctx.ellipse(394, 322, 38, 7, 0, 0, 7); ctx.fill();
  waterShimmer(ctx, 360, 316, 68, 12, t);
  ctx.fillStyle = '#2e8a5a';
  ctx.beginPath(); ctx.ellipse(388, 324, 12, 5, 0, 0, 7); ctx.fill();
  ctx.restore();
  // Frog on the lily pad (only on the altered picture).
  if (alter.has('frog')) {
    ctx.save(); ctx.translate(388, 330);
    ctx.fillStyle = '#4a9a3f';
    ctx.beginPath(); ctx.ellipse(0, 0, 11, 8, 0, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.arc(-6, -7, 4.5, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.arc(6, -7, 4.5, 0, 7); ctx.fill();
    ctx.fillStyle = '#1c2417';
    ctx.beginPath(); ctx.arc(-6, -7, 2, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.arc(6, -7, 2, 0, 7); ctx.fill();
    ctx.restore();
  }
  // Butterfly (missing on the altered picture).
  if (!omit.has('butterfly')) butterfly(ctx, 180, 130, t);
  butterfly(ctx, 470, 160, t + 2, '#a8c8e8');
  // Flower pot (colour changes).
  ctx.save();
  ctx.fillStyle = alter.has('pot-color') ? '#7a3a6d' : '#b25a2e';
  ctx.beginPath(); ctx.moveTo(196, 352); ctx.lineTo(224, 352); ctx.lineTo(220, 384); ctx.lineTo(200, 384); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#3f7a44';
  ctx.beginPath(); ctx.arc(210, 344, 14, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.arc(198, 350, 9, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.arc(222, 350, 9, 0, 7); ctx.fill();
  ctx.restore();
  // Watering can (missing on the altered picture).
  if (!omit.has('watering-can')) {
    ctx.save(); ctx.translate(520, 350);
    ctx.fillStyle = '#5a7a8a';
    ctx.beginPath(); ctx.ellipse(0, 8, 18, 12, 0, 0, 7); ctx.fill();
    ctx.fillRect(-14, -8, 10, 12);
    ctx.strokeStyle = '#5a7a8a'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(16, 4); ctx.quadraticCurveTo(30, -6, 26, -16); ctx.stroke();
    ctx.fillStyle = '#3a5a6a'; ctx.fillRect(20, -20, 12, 6);
    ctx.restore();
  }
  // Seed packets on a bench.
  ctx.save();
  ctx.fillStyle = '#6d4a26'; ctx.fillRect(250, 372, 110, 8);
  ctx.fillStyle = '#e8c766'; ctx.fillRect(262, 356, 22, 16);
  ctx.fillStyle = '#c94a6d'; ctx.fillRect(290, 356, 22, 16);
  ctx.fillStyle = '#4a7ac9'; ctx.fillRect(318, 356, 22, 16);
  ctx.restore();
  dust(ctx, { x: 0, y: 0, w: W, h: H }, 14, t, rng);
  vignette(ctx, W, H);
  goldFrame(ctx, W, H);
}
