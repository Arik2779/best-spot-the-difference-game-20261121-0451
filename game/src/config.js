// Every tuning number and colour in one place. The play area is a fixed 1280x800 logical
// canvas; the renderer scales it to the window, so no rule depends on the screen size.
export const VIEW = { width: 1280, height: 800 };

// Two scene panels, side by side, in scene coordinates (each panel is PANEL.w x PANEL.h).
export const PANEL = { w: 612, h: 640, gap: 16, top: 76, left: 20 };
export const HUD = { height: 64 };
export const FOOTER = { top: 728, height: 60 };

/** Fixed simulation step, seconds. */
export const STEP = 1 / 60;

export const SCORE = {
  find: 100,
  comboStep: 25,
  timeBonusPerSecond: 10,
  wrongTimePenalty: 5,
};

export const HINTS = { perLevel: 3, cooldownSeconds: 8, showSeconds: 2.5 };

export const PALETTE = {
  backdrop: '#14101f',
  hud: '#1d1730',
  hudEdge: '#3a2f5e',
  panelEdge: '#4a3f73',
  text: '#f5efe2',
  muted: '#b9aecf',
  accent: '#ffd166',
  good: '#7ee081',
  bad: '#ff6b6b',
  timerFull: '#7ee081',
  timerMid: '#ffd166',
  timerLow: '#ff6b6b',
  button: '#2c2350',
  buttonEdge: '#5a4a8f',
};

export const FONT = 'system-ui, -apple-system, "Segoe UI", sans-serif';

/** Where the best score is kept between visits (this browser only). */
export const BEST_KEY = 'lantern-market.best';

/** Screens the game moves between. */
export const SCREEN = {
  TITLE: 'title',
  PLAY: 'play',
  ROUND: 'round',
  WIN: 'win',
  OVER: 'over',
  PAUSED: 'paused',
};
