// DifferenceDetector.js — picks the 7 active differences from a scene's candidates
// (seeded, so a playthrough is reproducible) and hit-tests clicks against them.
import { mulberry32 } from '../render/ProceduralTextures.js';

// Deterministic shuffle (Fisher-Yates with a seeded RNG), then take the first 7.
export function pickSeven(candidates, seed) {
  const rng = mulberry32(seed >>> 0);
  const pool = candidates.slice();
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, 7).map((d) => ({ ...d, found: false }));
}

// The nearest unfound difference whose circle contains (x, y); null otherwise.
export function findDifference(active, x, y) {
  let best = null, bestD = Infinity;
  for (const d of active) {
    if (d.found) continue;
    const dist = Math.hypot(x - d.x, y - d.y);
    if (dist <= d.r && dist < bestD) { best = d; bestD = dist; }
  }
  return best;
}

export function remainingCount(active) {
  return active.filter((d) => !d.found).length;
}

export function foundCount(active) {
  return active.filter((d) => d.found).length;
}
