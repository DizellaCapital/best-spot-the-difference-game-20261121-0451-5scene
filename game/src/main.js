// main.js — boots Chronicle of Curiosities: wires the canvases, the controller,
// the renderer, the HUD and the sound; handles mouse, keyboard and URL params.
// Deep links: ?scene=0..4 picks a scene, ?found=0..7 pre-marks finds (used by the
// screenshot runs), ?seed=N makes the difference set reproducible.
import { GameController } from './engine/GameController.js';
import { DualCanvasRenderer } from './render/DualCanvasRenderer.js';
import { HudOverlay } from './ui/HudOverlay.js';
import { SoundEffects } from './audio/SoundEffects.js';
import * as Clockmaker from './scenes/ClockmakerWorkshop.js';
import * as Botanical from './scenes/BotanicalConservatory.js';
import * as Harbor from './scenes/HarborLighthouse.js';
import * as Observatory from './scenes/ObservatoryLibrary.js';
import * as Lantern from './scenes/LanternNightMarket.js';

const SCENES = [Clockmaker, Botanical, Harbor, Observatory, Lantern];
const params = new URLSearchParams(location.search);
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const sceneParam = clamp(parseInt(params.get('scene') || '0', 10) || 0, 0, SCENES.length - 1);
const foundParam = clamp(parseInt(params.get('found') || '0', 10) || 0, 0, 7);
const seedParam = parseInt(params.get('seed') || '7', 10) || 7;
const quietParam = params.has('quiet');

const left = document.getElementById('canvasLeft');
const right = document.getElementById('canvasRight');
const sound = new SoundEffects();
const hud = new HudOverlay();
hud.quiet = quietParam;
const controller = new GameController(SCENES, sound);
const renderer = new DualCanvasRenderer(left, right);

const loupe = { x: 308, y: 202, visible: false };
let bannerMode = 'next';

function canvasPos(canvas, ev) {
  const r = canvas.getBoundingClientRect();
  return {
    x: (ev.clientX - r.left) * (canvas.width / r.width),
    y: (ev.clientY - r.top) * (canvas.height / r.height),
  };
}

function refreshHud() {
  hud.setScene(controller.scene, controller.sceneIndex);
  hud.setCounter(controller.active.filter((d) => d.found).length, controller.active.length);
  hud.setTimer(controller.timeLeft);
  hud.setHints(controller.hints);
}

controller.onEvent = (kind, data) => {
  if (kind === 'scene') {
    renderer.setScene(data.scene, controller.active);
    hud.hideBanner();
    refreshHud();
    hud.toast(`${data.scene.title} — find 7 differences!`);
  } else if (kind === 'found') {
    refreshHud();
    if (data.d) hud.toast(`Found: ${data.d.label}! (${data.found}/${data.total})`);
  } else if (kind === 'miss') {
    refreshHud();
    hud.toast('Not quite there — 3 seconds lost.');
  } else if (kind === 'hint') {
    hud.setHints(data.hints);
    hud.toast(data.hints > 0 ? `Hint used — ${data.hints} left.` : 'Last hint used.');
  } else if (kind === 'complete') {
    bannerMode = 'next';
    hud.showBanner('Scene Complete!', `All 7 differences found in ${data.scene.title}. Score: ${data.score}.`, 'Next Scene (N)');
  } else if (kind === 'timeout') {
    bannerMode = 'retry';
    hud.showBanner("Time's Up", `You found ${data.found} of ${data.total} differences. The rest are circled in gold — try again!`, 'Try Again');
    for (const d of controller.active) d.found = true;
    refreshHud();
  }
};

function inspectAt(x, y, canvas) {
  sound.ensure();
  const d = controller.inspect(x, y);
  if (d) renderer.spawnSparkles(d.x, d.y);
  else {
    renderer.spawnRipple(x, y);
    canvas.animate(
      [{ transform: 'translateX(0)' }, { transform: 'translateX(-4px)' }, { transform: 'translateX(4px)' }, { transform: 'translateX(0)' }],
      { duration: 220 },
    );
  }
}

for (const canvas of [left, right]) {
  canvas.addEventListener('mousemove', (ev) => {
    const p = canvasPos(canvas, ev);
    loupe.x = p.x; loupe.y = p.y; loupe.visible = true;
  });
  canvas.addEventListener('mouseleave', () => { loupe.visible = false; });
  canvas.addEventListener('click', (ev) => {
    const p = canvasPos(canvas, ev);
    inspectAt(p.x, p.y, canvas);
  });
}

hud.hintBtn.addEventListener('click', () => {
  sound.ensure();
  controller.hint(performance.now() / 1000);
});
hud.soundBtn.addEventListener('click', () => hud.setSound(sound.toggle()));
hud.bannerBtn.addEventListener('click', () => {
  if (bannerMode === 'next') controller.nextScene();
  else controller.loadScene(controller.sceneIndex, controller.seed);
});
hud.buildSceneButtons(SCENES, sceneParam, (i) => controller.loadScene(i, controller.seed));

window.addEventListener('keydown', (ev) => {
  const step = ev.shiftKey ? 42 : 14;
  const k = ev.key.toLowerCase();
  if (k === 'arrowleft' || k === 'a') { loupe.x = clamp(loupe.x - step, 0, 616); loupe.visible = true; ev.preventDefault(); }
  else if (k === 'arrowright' || k === 'd') { loupe.x = clamp(loupe.x + step, 0, 616); loupe.visible = true; ev.preventDefault(); }
  else if (k === 'arrowup' || k === 'w') { loupe.y = clamp(loupe.y - step, 0, 404); loupe.visible = true; ev.preventDefault(); }
  else if (k === 'arrowdown' || k === 's') { loupe.y = clamp(loupe.y + step, 0, 404); loupe.visible = true; ev.preventDefault(); }
  else if (k === 'enter' || k === ' ') { sound.ensure(); inspectAt(loupe.x, loupe.y, left); ev.preventDefault(); }
  else if (k === 'h') { sound.ensure(); controller.hint(performance.now() / 1000); }
  else if (k === 'n') { controller.nextScene(); }
  else if (k >= '1' && k <= '5') { controller.loadScene(Number(k) - 1, controller.seed); }
});

// Boot.
controller.loadScene(sceneParam, seedParam);
if (foundParam > 0) {
  controller.prefound(foundParam);
  refreshHud();
}
hud.setSound(true);

// Animation loop.
let last = performance.now();
let firstFrame = true;
function frame(now) {
  const t = now / 1000;
  const dt = Math.min(0.1, (now - last) / 1000);
  last = now;
  controller.tick(dt, t);
  renderer.render(t, {
    loupe: loupe.visible ? { x: loupe.x, y: loupe.y } : null,
    hint: controller.hintTarget ? { d: controller.hintTarget, until: controller.hintUntil } : null,
  });
  hud.setTimer(controller.timeLeft);
  if (firstFrame) {
    firstFrame = false;
    document.getElementById('app').dataset.ready = '1';
    window.__shotReady = true;
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
