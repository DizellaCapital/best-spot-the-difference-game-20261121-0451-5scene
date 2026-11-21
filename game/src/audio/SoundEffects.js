// SoundEffects.js — all sounds are synthesized with the Web Audio API.
// No audio files, no network: a pleasant chime on each find, a soft thud on a
// misclick, a shimmer for hints, and a small fanfare when a scene is complete.

export class SoundEffects {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.master = null;
  }

  ensure() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.5;
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();
    return true;
  }

  tone(freq, start, dur, type = 'sine', vol = 0.22) {
    if (!this.enabled || !this.ensure()) return;
    const t0 = this.ctx.currentTime + start;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g); g.connect(this.master);
    osc.start(t0); osc.stop(t0 + dur + 0.05);
  }

  found() {
    this.tone(659.25, 0, 0.35);
    this.tone(987.77, 0.07, 0.4);
    this.tone(1318.5, 0.14, 0.5, 'sine', 0.16);
  }

  miss() {
    this.tone(110, 0, 0.16, 'sine', 0.18);
    this.tone(82, 0.02, 0.18, 'triangle', 0.1);
  }

  hint() {
    this.tone(1046.5, 0, 0.22, 'sine', 0.14);
    this.tone(1318.5, 0.08, 0.22, 'sine', 0.14);
    this.tone(1567.98, 0.16, 0.3, 'sine', 0.12);
  }

  complete() {
    this.tone(523.25, 0, 0.3);
    this.tone(659.25, 0.12, 0.3);
    this.tone(783.99, 0.24, 0.3);
    this.tone(1046.5, 0.36, 0.55, 'sine', 0.2);
  }

  tick() {
    this.tone(880, 0, 0.06, 'square', 0.06);
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }
}
