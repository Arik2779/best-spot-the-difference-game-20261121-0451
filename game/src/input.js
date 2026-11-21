// Keyboard + mouse/touch input. Converts a canvas click to scene coordinates and
// reports which panel was hit; keyboard actions are queued and taken by main.js.
import { PANEL, VIEW } from './config.js';

export const ACTION_CONFIRM = 1;
export const ACTION_HINT = 2;
export const ACTION_RESTART = 4;
export const ACTION_MUTE = 8;
export const ACTION_LEVEL_1 = 16;
export const ACTION_LEVEL_2 = 32;
export const ACTION_LEVEL_3 = 64;
export const ACTION_PAUSE = 128;

const KEY_ACTIONS = {
  ' ': ACTION_CONFIRM,
  Enter: ACTION_CONFIRM,
  h: ACTION_HINT,
  H: ACTION_HINT,
  r: ACTION_RESTART,
  R: ACTION_RESTART,
  m: ACTION_MUTE,
  M: ACTION_MUTE,
  1: ACTION_LEVEL_1,
  2: ACTION_LEVEL_2,
  3: ACTION_LEVEL_3,
  p: ACTION_PAUSE,
  P: ACTION_PAUSE,
  Escape: ACTION_PAUSE,
};

export function createInput(canvas, onClick) {
  let actions = 0;

  function toScene(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * VIEW.width;
    const y = ((clientY - rect.top) / rect.height) * VIEW.height;
    for (let panel = 0; panel < 2; panel += 1) {
      const px = PANEL.left + panel * (PANEL.w + PANEL.gap);
      if (x >= px && x < px + PANEL.w && y >= PANEL.top && y < PANEL.top + PANEL.h) {
        return { x: x - px, y: y - PANEL.top, panel };
      }
    }
    return null;
  }

  canvas.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    const hit = toScene(event.clientX, event.clientY);
    if (hit) onClick(hit.x, hit.y, hit.panel);
    else actions |= ACTION_CONFIRM;
  });
  window.addEventListener('keydown', (event) => {
    const action = KEY_ACTIONS[event.key];
    if (action) {
      event.preventDefault();
      actions |= action;
    }
  });

  return {
    takeActions() {
      const taken = actions;
      actions = 0;
      return taken;
    },
    /** HUD buttons are drawn on the canvas; this maps a click to a named button. */
    buttonAt(clientX, clientY) {
      const rect = canvas.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * VIEW.width;
      const y = ((clientY - rect.top) / rect.height) * VIEW.height;
      return { x, y };
    },
  };
}
