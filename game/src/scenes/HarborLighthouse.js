// Harbor Café & Lighthouse — scene 3 of Chronicle of Curiosities.
// A seaside café terrace at dusk: striped awning, round tables, string lights,
// a chalkboard menu, the sea, boats, gulls, and a lighthouse whose beam sweeps.
import { mulberry32, hashSeed, glow, lantern, waterShimmer, dust, vignette, goldFrame, vGrad } from '../render/ProceduralTextures.js';

export const id = 'harbor';
export const title = 'Harbor Café & Lighthouse';
export const tagline = 'Salt air, warm lamps and a beam that never rests.';

export const candidates = [
  { id: 'awning-pattern', x: 300, y: 296, r: 20, label: 'Awning pattern', kind: 'pattern' },
  { id: 'beam', x: 470, y: 120, r: 24, label: 'Lighthouse beam direction', kind: 'orientation' },
  { id: 'cup', x: 200, y: 350, r: 14, label: 'Cup on the table', kind: 'missing' },
  { id: 'sail-color', x: 120, y: 230, r: 18, label: 'Boat sail colour', kind: 'color' },
  { id: 'gull', x: 350, y: 80, r: 14, label: 'Gull in the sky', kind: 'missing' },
  { id: 'menu-symbol', x: 480, y: 330, r: 16, label: 'Chalkboard symbol', kind: 'pattern' },
  { id: 'lighthouse-light', x: 540, y: 90, r: 14, label: 'Lighthouse lamp colour', kind: 'color' },
  { id: 'crab', x: 560, y: 380, r: 14, label: 'Crab on the dock', kind: 'added' },
];

function gull(ctx, x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.strokeStyle = '#2c2417'; ctx.lineWidth = 2; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-8, 0); ctx.quadraticCurveTo(-3, -6, 0, 0); ctx.quadraticCurveTo(3, -6, 8, 0); ctx.stroke();
  ctx.restore();
}

function boat(ctx, x, y, s, sailColor, t) {
  ctx.save(); ctx.translate(x, y + Math.sin(t * 1.2 + x) * 2); ctx.scale(s, s);
  ctx.fillStyle = '#5a3a20';
  ctx.beginPath(); ctx.moveTo(-26, 0); ctx.lineTo(26, 0); ctx.lineTo(18, 12); ctx.lineTo(-18, 12); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#3a2412'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -34); ctx.stroke();
  ctx.fillStyle = sailColor;
  ctx.beginPath(); ctx.moveTo(0, -34); ctx.lineTo(0, -4); ctx.lineTo(18, -4); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(0, -30); ctx.lineTo(0, -6); ctx.lineTo(-14, -6); ctx.closePath(); ctx.fill();
  ctx.restore();
}

export function drawBase(ctx, W, H, t, opts = {}) {
  const omit = opts.omit || new Set();
  const alter = opts.alter || new Set();
  const rng = mulberry32(hashSeed(id));
  // Dusk sky.
  ctx.fillStyle = vGrad(ctx, 0, 0, W, 210, [[0, '#1c2a4a'], [0.6, '#4a6a8a'], [1, '#e08a4a']]);
  ctx.fillRect(0, 0, W, 210);
  glow(ctx, 90, 180, 90, '#ffb347', 0.5);
  ctx.fillStyle = '#ffd27a';
  ctx.beginPath(); ctx.arc(90, 185, 20, 0, 7); ctx.fill();
  // Clouds.
  ctx.fillStyle = 'rgba(255,220,180,0.35)';
  ctx.beginPath(); ctx.ellipse(250, 70, 60, 12, 0, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.ellipse(420, 50, 46, 10, 0, 0, 7); ctx.fill();
  // Gulls (one missing on the altered picture).
  if (!omit.has('gull')) gull(ctx, 350, 80, 1);
  gull(ctx, 300, 60, 0.8);
  gull(ctx, 410, 100, 0.9);
  // Sea.
  ctx.fillStyle = vGrad(ctx, 0, 210, W, 80, [[0, '#2e5d7a'], [1, '#1c3a5a']]);
  ctx.fillRect(0, 210, W, 80);
  waterShimmer(ctx, 0, 220, W, 60, t);
  // Boats (sail colour changes).
  boat(ctx, 120, 246, 1, alter.has('sail-color') ? '#c94a4a' : '#f3e7c8', t);
  boat(ctx, 250, 262, 0.7, '#e8c766', t + 1);
  boat(ctx, 380, 240, 0.55, '#f3e7c8', t + 2);
  // Rocky point + lighthouse, right.
  ctx.save();
  ctx.fillStyle = '#5a5348';
  ctx.beginPath(); ctx.moveTo(480, 290); ctx.lineTo(520, 210); ctx.lineTo(600, 210); ctx.lineTo(616, 290); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#6d675c';
  ctx.beginPath(); ctx.moveTo(500, 290); ctx.lineTo(540, 230); ctx.lineTo(580, 230); ctx.lineTo(600, 290); ctx.closePath(); ctx.fill();
  // Tower with red/white stripes.
  ctx.fillStyle = '#f3e7c8'; ctx.fillRect(522, 92, 36, 122);
  ctx.fillStyle = '#c94a4a'; ctx.fillRect(522, 122, 36, 18); ctx.fillRect(522, 168, 36, 18);
  ctx.fillStyle = '#2c2417'; ctx.fillRect(518, 78, 44, 16);
  ctx.fillStyle = alter.has('lighthouse-light') ? '#3ec9b8' : '#ffd27a';
  ctx.fillRect(526, 82, 28, 9);
  if (alter.has('lighthouse-light')) glow(ctx, 540, 86, 30, '#3ec9b8', 0.5);
  else glow(ctx, 540, 86, 34, '#ffd27a', 0.55);
  ctx.fillStyle = '#2c2417';
  ctx.beginPath(); ctx.moveTo(516, 78); ctx.lineTo(540, 62); ctx.lineTo(564, 78); ctx.closePath(); ctx.fill();
  ctx.restore();
  // The beam (sweeps left or right).
  ctx.save();
  const beamToLeft = !alter.has('beam');
  ctx.globalAlpha = 0.28;
  ctx.fillStyle = '#ffe9a8';
  ctx.beginPath();
  ctx.moveTo(540, 86);
  if (beamToLeft) { ctx.lineTo(300, 40); ctx.lineTo(300, 130); }
  else { ctx.lineTo(616, 60); ctx.lineTo(616, 140); }
  ctx.closePath(); ctx.fill();
  ctx.restore();
  // Café terrace deck.
  ctx.fillStyle = '#6d4a26'; ctx.fillRect(0, 290, W, 114);
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  for (let i = 0; i < 8; i++) ctx.fillRect(0, 290 + i * 15, W, 2);
  // Striped awning (stripes or dots).
  ctx.save();
  ctx.fillStyle = '#f3e7c8'; ctx.fillRect(0, 282, W, 22);
  if (alter.has('awning-pattern')) {
    ctx.fillStyle = '#c94a4a';
    for (let x = 10; x < W; x += 34) { ctx.beginPath(); ctx.arc(x, 293, 6, 0, 7); ctx.fill(); }
  } else {
    ctx.fillStyle = '#c94a4a';
    for (let x = 0; x < W; x += 44) ctx.fillRect(x, 282, 22, 22);
  }
  ctx.fillStyle = '#2c2417';
  ctx.beginPath(); ctx.moveTo(0, 304); ctx.lineTo(14, 314); ctx.lineTo(28, 304); ctx.closePath(); ctx.fill();
  ctx.restore();
  // String lights.
  ctx.save();
  ctx.strokeStyle = '#2c2417'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(0, 316); ctx.quadraticCurveTo(308, 348, 616, 316); ctx.stroke();
  for (let i = 0; i < 9; i++) {
    const x = 30 + i * 66;
    const y = 316 + Math.sin((x / W) * Math.PI) * 26;
    ctx.fillStyle = ['#ffd27a', '#ff9a8a', '#a8d8a8'][i % 3];
    ctx.beginPath(); ctx.arc(x, y + 6, 4, 0, 7); ctx.fill();
  }
  ctx.restore();
  // Round tables with cups.
  const table = (x, y) => {
    ctx.save();
    ctx.fillStyle = '#8a6d1c'; ctx.fillRect(x - 3, y + 8, 6, 44);
    ctx.fillStyle = '#e8c766'; ctx.beginPath(); ctx.ellipse(x, y + 6, 34, 7, 0, 0, 7); ctx.fill();
    ctx.fillStyle = '#f3e7c8'; ctx.beginPath(); ctx.ellipse(x, y + 2, 30, 6, 0, 0, 7); ctx.fill();
    ctx.restore();
  };
  table(200, 348); table(330, 358);
  // Cups (one missing on the altered picture).
  ctx.save();
  ctx.fillStyle = '#c94a4a';
  ctx.fillRect(188, 338, 10, 9); ctx.fillRect(214, 338, 10, 9);
  if (!omit.has('cup')) { ctx.fillStyle = '#4a7ac9'; ctx.fillRect(200, 336, 10, 9); }
  ctx.fillStyle = '#4a7ac9'; ctx.fillRect(322, 348, 10, 9);
  ctx.restore();
  // Chalkboard menu (symbol changes: star or anchor).
  ctx.save();
  ctx.fillStyle = '#2c2417'; ctx.fillRect(452, 306, 60, 56);
  ctx.strokeStyle = '#c9a227'; ctx.lineWidth = 2; ctx.strokeRect(452, 306, 60, 56);
  ctx.strokeStyle = '#f3e7c8'; ctx.lineWidth = 2;
  if (alter.has('menu-symbol')) {
    ctx.beginPath(); ctx.moveTo(482, 316); ctx.lineTo(482, 348); ctx.stroke();
    ctx.beginPath(); ctx.arc(482, 330, 8, Math.PI, 0); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(470, 344); ctx.lineTo(494, 344); ctx.stroke();
  } else {
    ctx.beginPath();
    for (let p = 0; p < 5; p++) {
      const a = -Math.PI / 2 + (p / 5) * Math.PI * 2;
      const px = 482 + Math.cos(a) * 11, py = 330 + Math.sin(a) * 11;
      p === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      const a2 = a + Math.PI / 5;
      ctx.lineTo(482 + Math.cos(a2) * 5, 330 + Math.sin(a2) * 5);
    }
    ctx.closePath(); ctx.stroke();
  }
  ctx.fillStyle = '#f3e7c8'; ctx.font = '11px Georgia, serif'; ctx.textAlign = 'center';
  ctx.fillText('MENU', 482, 356);
  ctx.restore();
  // Cat on a chair.
  ctx.save();
  ctx.fillStyle = '#7a5a2e'; ctx.fillRect(60, 372, 44, 6);
  ctx.fillStyle = '#c77b3a';
  ctx.beginPath(); ctx.ellipse(82, 366, 18, 9, 0, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.arc(96, 360, 8, 0, 7); ctx.fill();
  ctx.restore();
  // Hanging lanterns on the terrace.
  lantern(ctx, 90, 330, 11, '#ffb347', true);
  lantern(ctx, 560, 322, 11, '#ffb347', true);
  // Crab on the dock (only on the altered picture).
  if (alter.has('crab')) {
    ctx.save(); ctx.translate(560, 382);
    ctx.fillStyle = '#c94a4a';
    ctx.beginPath(); ctx.ellipse(0, 0, 11, 7, 0, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.arc(-8, -6, 4, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.arc(8, -6, 4, 0, 7); ctx.fill();
    ctx.strokeStyle = '#c94a4a'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-10, 4); ctx.lineTo(-18, 10); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(10, 4); ctx.lineTo(18, 10); ctx.stroke();
    ctx.restore();
  }
  dust(ctx, { x: 0, y: 0, w: W, h: H }, 10, t, rng);
  vignette(ctx, W, H);
  goldFrame(ctx, W, H);
}
