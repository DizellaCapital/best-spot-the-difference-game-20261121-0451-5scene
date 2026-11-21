// GameController.js — the state machine of Chronicle of Curiosities.
// Owns the scene, the 7 active differences, the found set, the timer, hints and
// score. The renderer draws the state; the HUD shows it; main.js wires input.
import { pickSeven, findDifference, remainingCount, foundCount } from './DifferenceDetector.js';

export const SCENE_TIME = 180;

export class GameController {
  constructor(scenes, sound) {
    this.scenes = scenes;
    this.sound = sound;
    this.sceneIndex = 0;
    this.scene = scenes[0];
    this.active = [];
    this.seed = 7;
    this.timeLeft = SCENE_TIME;
    this.hints = 3;
    this.hintTarget = null;
    this.hintUntil = 0;
    this.score = 0;
    this.status = 'playing';
    this.misses = 0;
    this.onEvent = null;
  }

  loadScene(index, seed = 7) {
    this.sceneIndex = ((index % this.scenes.length) + this.scenes.length) % this.scenes.length;
    this.scene = this.scenes[this.sceneIndex];
    this.seed = seed;
    this.active = pickSeven(this.scene.candidates, seed * 31 + this.sceneIndex * 7 + 11);
    this.timeLeft = SCENE_TIME;
    this.hints = 3;
    this.hintTarget = null;
    this.hintUntil = 0;
    this.status = 'playing';
    this.misses = 0;
    this.emit('scene', { scene: this.scene, index: this.sceneIndex });
  }

  // Mark the first n active differences as found (screenshot / deep-link setup).
  prefound(n) {
    for (let i = 0; i < Math.min(n, this.active.length); i++) this.active[i].found = true;
    this.score = foundCount(this.active) * 100;
    this.emit('found', { found: foundCount(this.active), total: this.active.length });
  }

  inspect(x, y) {
    if (this.status !== 'playing') return null;
    const d = findDifference(this.active, x, y);
    if (d) {
      d.found = true;
      this.score += 100 + Math.max(0, Math.floor(this.timeLeft / 10));
      this.sound.found();
      this.emit('found', { d, found: foundCount(this.active), total: this.active.length });
      if (remainingCount(this.active) === 0) this.completeScene();
      return d;
    }
    this.misses += 1;
    this.timeLeft = Math.max(0, this.timeLeft - 3);
    this.sound.miss();
    this.emit('miss', { timeLeft: this.timeLeft });
    return null;
  }

  hint(now) {
    if (this.status !== 'playing' || this.hints <= 0) return null;
    const rest = this.active.filter((d) => !d.found);
    if (!rest.length) return null;
    this.hints -= 1;
    this.hintTarget = rest[Math.floor(Math.random() * rest.length)];
    this.hintUntil = now + 2.5;
    this.sound.hint();
    this.emit('hint', { hints: this.hints, d: this.hintTarget });
    return this.hintTarget;
  }

  completeScene() {
    this.status = 'complete';
    this.score += 250;
    this.sound.complete();
    this.emit('complete', { score: this.score, scene: this.scene });
  }

  timeout() {
    this.status = 'timeout';
    this.emit('timeout', { found: foundCount(this.active), total: this.active.length });
  }

  nextScene() {
    this.loadScene(this.sceneIndex + 1, this.seed);
  }

  tick(dt, now) {
    if (this.status !== 'playing') return;
    this.timeLeft = Math.max(0, this.timeLeft - dt);
    if (this.timeLeft <= 0) this.timeout();
    if (this.hintTarget && now > this.hintUntil) { this.hintTarget = null; }
    if (this.timeLeft <= 10 && this.timeLeft > 0 && Math.ceil(this.timeLeft) !== Math.ceil(this.timeLeft + dt)) this.sound.tick();
  }

  emit(kind, data) {
    if (this.onEvent) this.onEvent(kind, data);
  }
}
