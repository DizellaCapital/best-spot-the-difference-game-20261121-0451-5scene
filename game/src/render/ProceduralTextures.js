// ProceduralTextures.js — shared painterly helpers for the Chronicle of Curiosities.
// Every helper draws with plain Canvas 2D (gradients, soft shadows, procedural patterns)
// so the scenes look hand-illustrated without any image asset or network request.

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashSeed(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

export function vGrad(ctx, x, y, w, h, stops) {
  const g = ctx.createLinearGradient(x, y, x, y + h);
  for (const [o, c] of stops) g.addColorStop(o, c);
  return g;
}

export function glow(ctx, x, y, r, color, alpha = 0.55) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, color);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = g;
  ctx.fillRect(x - r, y - r, r * 2, r * 2); ctx.restore();
}

export function wood(ctx, x, y, w, h, base, dark, plankH = 34, rng = Math.random) {
  ctx.save();
  ctx.fillStyle = base; ctx.fillRect(x, y, w, h);
  const n = Math.ceil(h / plankH);
  for (let i = 0; i < n; i++) {
    const py = y + i * plankH;
    ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.fillRect(x, py, w, 2);
    ctx.fillStyle = 'rgba(255,255,255,0.05)'; ctx.fillRect(x, py + 2, w, 2);
    ctx.strokeStyle = dark; ctx.lineWidth = 1; ctx.globalAlpha = 0.5;
    ctx.beginPath();
    for (let gx = x; gx <= x + w; gx += 14) {
      const gy = py + plankH * 0.5 + Math.sin(gx * 0.05 + i * 2.2) * 3 + (rng() - 0.5) * 2;
      gx === x ? ctx.moveTo(gx, gy) : ctx.lineTo(gx, gy);
    }
    ctx.stroke(); ctx.globalAlpha = 1;
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.beginPath(); ctx.arc(x + 8 + rng() * (w - 16), py + plankH * 0.55, 2.2, 0, 7); ctx.fill();
  }
  ctx.restore();
}

export function brick(ctx, x, y, w, h, base, mortar, bw = 46, bh = 20) {
  ctx.save();
  ctx.fillStyle = mortar; ctx.fillRect(x, y, w, h);
  for (let row = 0, ry = y; ry < y + h; row++, ry += bh) {
    const off = row % 2 ? bw / 2 : 0;
    for (let bx = x - bw + off; bx < x + w; bx += bw) {
      const shade = 0.9 + ((row * 7 + Math.round(bx / bw)) % 3) * 0.06;
      ctx.fillStyle = shadeColor(base, shade);
      ctx.fillRect(bx + 2, ry + 2, bw - 4, bh - 4);
    }
  }
  ctx.restore();
}

export function shadeColor(hex, f) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, Math.round(((n >> 16) & 255) * f));
  const g = Math.min(255, Math.round(((n >> 8) & 255) * f));
  const b = Math.min(255, Math.round((n & 255) * f));
  return `rgb(${r},${g},${b})`;
}

export function paper(ctx, x, y, w, h, base, rng = Math.random) {
  ctx.save();
  ctx.fillStyle = base; ctx.fillRect(x, y, w, h);
  ctx.globalAlpha = 0.08;
  for (let i = 0; i < 90; i++) {
    ctx.fillStyle = rng() > 0.5 ? '#fff' : '#7a5c2e';
    ctx.fillRect(x + rng() * w, y + rng() * h, 1.6, 1.6);
  }
  ctx.restore();
}

export function stars(ctx, box, n, rng, maxR = 1.6) {
  ctx.save();
  for (let i = 0; i < n; i++) {
    const sx = box.x + rng() * box.w, sy = box.y + rng() * box.h;
    const r = 0.5 + rng() * maxR;
    ctx.globalAlpha = 0.35 + rng() * 0.6;
    ctx.fillStyle = '#ffeec2';
    ctx.beginPath(); ctx.arc(sx, sy, r, 0, 7); ctx.fill();
  }
  ctx.restore();
}

export function moon(ctx, x, y, r, phase = 'full') {
  ctx.save();
  ctx.fillStyle = '#f7ead0';
  ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
  ctx.fillStyle = 'rgba(210,190,150,0.7)';
  ctx.beginPath(); ctx.arc(x - r * 0.3, y - r * 0.2, r * 0.18, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.arc(x + r * 0.25, y + r * 0.3, r * 0.13, 0, 7); ctx.fill();
  if (phase === 'crescent') {
    ctx.fillStyle = '#0e1524';
    ctx.beginPath(); ctx.arc(x + r * 0.45, y - r * 0.1, r * 0.92, 0, 7); ctx.fill();
  }
  ctx.restore();
}

export function lantern(ctx, x, y, r, color, lit = true) {
  ctx.save();
  ctx.strokeStyle = '#3a2a18'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x, y - r - 8); ctx.lineTo(x, y - r); ctx.stroke();
  if (lit) glow(ctx, x, y, r * 2.2, color, 0.5);
  const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r);
  g.addColorStop(0, '#fff6d8'); g.addColorStop(0.55, color); g.addColorStop(1, shadeColor(color, 0.6));
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.ellipse(x, y, r, r * 1.15, 0, 0, 7); ctx.fill();
  ctx.strokeStyle = 'rgba(60,30,10,0.55)'; ctx.lineWidth = 1.4;
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath(); ctx.ellipse(x, y, r * 0.92, (r * 1.15) * (1 - Math.abs(i) * 0.18), 0, 0, 7); ctx.stroke();
  }
  ctx.fillStyle = '#8a6d1c';
  ctx.fillRect(x - r * 0.32, y - r * 1.15 - 4, r * 0.64, 5);
  ctx.fillRect(x - r * 0.32, y + r * 1.15 - 1, r * 0.64, 5);
  ctx.restore();
}

export function gear(ctx, x, y, r, teeth, color, hub = '#6d5614') {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < teeth; i++) {
    const a = (i / teeth) * Math.PI * 2;
    const a2 = a + Math.PI / teeth;
    ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    ctx.lineTo(Math.cos(a + 0.12) * (r * 1.28), Math.sin(a + 0.12) * (r * 1.28));
    ctx.lineTo(Math.cos(a2 - 0.12) * (r * 1.28), Math.sin(a2 - 0.12) * (r * 1.28));
    ctx.lineTo(Math.cos(a2) * r, Math.sin(a2) * r);
  }
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.4)'; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.fillStyle = hub;
  ctx.beginPath(); ctx.arc(0, 0, r * 0.3, 0, 7); ctx.fill();
  ctx.fillStyle = '#2c2417';
  ctx.beginPath(); ctx.arc(0, 0, r * 0.12, 0, 7); ctx.fill();
  ctx.restore();
}

export function bookRow(ctx, x, y, w, h, palette, rng, lean = 0) {
  ctx.save();
  let bx = x;
  while (bx < x + w - 8) {
    const bw = 9 + rng() * 9, bh = h * (0.82 + rng() * 0.18);
    const c = palette[Math.floor(rng() * palette.length)];
    ctx.fillStyle = c;
    ctx.fillRect(bx, y + h - bh, bw, bh);
    ctx.fillStyle = 'rgba(255,255,255,0.16)';
    ctx.fillRect(bx, y + h - bh, bw, 3);
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(bx, y + h - bh + 8, bw, 2);
    ctx.fillRect(bx, y + h - 6, bw, 2);
    bx += bw + 1.5;
  }
  ctx.restore();
}

export function foliage(ctx, x, y, n, rng, colors) {
  ctx.save();
  for (let i = 0; i < n; i++) {
    const lx = x + (rng() - 0.5) * 90, ly = y + (rng() - 0.5) * 46;
    const r = 7 + rng() * 13;
    ctx.fillStyle = colors[Math.floor(rng() * colors.length)];
    ctx.globalAlpha = 0.85;
    ctx.beginPath(); ctx.ellipse(lx, ly, r, r * 0.62, rng() * 3, 0, 7); ctx.fill();
  }
  ctx.restore();
}

export function dust(ctx, box, n, t, rng) {
  ctx.save();
  for (let i = 0; i < n; i++) {
    const px = box.x + ((rng() * box.w + t * 6 * (0.4 + rng())) % box.w);
    const py = box.y + ((rng() * box.h + Math.sin(t * 0.7 + i) * 8 + box.h) % box.h);
    ctx.globalAlpha = 0.12 + 0.1 * Math.sin(t + i * 2);
    ctx.fillStyle = '#ffe9a8';
    ctx.beginPath(); ctx.arc(px, py, 1.1 + (i % 3) * 0.5, 0, 7); ctx.fill();
  }
  ctx.restore();
}

export function vignette(ctx, W, H) {
  const g = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.42, W / 2, H / 2, Math.max(W, H) * 0.72);
  g.addColorStop(0, 'rgba(0,0,0,0)');
  g.addColorStop(1, 'rgba(10,8,4,0.42)');
  ctx.save(); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore();
}

export function goldFrame(ctx, W, H) {
  ctx.save();
  ctx.strokeStyle = '#c9a227'; ctx.lineWidth = 3;
  ctx.strokeRect(4, 4, W - 8, H - 8);
  ctx.strokeStyle = 'rgba(232,199,102,0.6)'; ctx.lineWidth = 1;
  ctx.strokeRect(9, 9, W - 18, H - 18);
  ctx.restore();
}

export function waterShimmer(ctx, x, y, w, h, t) {
  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 1.4;
  for (let i = 0; i < 5; i++) {
    const yy = y + 6 + i * ((h - 10) / 4);
    ctx.beginPath();
    for (let sx = x; sx <= x + w; sx += 8) {
      const sy = yy + Math.sin(sx * 0.08 + t * 1.6 + i * 1.7) * 2.2;
      sx === x ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy);
    }
    ctx.stroke();
  }
  ctx.restore();
}
