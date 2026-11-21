[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/DizellaCapital/best-spot-the-difference-game-20261121-0451-5scene/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/DizellaCapital/best-spot-the-difference-game-20261121-0451-5scene/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

Built for the [make.fun bounty — Make the best spot the difference game](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451). Referral code: qxacafna.

# Chronicle of Curiosities — Spot the Difference

A cozy detective / art-restoration spot-the-difference game, built for the
make.fun bounty `best-spot-the-difference-game-20261121-0451`.

## The game

Five richly illustrated scenes, each drawn procedurally with layered Canvas 2D
(no image assets, no network): the Clockmaker's Midnight Workshop, the
Botanical Conservatory at Dusk, the Harbor Café & Lighthouse, the Grand
Observatory Library, and the Lantern Night Market. Every scene hides 7
differences (picked from 8 authored candidates, seeded) across colour, shape,
orientation, pattern, missing and added objects.

- Two near-identical pictures side by side, with a synchronized dual loupe:
  hovering either picture shows a brass ring and crosshair on its twin.
- Click a difference on either panel to mark both with a hand-drawn gold ring,
  a sparkle burst and a chime. A misclick costs 3 seconds.
- A rechargeable hint (H) rings one unfound difference; a 3-minute timer
  keeps the pressure on. Keyboard: arrows/WASD move the loupe, Enter/Space
  inspect, H hint, N next scene, 1–5 jump to a scene.
- All sounds are synthesized with the Web Audio API. 100% offline.

## Run it

Serve `game/` with any static server and open `index.html` in a desktop
browser (for example `node serve.ts` in a starter checkout, or any static
server pointed at `game/`). Deep links: `?scene=0..4`, `?found=0..7`,
`?seed=N`, `?quiet=1` (screenshot mode, no toasts).

## Layout

- `game/index.html`, `game/styles.css` — shell and parchment/brass theme.
- `game/src/main.js` — bootstrap, input, animation loop.
- `game/src/engine/GameController.js` — state, timer, hints, score.
- `game/src/engine/DifferenceDetector.js` — seeded pick of 7, hit-testing.
- `game/src/render/DualCanvasRenderer.js` — both panels, markers, loupe, particles.
- `game/src/render/ProceduralTextures.js` — painterly helpers (wood, brick,
  lanterns, gears, foliage, glows).
- `game/src/scenes/*.js` — one module per scene, each with its illustration
  and its 8 difference candidates.
- `game/src/audio/SoundEffects.js` — Web Audio chimes, thuds and fanfares.
- `game/src/ui/HudOverlay.js` — counter, timer, scene picker, toasts, banner.
- `main.ts` hands the game in: it copies `game/` and `screenshots/` to
  `/output` and writes `/output/dossier.json` with the vendored library.
