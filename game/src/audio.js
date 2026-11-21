// Tiny WebAudio synth: every sound is an oscillator envelope, no audio files.
// The context is created lazily on the first user gesture (browsers require that).
let ctx = null;
let muted = false;

function ensure() {
  if (ctx) return ctx;
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  } catch {
    return null;
  }
  return ctx;
}

function tone(freq, dur, type, gain, when = 0, slideTo = 0) {
  const ac = ensure();
  if (!ac || muted) return;
  if (ac.state === 'suspended') ac.resume().catch(() => {});
  const t0 = ac.currentTime + when;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

export const sfx = {
  unlock() {
    ensure();
  },
  setMuted(value) {
    muted = value;
  },
  isMuted() {
    return muted;
  },
  /** Pleasant two-note chime on a found difference. */
  found() {
    tone(880, 0.16, 'sine', 0.22);
    tone(1318, 0.28, 'sine', 0.2, 0.07);
  },
  /** Dull thud on a wrong click. */
  wrong() {
    tone(140, 0.18, 'triangle', 0.22, 0, 70);
  },
  /** Rising arpeggio when a round is complete. */
  win() {
    [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.24, 'sine', 0.2, i * 0.09));
  },
  /** Soft click for buttons. */
  click() {
    tone(660, 0.06, 'square', 0.08);
  },
  /** Short sparkle when a hint fires. */
  hint() {
    tone(1568, 0.12, 'sine', 0.14);
    tone(2093, 0.2, 'sine', 0.12, 0.08);
  },
  /** Low tick in the last ten seconds. */
  tick() {
    tone(440, 0.05, 'square', 0.06);
  },
};
