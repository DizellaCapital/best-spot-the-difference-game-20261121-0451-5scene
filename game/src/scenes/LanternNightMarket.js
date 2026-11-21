// Lantern Night Market — scene 5 of Chronicle of Curiosities.
// A night market street: strings of paper lanterns, a fruit stall, a steaming
// food cart, hanging fabrics, a pottery stall, banners, and a full moon.
import { mulberry32, hashSeed, glow, lantern, moon, stars, dust, vignette, goldFrame, vGrad } from '../render/ProceduralTextures.js';

export const id = 'lantern-market';
export const title = 'Lantern Night Market';
export const tagline = 'Paper lanterns, warm steam and a hundred small wonders.';

export const candidates = [
  { id: 'lantern-color', x: 200, y: 70, r: 16, label: 'Lantern colour', kind: 'color' },
  { id: 'stall-pot', x: 520, y: 300, r: 14, label: 'Pot on the stall', kind: 'missing' },
  { id: 'fabric-pattern', x: 390, y: 300, r: 18, label: 'Fabric pattern', kind: 'pattern' },
  { id: 'moon', x: 540, y: 60, r: 18, label: 'Moon phase', kind: 'shape' },
  { id: 'steam', x: 245, y: 250, r: 16, label: 'Steam from the cart', kind: 'added' },
  { id: 'banner-symbol', x: 420, y: 150, r: 14, label: 'Banner symbol', kind: 'pattern' },
  { id: 'kite', x: 340, y: 58, r: 14, label: 'Kite in the sky', kind: 'added' },
  { id: 'lantern-count', x: 380, y: 115, r: 14, label: 'Lantern on the string', kind: 'missing' },
];

function kite(ctx, x, y, t) {
  const sway = Math.sin(t * 1.1) * 5;
  ctx.save(); ctx.translate(x + sway, y + Math.sin(t * 1.6) * 3);
  ctx.fillStyle = '#c94a6d';
  ctx.beginPath(); ctx.moveTo(0, -12); ctx.lineTo(10, 0); ctx.lineTo(0, 12); ctx.lineTo(-10, 0); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#e8c766'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(0, -12); ctx.lineTo(0, 12); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-10, 0); ctx.lineTo(10, 0); ctx.stroke();
  ctx.strokeStyle = '#f3e7c8'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, 12); ctx.quadraticCurveTo(6, 26, 0, 38); ctx.stroke();
  ctx.restore();
}

export function drawBase(ctx, W, H, t, opts = {}) {
  const omit = opts.omit || new Set();
  const alter = opts.alter || new Set();
  const rng = mulberry32(hashSeed(id));
  // Night sky.
  ctx.fillStyle = vGrad(ctx, 0, 0, W, 260, [[0, '#141a33'], [0.6, '#2c2a55'], [1, '#5a3a6d']]);
  ctx.fillRect(0, 0, W, 260);
  stars(ctx, { x: 0, y: 0, w: W, h: 180 }, 34, rng);
  moon(ctx, 540, 60, 17, alter.has('moon') ? 'crescent' : 'full');
  // Kite (only on the altered picture).
  if (alter.has('kite')) kite(ctx, 340, 58, t);
  // Lantern strings.
  ctx.save();
  ctx.strokeStyle = '#2c2417'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0, 46); ctx.quadraticCurveTo(308, 88, 616, 46); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, 96); ctx.quadraticCurveTo(308, 138, 616, 96); ctx.stroke();
  ctx.restore();
  const stringY = (x, top) => top ? 46 + Math.sin((x / W) * Math.PI) * 42 : 96 + Math.sin((x / W) * Math.PI) * 42;
  lantern(ctx, 90, stringY(90, true), 13, '#ff5a3d', true);
  lantern(ctx, 200, stringY(200, true), 14, alter.has('lantern-color') ? '#3ec94a' : '#ff5a3d', true);
  lantern(ctx, 300, stringY(300, true), 12, '#e8c766', true);
  lantern(ctx, 420, stringY(420, true), 14, '#ff5a3d', true);
  lantern(ctx, 520, stringY(520, true), 13, '#e8c766', true);
  lantern(ctx, 150, stringY(150, false), 12, '#e8c766', true);
  lantern(ctx, 260, stringY(260, false), 13, '#ff5a3d', true);
  if (!omit.has('lantern-count')) lantern(ctx, 380, stringY(380, false), 13, '#3ec94a', true);
  lantern(ctx, 490, stringY(490, false), 12, '#ff5a3d', true);
  lantern(ctx, 580, stringY(580, false), 12, '#e8c766', true);
  // Banner (symbol changes: star or moon).
  ctx.save();
  ctx.fillStyle = '#7a2e2e'; ctx.fillRect(396, 138, 48, 40);
  ctx.fillStyle = '#e8c766'; ctx.beginPath(); ctx.moveTo(396, 178); ctx.lineTo(420, 166); ctx.lineTo(444, 178); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#e8c766'; ctx.lineWidth = 2;
  if (alter.has('banner-symbol')) {
    ctx.beginPath(); ctx.arc(420, 156, 9, 0.4, 5.4); ctx.stroke();
  } else {
    ctx.beginPath();
    for (let p = 0; p < 5; p++) {
      const a = -Math.PI / 2 + (p / 5) * Math.PI * 2;
      const px = 420 + Math.cos(a) * 9, py = 156 + Math.sin(a) * 9;
      p === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      const a2 = a + Math.PI / 5;
      ctx.lineTo(420 + Math.cos(a2) * 4, 156 + Math.sin(a2) * 4);
    }
    ctx.closePath(); ctx.stroke();
  }
  ctx.restore();
  // Cobblestone street.
  ctx.fillStyle = '#4a4438'; ctx.fillRect(0, 372, W, 32);
  ctx.fillStyle = '#5a5348';
  for (let i = 0; i < 10; i++) { ctx.beginPath(); ctx.ellipse(30 + i * 62, 388, 26, 10, 0, 0, 7); ctx.fill(); }
  // Fruit stall, left.
  ctx.save();
  ctx.fillStyle = '#7a2e2e'; ctx.fillRect(16, 268, 150, 14);
  ctx.fillStyle = '#5a3a20'; ctx.fillRect(22, 282, 138, 8);
  ctx.fillStyle = '#8a5a2e';
  ctx.beginPath(); ctx.ellipse(60, 292, 34, 12, 0, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.ellipse(126, 292, 34, 12, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#c94a3a';
  for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.arc(38 + i * 9, 286, 5, 0, 7); ctx.fill(); }
  ctx.fillStyle = '#ff9a3d';
  for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.arc(104 + i * 9, 286, 5, 0, 7); ctx.fill(); }
  ctx.fillStyle = '#6d4a26'; ctx.fillRect(20, 290, 6, 82); ctx.fillRect(156, 290, 6, 82);
  ctx.restore();
  // Food cart with steam.
  ctx.save();
  ctx.fillStyle = '#3a5a6a'; ctx.fillRect(196, 292, 100, 60);
  ctx.fillStyle = '#2c4450'; ctx.fillRect(196, 292, 100, 12);
  ctx.fillStyle = '#e8c766'; ctx.font = 'bold 13px Georgia, serif'; ctx.textAlign = 'center';
  ctx.fillText('NOODLES', 246, 302);
  ctx.fillStyle = '#8a5a2e';
  ctx.beginPath(); ctx.ellipse(226, 322, 22, 8, 0, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.ellipse(268, 322, 22, 8, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#f3e7c8';
  ctx.beginPath(); ctx.ellipse(226, 319, 18, 5, 0, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.ellipse(268, 319, 18, 5, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#5a3a20'; ctx.beginPath(); ctx.arc(206, 360, 8, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.arc(286, 360, 8, 0, 7); ctx.fill();
  ctx.restore();
  // Steam (only on the altered picture).
  if (alter.has('steam')) {
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 3; ctx.lineCap = 'round';
    for (let s = 0; s < 3; s++) {
      const sx = 232 + s * 14;
      ctx.beginPath();
      ctx.moveTo(sx, 308);
      ctx.quadraticCurveTo(sx + 6, 292, sx - 2 + Math.sin(t * 2 + s) * 3, 272 - s * 4);
      ctx.stroke();
    }
    ctx.restore();
  }
  // Fabric stall, centre-right (pattern changes: stripes or dots).
  ctx.save();
  ctx.fillStyle = '#5a3a20'; ctx.fillRect(316, 268, 150, 10);
  const fabric = (x, c1, c2) => {
    ctx.fillStyle = c1; ctx.fillRect(x, 278, 44, 62);
    ctx.fillStyle = c2;
    if (alter.has('fabric-pattern')) {
      for (let dy = 286; dy < 336; dy += 12) for (let dx = x + 6; dx < x + 40; dx += 12) {
        ctx.beginPath(); ctx.arc(dx, dy, 2.6, 0, 7); ctx.fill();
      }
    } else {
      for (let dx = x + 8; dx < x + 40; dx += 11) ctx.fillRect(dx, 278, 5, 62);
    }
  };
  fabric(320, '#c94a6d', '#e8c766');
  fabric(368, '#4a7ac9', '#f3e7c8');
  fabric(416, '#3a8a5a', '#e8c766');
  ctx.fillStyle = '#6d4a26'; ctx.fillRect(320, 340, 6, 32); ctx.fillRect(456, 340, 6, 32);
  ctx.restore();
  // Pottery stall, right (one pot missing).
  ctx.save();
  ctx.fillStyle = '#8a5a2e'; ctx.fillRect(478, 292, 124, 10);
  ctx.fillStyle = '#b25a2e';
  ctx.beginPath(); ctx.ellipse(500, 282, 12, 10, 0, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.ellipse(540, 282, 12, 10, 0, 0, 7); ctx.fill();
  if (!omit.has('stall-pot')) {
    ctx.beginPath(); ctx.ellipse(578, 282, 12, 10, 0, 0, 7); ctx.fill();
  }
  ctx.fillStyle = '#7a3a6d';
  ctx.beginPath(); ctx.ellipse(520, 268, 10, 8, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#6d4a26'; ctx.fillRect(482, 302, 6, 70); ctx.fillRect(592, 302, 6, 70);
  ctx.restore();
  // Cat on the street + string lights glow.
  ctx.save();
  ctx.fillStyle = '#2c2417';
  ctx.beginPath(); ctx.ellipse(60, 388, 14, 8, 0, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.arc(70, 380, 7, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.moveTo(64, 374); ctx.lineTo(66, 366); ctx.lineTo(69, 374); ctx.closePath(); ctx.fill();
  ctx.restore();
  glow(ctx, 300, 100, 130, '#ffb347', 0.18);
  dust(ctx, { x: 0, y: 0, w: W, h: H }, 12, t, rng);
  vignette(ctx, W, H);
  goldFrame(ctx, W, H);
}
