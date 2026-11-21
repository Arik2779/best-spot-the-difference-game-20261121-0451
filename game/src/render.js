// Renderer: paints the whole 1280x800 view — HUD, both panels, found markers,
// hint pulse, sparkles, footer and the screen overlays. No game logic here.
import { FONT, FOOTER, HUD, PANEL, PALETTE, SCREEN, VIEW } from './config.js';
import { LEVELS as LEVEL_DEFS } from './levels.js';

const PANEL_X = [PANEL.left, PANEL.left + PANEL.w + PANEL.gap];

/** HUD button rects in view coordinates (shared with main.js for clicks). */
export const BUTTONS = {
  hint: { x: 1010, y: 12, w: 120, h: 40 },
  mute: { x: 1140, y: 12, w: 56, h: 40 },
  restart: { x: 1206, y: 12, w: 56, h: 40 },
};

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
function star4(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.quadraticCurveTo(x, y, x, y + r);
  ctx.quadraticCurveTo(x, y, x - r, y);
  ctx.quadraticCurveTo(x, y, x, y - r);
  ctx.fill();
}
function fmtTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export function createRenderer(canvas) {
  const ctx = canvas.getContext('2d');

  function drawButton(rect, label, enabled) {
    ctx.fillStyle = enabled ? PALETTE.button : '#241d3d';
    rr(ctx, rect.x, rect.y, rect.w, rect.h, 8);
    ctx.fill();
    ctx.strokeStyle = PALETTE.buttonEdge;
    ctx.lineWidth = 1.5;
    rr(ctx, rect.x, rect.y, rect.w, rect.h, 8);
    ctx.stroke();
    ctx.fillStyle = enabled ? PALETTE.text : PALETTE.muted;
    ctx.font = `bold 16px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, rect.x + rect.w / 2, rect.y + rect.h / 2 + 1);
  }

  function drawHud(state) {
    const level = LEVEL_DEFS[state.levelIndex];
    ctx.fillStyle = PALETTE.hud;
    ctx.fillRect(0, 0, VIEW.width, HUD.height);
    ctx.fillStyle = PALETTE.hudEdge;
    ctx.fillRect(0, HUD.height, VIEW.width, 2);
    // Level name.
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = PALETTE.text;
    ctx.font = `bold 24px ${FONT}`;
    ctx.fillText(level.name, 20, 30);
    ctx.fillStyle = PALETTE.muted;
    ctx.font = `15px ${FONT}`;
    ctx.fillText(`Level ${state.levelIndex + 1} of ${LEVEL_DEFS.length}`, 20, 52);
    // Remaining counter — big and central.
    const remaining = level.differences.length - state.found.size;
    ctx.textAlign = 'center';
    ctx.fillStyle = remaining === 0 ? PALETTE.good : PALETTE.accent;
    ctx.font = `bold 30px ${FONT}`;
    ctx.fillText(`${remaining} LEFT`, 500, 34);
    ctx.fillStyle = PALETTE.muted;
    ctx.font = `15px ${FONT}`;
    ctx.fillText(`found ${state.found.size} / ${level.differences.length}`, 500, 54);
    // Score.
    ctx.textAlign = 'right';
    ctx.fillStyle = PALETTE.text;
    ctx.font = `bold 22px ${FONT}`;
    ctx.fillText(`Score ${state.score}`, 980, 30);
    ctx.fillStyle = PALETTE.muted;
    ctx.font = `15px ${FONT}`;
    ctx.fillText(`Best ${state.best}`, 980, 52);
    // Buttons.
    const inPlay = state.screen === SCREEN.PLAY;
    drawButton(BUTTONS.hint, `Hint (${state.hintsLeft})`, inPlay && state.hintsLeft > 0);
    drawButton(BUTTONS.mute, state.muted ? 'Muted' : 'Sound', true);
    drawButton(BUTTONS.restart, '↻', true);
    // Timer bar under the HUD: time pressure you can feel.
    const frac = Math.max(0, state.timeLeft / level.seconds);
    const barColor = frac > 0.5 ? PALETTE.timerFull : frac > 0.25 ? PALETTE.timerMid : PALETTE.timerLow;
    ctx.fillStyle = '#241d3d';
    ctx.fillRect(0, HUD.height + 2, VIEW.width, 8);
    ctx.fillStyle = barColor;
    ctx.fillRect(0, HUD.height + 2, VIEW.width * frac, 8);
    ctx.fillStyle = barColor;
    ctx.font = `bold 15px ${FONT}`;
    ctx.textAlign = 'right';
    ctx.fillText(fmtTime(state.timeLeft), VIEW.width - 14, HUD.height + 26);
  }

  function drawPanels(state, now) {
    const level = LEVEL_DEFS[state.levelIndex];
    for (let panel = 0; panel < 2; panel += 1) {
      const x = PANEL_X[panel];
      ctx.fillStyle = '#000';
      ctx.fillRect(x - 3, PANEL.top - 3, PANEL.w + 6, PANEL.h + 6);
      const src = panel === 0 ? state.leftCanvas : state.rightCanvas;
      if (src) ctx.drawImage(src, x, PANEL.top);
      ctx.strokeStyle = PALETTE.panelEdge;
      ctx.lineWidth = 3;
      ctx.strokeRect(x, PANEL.top, PANEL.w, PANEL.h);
      // Panel labels.
      ctx.fillStyle = 'rgba(20,16,31,0.85)';
      rr(ctx, x + 10, PANEL.top + 10, 52, 26, 6);
      ctx.fill();
      ctx.fillStyle = PALETTE.text;
      ctx.font = `bold 15px ${FONT}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(panel === 0 ? 'LEFT' : 'RIGHT', x + 36, PANEL.top + 24);
    }
    // Found markers on BOTH panels.
    for (const d of level.differences) {
      if (!state.found.has(d.id)) continue;
      for (const s of d.spots) {
        for (let panel = 0; panel < 2; panel += 1) {
          const cx = PANEL_X[panel] + s.x;
          const cy = PANEL.top + s.y;
          ctx.strokeStyle = '#ffd166';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(cx, cy, s.r + 4, 0, Math.PI * 2);
          ctx.stroke();
          ctx.strokeStyle = 'rgba(255,209,102,0.35)';
          ctx.lineWidth = 8;
          ctx.beginPath();
          ctx.arc(cx, cy, s.r + 8, 0, Math.PI * 2);
          ctx.stroke();
          // Check mark.
          ctx.strokeStyle = '#7ee081';
          ctx.lineWidth = 4;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(cx - 8, cy);
          ctx.lineTo(cx - 2, cy + 7);
          ctx.lineTo(cx + 9, cy - 7);
          ctx.stroke();
          ctx.lineCap = 'butt';
        }
      }
    }
    // Hint pulse on one unfound difference.
    if (state.hintTarget) {
      const d = level.differences.find((dd) => dd.id === state.hintTarget);
      if (d) {
        const pulse = 1 + 0.18 * Math.sin(now / 160);
        for (const s of d.spots) {
          for (let panel = 0; panel < 2; panel += 1) {
            const cx = PANEL_X[panel] + s.x;
            const cy = PANEL.top + s.y;
            ctx.strokeStyle = '#7ee081';
            ctx.lineWidth = 3;
            ctx.setLineDash([8, 6]);
            ctx.beginPath();
            ctx.arc(cx, cy, (s.r + 6) * pulse, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
          }
        }
      }
    }
    // Sparkle bursts on fresh finds.
    for (const sp of state.sparkles) {
      const a = 1 - sp.t / 0.9;
      const cx = PANEL_X[sp.panel] + sp.x;
      const cy = PANEL.top + sp.y;
      star4(ctx, cx - 14, cy - 10, 7 * a + 2, `rgba(255,209,102,${a})`);
      star4(ctx, cx + 12, cy - 14, 6 * a + 2, `rgba(255,255,255,${a})`);
      star4(ctx, cx + 4, cy + 12, 8 * a + 2, `rgba(126,224,129,${a})`);
    }
    // Wrong-click rings.
    for (const r of state.rings) {
      const a = 1 - r.t / 0.6;
      const cx = PANEL_X[r.panel] + r.x;
      const cy = PANEL.top + r.y;
      ctx.strokeStyle = `rgba(255,107,107,${a})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, 10 + r.t * 60, 0, Math.PI * 2);
      ctx.stroke();
      ctx.font = `bold 18px ${FONT}`;
      ctx.fillStyle = `rgba(255,107,107,${a})`;
      ctx.textAlign = 'center';
      ctx.fillText('✕', cx, cy - 18);
    }
  }

  function drawFooter(state) {
    ctx.fillStyle = PALETTE.hud;
    ctx.fillRect(0, FOOTER.top, VIEW.width, FOOTER.height);
    ctx.fillStyle = PALETTE.hudEdge;
    ctx.fillRect(0, FOOTER.top, VIEW.width, 2);
    // Level dots.
    for (let i = 0; i < LEVEL_DEFS.length; i += 1) {
      const cx = 640 + (i - 1) * 30;
      ctx.fillStyle = i < state.levelIndex ? PALETTE.good : i === state.levelIndex ? PALETTE.accent : '#3a2f5e';
      ctx.beginPath();
      ctx.arc(cx, FOOTER.top + 18, 7, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = PALETTE.muted;
    ctx.font = `15px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.fillText('Click a difference on either picture · H hint · R restart · M mute · 1/2/3 level', 640, FOOTER.top + 44);
    // Transient message.
    if (state.messageTime > 0 && state.message) {
      ctx.fillStyle = PALETTE.text;
      ctx.font = `bold 17px ${FONT}`;
      ctx.textAlign = 'left';
      ctx.fillText(state.message, 20, FOOTER.top + 36);
    }
  }

  function dim() {
    ctx.fillStyle = 'rgba(12,9,22,0.72)';
    ctx.fillRect(0, 0, VIEW.width, VIEW.height);
  }
  function overlayTitle(text, sub, lines, accent) {
    ctx.textAlign = 'center';
    ctx.fillStyle = accent;
    ctx.font = `bold 64px ${FONT}`;
    ctx.fillText(text, 640, 300);
    ctx.fillStyle = PALETTE.text;
    ctx.font = `28px ${FONT}`;
    ctx.fillText(sub, 640, 348);
    ctx.fillStyle = PALETTE.muted;
    ctx.font = `19px ${FONT}`;
    let y = 400;
    for (const line of lines) {
      ctx.fillText(line, 640, y);
      y += 30;
    }
  }

  function draw(state, now) {
    ctx.fillStyle = PALETTE.backdrop;
    ctx.fillRect(0, 0, VIEW.width, VIEW.height);
    drawHud(state);
    drawPanels(state, now);
    drawFooter(state);
    if (state.screen === SCREEN.TITLE) {
      dim();
      overlayTitle('LANTERN MARKET', 'Spot the Difference', [
        'Two pictures, side by side — almost the same.',
        'Find every difference: click it on either picture.',
        `3 scenes · ${LEVEL_DEFS.reduce((n, l) => n + l.differences.length, 0)} differences to hunt · wrong clicks cost 5 seconds`,
        '',
        'Click or press Space to start',
        state.best > 0 ? `Best score: ${state.best}` : 'First hunt starts at the night market…',
      ], PALETTE.accent);
    } else if (state.screen === SCREEN.ROUND) {
      dim();
      const level = LEVEL_DEFS[state.levelIndex];
      overlayTitle('ROUND COMPLETE!', `${level.name} — all ${level.differences.length} differences found`, [
        `Time bonus: +${state.roundBonus}  ·  Score: ${state.score}`,
        '',
        state.levelIndex + 1 < LEVEL_DEFS.length
          ? `Next: ${LEVEL_DEFS[state.levelIndex + 1].name} — harder, busier, less time`
          : 'That was the last scene…',
        '',
        'Press Space for the next level',
      ], PALETTE.good);
    } else if (state.screen === SCREEN.WIN) {
      dim();
      overlayTitle('YOU FOUND THEM ALL!', `Every difference in all ${LEVEL_DEFS.length} scenes`, [
        `Final score: ${state.score}  ·  Best: ${state.best}`,
        `Total found: ${state.totalFound}  ·  Wrong clicks: ${state.wrongClicks}`,
        '',
        'Press Space to hunt again',
      ], PALETTE.accent);
    } else if (state.screen === SCREEN.OVER) {
      dim();
      overlayTitle("TIME'S UP!", `${LEVEL_DEFS[state.levelIndex].name} — ${LEVEL_DEFS[state.levelIndex].differences.length - state.found.size} differences still hiding`, [
        `Score: ${state.score}  ·  Best: ${state.best}`,
        '',
        'Press R to retry this level · Space to start over',
      ], PALETTE.bad);
    } else if (state.screen === SCREEN.PAUSED) {
      dim();
      overlayTitle('PAUSED', 'Take a breath, detective', ['Press P or Space to keep hunting'], PALETTE.muted);
    }
  }

  return { draw };
}
