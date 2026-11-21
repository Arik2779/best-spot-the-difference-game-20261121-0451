// Boot and the one loop: input is read every frame, the world advances in fixed 1/60 s
// steps, and the renderer paints what is there. The game moves between six screens:
// title, play, paused, round complete, win and game over.
//
// ?seed=N is accepted (decorative scatter is seeded inside the scenes).
// ?shot=start|play|end (with &seed=N) stages that scene instead of running the loop,
// paints it twice and sets window.__shotReady for a screenshot.
import { BEST_KEY, STEP } from './config.js';
import { createGame } from './game.js';
import { createRenderer, BUTTONS } from './render.js';
import { createInput, ACTION_CONFIRM, ACTION_HINT, ACTION_LEVEL_1, ACTION_LEVEL_2, ACTION_LEVEL_3, ACTION_MUTE, ACTION_PAUSE, ACTION_RESTART } from './input.js';
import { stageShot } from './shots.js';
import { sfx } from './audio.js';
import { SCREEN } from './config.js';

const MAX_FRAME = 0.25;

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');

const canvas = document.getElementById('game');
// Fixed logical size: the renderer draws in 1280x800 view coordinates, so the
// backing store must match — otherwise the browser downscales then upscales the
// whole frame and everything blurs.
canvas.width = 1280;
canvas.height = 800;
const status = document.getElementById('status');
const game = createGame();
const { state } = game;
window.__game = game; // debug/test hook: lets a play-test read the live state.
const renderer = createRenderer(canvas);

function readBest() {
  try {
    return Number.parseInt(window.localStorage.getItem(BEST_KEY) ?? '0', 10) || 0;
  } catch {
    return 0;
  }
}
function saveBest(value) {
  try {
    window.localStorage.setItem(BEST_KEY, String(value));
  } catch {
    // Storage can be off (private windows): the best score then lasts this visit only.
  }
}
state.best = readBest();

function announce(message) {
  status.textContent = message;
}

function runShot(name) {
  stageShot(name, game);
  let painted = 0;
  function paint() {
    renderer.draw(state, performance.now());
    painted += 1;
    if (painted < 2) requestAnimationFrame(paint);
    else window.__shotReady = true;
  }
  requestAnimationFrame(paint);
}

function runGame() {
  const input = createInput(canvas, (x, y, panel) => game.clickAt(x, y, panel));

  // HUD buttons (Hint / Sound / Restart) are drawn on the canvas: check them first.
  canvas.addEventListener('pointerdown', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 1280;
    const y = ((event.clientY - rect.top) / rect.height) * 800;
    const inside = (b) => x >= b.x && x < b.x + b.w && y >= b.y && y < b.y + b.h;
    if (inside(BUTTONS.hint)) {
      sfx.unlock();
      game.useHint();
    } else if (inside(BUTTONS.mute)) {
      sfx.unlock();
      game.toggleMute();
    } else if (inside(BUTTONS.restart)) {
      sfx.unlock();
      sfx.click();
      if (state.screen === SCREEN.PLAY || state.screen === SCREEN.OVER) game.startLevel(state.levelIndex);
      else game.startGame();
      announce('Restarted.');
    }
  });

  function handleActions() {
    const actions = input.takeActions();
    if (actions & ACTION_CONFIRM) {
      sfx.unlock();
      if (state.screen === SCREEN.TITLE || state.screen === SCREEN.OVER || state.screen === SCREEN.WIN) {
        game.startGame();
        announce('Playing. Find the differences!');
      } else if (state.screen === SCREEN.ROUND) {
        game.nextLevel();
        announce('Next level.');
      } else if (state.screen === SCREEN.PAUSED) {
        state.screen = SCREEN.PLAY;
        announce('Playing.');
      }
    }
    if (actions & ACTION_HINT) game.useHint();
    if (actions & ACTION_MUTE) game.toggleMute();
    if (actions & ACTION_RESTART) {
      if (state.screen === SCREEN.PLAY || state.screen === SCREEN.OVER) game.startLevel(state.levelIndex);
      else game.startGame();
      announce('Restarted.');
    }
    if (actions & ACTION_LEVEL_1) game.startLevel(0);
    if (actions & ACTION_LEVEL_2) game.startLevel(1);
    if (actions & ACTION_LEVEL_3) game.startLevel(2);
    if (actions & ACTION_PAUSE) {
      if (state.screen === SCREEN.PLAY) {
        state.screen = SCREEN.PAUSED;
        announce('Paused.');
      } else if (state.screen === SCREEN.PAUSED) {
        state.screen = SCREEN.PLAY;
        announce('Playing.');
      }
    }
    if (state.screen === SCREEN.OVER || state.screen === SCREEN.WIN) {
      if (state.score > state.best) {
        state.best = state.score;
        saveBest(state.best);
      }
    }
  }

  let accumulator = 0;
  let last = performance.now();
  function frame(now) {
    requestAnimationFrame(frame);
    accumulator += Math.min((now - last) / 1000, MAX_FRAME);
    last = now;
    handleActions();
    while (accumulator >= STEP) {
      game.step(STEP);
      accumulator -= STEP;
    }
    renderer.draw(state, now);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && state.screen === SCREEN.PLAY) {
      state.screen = SCREEN.PAUSED;
      announce('Paused.');
    }
  });

  announce('Lantern Market — Spot the Difference. Press Space or click to start.');
  requestAnimationFrame(frame);
}

if (shot) runShot(shot);
else runGame();
