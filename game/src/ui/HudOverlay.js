// HudOverlay.js — the DOM chrome around the two canvases: scene title, the
// remaining counter, the timer, hint and sound buttons, scene picker, toasts
// and the scene-complete banner. The canvases themselves are drawn by the renderer.

export class HudOverlay {
  constructor() {
    this.sceneName = document.getElementById('sceneName');
    this.counter = document.getElementById('counter');
    this.timer = document.getElementById('timer');
    this.hintBtn = document.getElementById('hintBtn');
    this.soundBtn = document.getElementById('soundBtn');
    this.sceneBtns = document.getElementById('sceneBtns');
    this.toastEl = document.getElementById('toast');
    this.banner = document.getElementById('banner');
    this.bannerTitle = document.getElementById('bannerTitle');
    this.bannerSub = document.getElementById('bannerSub');
    this.bannerBtn = document.getElementById('bannerBtn');
    this.status = document.getElementById('status');
    this.toastTimer = null;
    this.quiet = false;
  }

  setScene(scene, index) {
    this.sceneName.textContent = `Scene ${index + 1} · ${scene.title}`;
    for (const b of this.sceneBtns.children) b.classList.toggle('active', Number(b.dataset.i) === index);
  }

  setCounter(found, total) {
    this.counter.textContent = `Found: ${found} / ${total}  •  ${total - found} Remaining`;
  }

  setTimer(seconds) {
    const s = Math.max(0, Math.ceil(seconds));
    this.timer.textContent = `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
    this.timer.classList.toggle('low', s <= 30);
  }

  setHints(n) {
    this.hintBtn.textContent = `Hint (H) · ${n}`;
    this.hintBtn.disabled = n <= 0;
  }

  setSound(on) {
    this.soundBtn.textContent = on ? 'Sound: On' : 'Sound: Off';
  }

  buildSceneButtons(scenes, activeIndex, onSelect) {
    this.sceneBtns.innerHTML = '';
    scenes.forEach((sc, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.dataset.i = String(i);
      b.textContent = String(i + 1);
      b.title = sc.title;
      b.classList.toggle('active', i === activeIndex);
      b.addEventListener('click', () => onSelect(i));
      this.sceneBtns.appendChild(b);
    });
  }

  toast(msg) {
    this.status.textContent = msg;
    if (this.quiet) return;
    this.toastEl.textContent = msg;
    this.toastEl.classList.add('show');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.toastEl.classList.remove('show'), 2400);
  }

  showBanner(title, sub, btnLabel) {
    this.bannerTitle.textContent = title;
    this.bannerSub.textContent = sub;
    this.bannerBtn.textContent = btnLabel;
    this.banner.hidden = false;
  }

  hideBanner() {
    this.banner.hidden = true;
  }
}
