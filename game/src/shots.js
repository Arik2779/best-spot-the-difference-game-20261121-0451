// Screenshot scenes behind ?shot=start|play|end. Each one stages the real game state
// (no autopilot needed — the scenes are set directly), so the frame is what a real
// game looks like and the same seed always gives the same frame.
import { SCREEN } from './config.js';
import { LEVELS } from './levels.js';

export function stageShot(name, game) {
  const { state } = game;
  if (name === 'play') {
    // Mid-game: 3 of 8 found and marked on both panels, 5 still hiding,
    // counter and timer bar clearly visible.
    game.startLevel(0);
    state.screen = SCREEN.PLAY;
    for (const id of ['lantern-missing', 'cat-moved', 'jar-lid']) state.found.add(id);
    state.score = 325;
    state.combo = 2;
    state.timeLeft = 118;
    state.totalFound = 3;
    state.message = 'Found a candy-jar lid! +125 (combo x2)';
    state.messageTime = 99;
    return;
  }
  if (name === 'end') {
    // Round complete: every difference found and ringed, bonus shown.
    game.startLevel(0);
    state.screen = SCREEN.PLAY;
    for (const d of LEVELS[0].differences) state.found.add(d.id);
    state.score = 800;
    state.timeLeft = 96;
    state.roundBonus = 960;
    state.score += state.roundBonus;
    state.totalFound = 8;
    state.screen = SCREEN.ROUND;
    return;
  }
  // Default: title screen over the level-1 scene.
  state.screen = SCREEN.TITLE;
  state.timeLeft = LEVELS[0].seconds;
}
