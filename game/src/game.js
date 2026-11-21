// Game state: screens, levels, scoring, timer, hints, found markers and sparkles.
// Pure logic — no canvas calls here; render.js paints this state.
import { LEVELS } from './levels.js';
import { HINTS, SCORE, SCREEN, STEP } from './config.js';
import { drawMarket, drawHarbour, drawGarden } from './scenes.js';
import { sfx } from './audio.js';

const PAINTERS = [drawMarket, drawHarbour, drawGarden];

export function createGame() {
  const state = {
    screen: SCREEN.TITLE,
    levelIndex: 0,
    score: 0,
    best: 0,
    found: new Set(),
    timeLeft: LEVELS[0].seconds,
    combo: 0,
    hintsLeft: HINTS.perLevel,
    hintCooldown: 0,
    hintTarget: null, // difference id currently highlighted
    hintTime: 0,
    message: '',
    messageTime: 0,
    roundBonus: 0,
    totalFound: 0,
    wrongClicks: 0,
    sparkles: [], // {x, y, panel, t} scene coords + which panel (0 left, 1 right)
    rings: [], // {x, y, panel, t} expanding ring on a wrong click
    muted: false,
    lastTickSecond: -1,
    leftCanvas: null,
    rightCanvas: null,
  };

  function level() {
    return LEVELS[state.levelIndex];
  }
  function diffSet() {
    return new Set(level().differences.map((d) => d.id));
  }
  function paintPanels() {
    const painter = PAINTERS[state.levelIndex];
    const left = document.createElement('canvas');
    left.width = 612;
    left.height = 640;
    painter(left.getContext('2d'), 612, 640, new Set());
    const right = document.createElement('canvas');
    right.width = 612;
    right.height = 640;
    painter(right.getContext('2d'), 612, 640, diffSet());
    state.leftCanvas = left;
    state.rightCanvas = right;
  }

  function startLevel(index) {
    state.levelIndex = index;
    state.found = new Set();
    state.timeLeft = LEVELS[index].seconds;
    state.combo = 0;
    state.hintsLeft = HINTS.perLevel;
    state.hintCooldown = 0;
    state.hintTarget = null;
    state.sparkles = [];
    state.rings = [];
    state.lastTickSecond = -1;
    paintPanels();
    state.screen = SCREEN.PLAY;
    setMessage(`${LEVELS[index].name} — find ${LEVELS[index].differences.length} differences!`);
  }

  function setMessage(text) {
    state.message = text;
    state.messageTime = 3;
  }

  function startGame() {
    state.score = 0;
    state.totalFound = 0;
    state.wrongClicks = 0;
    startLevel(0);
  }

  function roundComplete() {
    const bonus = Math.round(state.timeLeft) * SCORE.timeBonusPerSecond;
    state.roundBonus = bonus;
    state.score += bonus;
    sfx.win();
    state.screen = SCREEN.ROUND;
  }

  function gameOver() {
    if (state.score > state.best) state.best = state.score;
    state.screen = SCREEN.OVER;
  }

  function winGame() {
    if (state.score > state.best) state.best = state.score;
    state.screen = SCREEN.WIN;
  }

  function nextLevel() {
    if (state.levelIndex + 1 >= LEVELS.length) winGame();
    else startLevel(state.levelIndex + 1);
  }

  /** A click at scene coords (x, y) on panel `panel` (0 left, 1 right). */
  function clickAt(x, y, panel) {
    if (state.screen !== SCREEN.PLAY) return;
    for (const d of level().differences) {
      if (state.found.has(d.id)) continue;
      for (const s of d.spots) {
        const dx = x - s.x;
        const dy = y - s.y;
        if (dx * dx + dy * dy <= (s.r + 8) * (s.r + 8)) {
          state.found.add(d.id);
          state.totalFound += 1;
          state.combo += 1;
          const gained = SCORE.find + (state.combo - 1) * SCORE.comboStep;
          state.score += gained;
          sfx.found();
          // Sparkle burst on BOTH panels at the found spot.
          for (const p of [0, 1]) {
            for (const s2 of d.spots) state.sparkles.push({ x: s2.x, y: s2.y, panel: p, t: 0 });
          }
          setMessage(`Found ${d.label}! +${gained}${state.combo > 1 ? ` (combo x${state.combo})` : ''}`);
          if (state.found.size === level().differences.length) roundComplete();
          return;
        }
      }
    }
    // Wrong click: time penalty, never a hard fail.
    state.combo = 0;
    state.wrongClicks += 1;
    state.timeLeft = Math.max(0, state.timeLeft - SCORE.wrongTimePenalty);
    state.rings.push({ x, y, panel, t: 0 });
    sfx.wrong();
    setMessage(`Not there — minus ${SCORE.wrongTimePenalty}s!`);
  }

  function useHint() {
    if (state.screen !== SCREEN.PLAY) return;
    if (state.hintsLeft <= 0) {
      setMessage('No hints left!');
      return;
    }
    if (state.hintCooldown > 0) {
      setMessage(`Hint recharging… ${Math.ceil(state.hintCooldown)}s`);
      return;
    }
    const remaining = level().differences.filter((d) => !state.found.has(d.id));
    if (remaining.length === 0) return;
    const target = remaining[Math.floor(Math.random() * remaining.length)];
    state.hintsLeft -= 1;
    state.hintCooldown = HINTS.cooldownSeconds;
    state.hintTarget = target.id;
    state.hintTime = HINTS.showSeconds;
    sfx.hint();
    setMessage(`Hint: look near ${target.label}…`);
  }

  function toggleMute() {
    state.muted = !state.muted;
    sfx.setMuted(state.muted);
    setMessage(state.muted ? 'Sound off (M to turn on)' : 'Sound on');
  }

  function step(dt) {
    if (state.screen === SCREEN.PLAY) {
      state.timeLeft -= dt;
      const whole = Math.ceil(state.timeLeft);
      if (whole <= 10 && whole !== state.lastTickSecond && whole > 0) {
        state.lastTickSecond = whole;
        sfx.tick();
      }
      if (state.timeLeft <= 0) {
        state.timeLeft = 0;
        gameOver();
      }
    }
    if (state.hintCooldown > 0) state.hintCooldown -= dt;
    if (state.hintTime > 0) {
      state.hintTime -= dt;
      if (state.hintTime <= 0) state.hintTarget = null;
    }
    if (state.messageTime > 0) state.messageTime -= dt;
    for (const s of state.sparkles) s.t += dt;
    state.sparkles = state.sparkles.filter((s) => s.t < 0.9);
    for (const r of state.rings) r.t += dt;
    state.rings = state.rings.filter((r) => r.t < 0.6);
  }

  // Paint the title backdrop once so the title screen shows the scene.
  paintPanels();

  return {
    state,
    level,
    startGame,
    startLevel,
    nextLevel,
    clickAt,
    useHint,
    toggleMute,
    setMessage,
    step,
    STEP,
  };
}
