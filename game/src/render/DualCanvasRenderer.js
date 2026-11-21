// DualCanvasRenderer.js — draws both panels of the spot-the-difference game.
// Left panel: the original picture. Right panel: the same picture with the 7
// active differences applied (missing ones omitted, the rest altered or added).
// On top of both it draws found markers (hand-drawn gold rings + sparkles),
// the synchronized dual loupe, hint radar rings and misclick ripples.
import { foundCount } from '../engine/DifferenceDetector.js';

function handDrawnRing(ctx, x, y, r, color, width) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.shadowColor = color;
  ctx.shadowBlur = 8;
  ctx.beginPath();
  const steps = 26;
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    const rr = r * (1 + 0.055 * Math.sin(i * 2.3) + 0.03 * Math.cos(i * 4.1));
    const px = x + Math.cos(a) * rr, py = y + Math.sin(a) * rr;
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.stroke();
  ctx.restore();
}

function star(ctx, x, y, r, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y - r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.quadraticCurveTo(x, y, x, y + r);
  ctx.quadraticCurveTo(x, y, x - r, y); ctx.quadraticCurveTo(x, y, x, y - r);
  ctx.fill();
  ctx.restore();
}

export class DualCanvasRenderer {
  constructor(left, right) {
    this.left = left;
    this.right = right;
    this.lctx = left.getContext('2d');
    this.rctx = right.getContext('2d');
    this.scene = null;
    this.active = [];
    this.particles = [];
    this.ripples = [];
  }

  setScene(scene, active) {
    this.scene = scene;
    this.active = active;
    this.particles = [];
    this.ripples = [];
  }

  spawnSparkles(x, y) {
    for (let i = 0; i < 16; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = 26 + Math.random() * 46;
      this.particles.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 14, born: performance.now() / 1000, life: 0.55 + Math.random() * 0.35 });
    }
  }

  spawnRipple(x, y) {
    this.ripples.push({ x, y, born: performance.now() / 1000 });
  }

  drawPanel(ctx, W, H, t, side, view) {
    const missing = new Set(this.active.filter((d) => d.kind === 'missing').map((d) => d.id));
    const all = new Set(this.active.map((d) => d.id));
    const opts = side === 'left'
      ? { omit: new Set(), alter: new Set() }
      : { omit: missing, alter: all };
    this.scene.drawBase(ctx, W, H, t, opts);
    // Found markers on both panels.
    for (const d of this.active) {
      if (!d.found) continue;
      handDrawnRing(ctx, d.x, d.y, d.r + 7, '#e8c766', 3.5);
      star(ctx, d.x, d.y, 6, '#ffe9a8');
    }
    // Hint radar ring (pulsing, on both panels).
    if (view.hint && t < view.hint.until) {
      const d = view.hint.d;
      const phase = (t * 1.4) % 1;
      ctx.save();
      ctx.strokeStyle = `rgba(127,212,168,${0.9 - phase * 0.7})`;
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(d.x, d.y, d.r + 6 + phase * 16, 0, 7); ctx.stroke();
      ctx.strokeStyle = 'rgba(232,199,102,0.9)';
      ctx.beginPath(); ctx.arc(d.x, d.y, d.r + 2, 0, 7); ctx.stroke();
      ctx.restore();
    }
    // Misclick ripples.
    this.ripples = this.ripples.filter((rp) => t - rp.born < 0.5);
    for (const rp of this.ripples) {
      const p = (t - rp.born) / 0.5;
      ctx.save();
      ctx.strokeStyle = `rgba(255,120,100,${0.85 * (1 - p)})`;
      ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(rp.x, rp.y, 6 + p * 22, 0, 7); ctx.stroke();
      ctx.restore();
    }
    // Sparkle particles.
    const now = t;
    this.particles = this.particles.filter((pt) => now - pt.born < pt.life);
    for (const pt of this.particles) {
      const age = now - pt.born;
      const px = pt.x + pt.vx * age;
      const py = pt.y + pt.vy * age + 22 * age * age;
      ctx.save();
      ctx.globalAlpha = Math.max(0, 1 - age / pt.life);
      star(ctx, px, py, 3.5, '#ffe9a8');
      ctx.restore();
    }
    // Synchronized dual loupe: brass ring + crosshair on both panels.
    if (view.loupe) {
      const { x, y } = view.loupe;
      ctx.save();
      ctx.strokeStyle = '#e8c766'; ctx.lineWidth = 2.5;
      ctx.shadowColor = '#e8c766'; ctx.shadowBlur = 6;
      ctx.beginPath(); ctx.arc(x, y, 34, 0, 7); ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = 'rgba(232,199,102,0.85)'; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(x - 42, y); ctx.lineTo(x - 28, y); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x + 28, y); ctx.lineTo(x + 42, y); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x, y - 42); ctx.lineTo(x, y - 28); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x, y + 28); ctx.lineTo(x, y + 42); ctx.stroke();
      ctx.fillStyle = '#e8c766';
      ctx.beginPath(); ctx.arc(x, y, 2.5, 0, 7); ctx.fill();
      ctx.restore();
    }
  }

  render(t, view) {
    const W = this.left.width, H = this.left.height;
    if (!this.scene) return;
    this.drawPanel(this.lctx, W, H, t, 'left', view);
    this.drawPanel(this.rctx, W, H, t, 'right', view);
  }
}
