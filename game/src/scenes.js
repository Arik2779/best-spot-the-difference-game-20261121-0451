// Procedural scene painters. Each scene is drawn twice: once clean (left panel) and once
// with its level's differences applied (right panel). `diffs` is a Set of difference ids to
// apply; an empty set draws the base scene. All art is original canvas drawing — no images.
import { createRandom } from './random.js';

// ---------- small drawing helpers ----------
function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
function circle(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
}
function fillCircle(ctx, x, y, r, color) {
  circle(ctx, x, y, r);
  ctx.fillStyle = color;
  ctx.fill();
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
function cloud(ctx, x, y, s, color) {
  ctx.fillStyle = color;
  circle(ctx, x, y, 16 * s);
  circle(ctx, x + 18 * s, y - 6 * s, 20 * s);
  circle(ctx, x + 40 * s, y, 16 * s);
  ctx.fill();
  ctx.fillRect(x - 14 * s, y - 2 * s, 68 * s, 18 * s);
}
function lantern(ctx, x, y, s, body, glow) {
  ctx.strokeStyle = '#2a1a12';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y - 34 * s);
  ctx.lineTo(x, y - 18 * s);
  ctx.stroke();
  ctx.fillStyle = '#c9a227';
  ctx.fillRect(x - 7 * s, y - 20 * s, 14 * s, 5 * s);
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.ellipse(x, y, 16 * s, 20 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(60,20,10,0.55)';
  ctx.lineWidth = 1.5;
  for (const dy of [-12, -4, 4, 12]) {
    ctx.beginPath();
    ctx.ellipse(x, y + dy * s, 15 * s, 3.5 * s, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.fillStyle = '#c9a227';
  ctx.fillRect(x - 6 * s, y + 18 * s, 12 * s, 5 * s);
  if (glow) {
    const g = ctx.createRadialGradient(x, y, 4, x, y, 46 * s);
    g.addColorStop(0, 'rgba(255,190,90,0.35)');
    g.addColorStop(1, 'rgba(255,190,90,0)');
    ctx.fillStyle = g;
    circle(ctx, x, y, 46 * s);
    ctx.fill();
  }
}

// ===========================================================================
// LEVEL 1 — Night Market Stall
// ===========================================================================
export function drawMarket(ctx, W, H, diffs) {
  const has = (id) => diffs.has(id);
  // Dusk sky.
  const sky = ctx.createLinearGradient(0, 0, 0, 340);
  sky.addColorStop(0, '#241a4e');
  sky.addColorStop(0.55, '#6e3560');
  sky.addColorStop(1, '#d96a4a');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, 340);
  // Stars (seeded scatter, same both panels) plus one bright star by the moon:
  // that star is the difference — it is gone on the right panel.
  const rnd = createRandom(11);
  for (let i = 0; i < 46; i += 1) {
    const x = 20 + rnd() * (W - 40);
    const y = 14 + rnd() * 200;
    const r = 1 + rnd() * 1.8;
    star4(ctx, x, y, r, `rgba(255,244,200,${0.5 + rnd() * 0.5})`);
  }
  if (!has('star-missing')) star4(ctx, 118, 58, 4, '#fff4c8');
  // Moon.
  fillCircle(ctx, 486, 66, 34, '#ffe9b0');
  fillCircle(ctx, 474, 58, 7, '#e8c98a');
  fillCircle(ctx, 496, 78, 5, '#e8c98a');
  fillCircle(ctx, 490, 52, 4, '#e8c98a');
  // Distant rooftops.
  ctx.fillStyle = '#2c2140';
  ctx.beginPath();
  ctx.moveTo(0, 340);
  ctx.lineTo(0, 300);
  ctx.lineTo(70, 262);
  ctx.lineTo(150, 300);
  ctx.lineTo(230, 258);
  ctx.lineTo(320, 302);
  ctx.lineTo(410, 264);
  ctx.lineTo(500, 300);
  ctx.lineTo(570, 268);
  ctx.lineTo(612, 296);
  ctx.lineTo(612, 340);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#ffd166';
  for (const [wx, wy] of [[96, 296], [260, 290], [438, 292], [540, 300]]) {
    ctx.fillRect(wx, wy, 10, 12);
  }
  // Dark market backdrop + floor so the stall sits in a space, not a void.
  ctx.fillStyle = '#1d1535';
  ctx.fillRect(0, 340, W, 300);
  ctx.fillStyle = '#251b40';
  ctx.fillRect(0, 560, W, 80);
  ctx.strokeStyle = 'rgba(0,0,0,0.35)';
  ctx.lineWidth = 2;
  for (let y = 580; y < 640; y += 20) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }
  // String lights across the top.
  ctx.strokeStyle = '#1c1426';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 150);
  ctx.quadraticCurveTo(306, 215, 612, 150);
  ctx.stroke();
  for (let i = 0; i < 13; i += 1) {
    const t = i / 12;
    const x = t * 612;
    const y = 150 + Math.sin(t * Math.PI) * 52;
    if (has('bulb-missing') && i === 8) continue;
    const colors = ['#ffd166', '#ff8fa3', '#7ee081', '#8ecae6'];
    fillCircle(ctx, x, y + 8, 6, colors[i % 4]);
    fillCircle(ctx, x, y + 8, 2.5, 'rgba(255,255,255,0.85)');
  }
  // Awning: alternating stripes.
  const stripeW = 612 / 9;
  for (let i = 0; i < 9; i += 1) {
    let c = i % 2 === 0 ? '#c0392b' : '#f5efe2';
    if (has('awning-stripe') && i === 3) c = '#2a9d8f';
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.moveTo(40 + i * stripeW, 250);
    ctx.lineTo(40 + (i + 1) * stripeW, 250);
    ctx.lineTo(40 + (i + 1) * stripeW - 8, 306);
    ctx.lineTo(40 + i * stripeW - 8, 306);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillStyle = '#8e2f24';
  ctx.fillRect(32, 244, 548, 8);
  // Stall counter.
  ctx.fillStyle = '#7a4a2b';
  ctx.fillRect(48, 452, 516, 108);
  ctx.fillStyle = '#8d5a34';
  ctx.fillRect(48, 452, 516, 10);
  ctx.strokeStyle = 'rgba(40,20,8,0.5)';
  ctx.lineWidth = 2;
  for (let y = 486; y < 556; y += 26) {
    ctx.beginPath();
    ctx.moveTo(48, y);
    ctx.lineTo(564, y);
    ctx.stroke();
  }
  // Paper sign hanging under the awning.
  ctx.fillStyle = has('sign-color') ? '#2a9d8f' : '#c0392b';
  rr(ctx, 252, 330, 108, 62, 6);
  ctx.fill();
  ctx.strokeStyle = '#f5efe2';
  ctx.lineWidth = 2;
  rr(ctx, 256, 334, 100, 54, 4);
  ctx.stroke();
  ctx.fillStyle = '#fff8e6';
  ctx.font = 'bold 26px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('PASAR', 306, 356);
  ctx.font = '13px system-ui, sans-serif';
  ctx.fillText('★ malam ★', 306, 378);
  // Hanging lanterns under the awning.
  if (!has('lantern-missing')) lantern(ctx, 306, 348, 1, '#e4572e', true);
  lantern(ctx, 120, 348, 0.9, '#e4572e', true);
  lantern(ctx, 492, 348, 0.9, '#e4572e', true);
  // Candy jars on the counter.
  const jars = [
    { x: 140, candy: '#ff8fa3', lid: '#c9a227' },
    { x: 240, candy: '#7ee081', lid: has('jar-lid') ? '#2a9d8f' : '#c9a227' },
    { x: 340, candy: '#8ecae6', lid: '#c9a227' },
  ];
  for (const j of jars) {
    ctx.fillStyle = 'rgba(240,240,255,0.28)';
    rr(ctx, j.x - 26, 380, 52, 62, 8);
    ctx.fill();
    ctx.fillStyle = j.candy;
    for (let k = 0; k < 5; k += 1) fillCircle(ctx, j.x - 14 + k * 7, 428 - (k % 2) * 8, 6, j.candy);
    ctx.fillStyle = j.lid;
    rr(ctx, j.x - 28, 372, 56, 12, 4);
    ctx.fill();
  }
  // Fruit baskets on the counter.
  ctx.fillStyle = '#5d3a1e';
  ctx.beginPath();
  ctx.moveTo(72, 452);
  ctx.lineTo(168, 452);
  ctx.lineTo(156, 486);
  ctx.lineTo(84, 486);
  ctx.closePath();
  ctx.fill();
  for (let i = 0; i < 6; i += 1) {
    fillCircle(ctx, 88 + i * 14, 446 - (i % 2) * 8, 9, i % 2 ? '#f4842c' : '#f9a03f');
  }
  ctx.fillStyle = '#5d3a1e';
  ctx.beginPath();
  ctx.moveTo(444, 452);
  ctx.lineTo(540, 452);
  ctx.lineTo(528, 486);
  ctx.lineTo(456, 486);
  ctx.closePath();
  ctx.fill();
  for (let i = 0; i < 6; i += 1) {
    fillCircle(ctx, 460 + i * 14, 446 - (i % 2) * 8, 9, '#d62828');
    fillCircle(ctx, 460 + i * 14, 440 - (i % 2) * 8, 2.5, '#7ee081');
  }
  if (has('extra-apple')) {
    fillCircle(ctx, 492, 428, 10, '#d62828');
    fillCircle(ctx, 492, 421, 3, '#7ee081');
  }
  // Crates and the stall cat.
  ctx.fillStyle = '#9c6b30';
  ctx.fillRect(56, 560, 64, 56);
  ctx.fillRect(64, 516, 48, 44);
  ctx.strokeStyle = '#6b4423';
  ctx.lineWidth = 3;
  ctx.strokeRect(56, 560, 64, 56);
  ctx.strokeRect(64, 516, 48, 44);
  ctx.beginPath();
  ctx.moveTo(56, 560);
  ctx.lineTo(120, 616);
  ctx.moveTo(120, 560);
  ctx.lineTo(56, 616);
  ctx.stroke();
  const catAt = has('cat-moved') ? { x: 432, y: 424 } : { x: 522, y: 556 };
  drawCat(ctx, catAt.x, catAt.y);
  // Ground.
  ctx.fillStyle = '#241a33';
  ctx.fillRect(0, 616, W, 24);
  ctx.fillStyle = 'rgba(255,209,102,0.25)';
  for (let i = 0; i < 8; i += 1) ctx.fillRect(30 + i * 72, 624, 40, 3);
}

function drawCat(ctx, x, y) {
  ctx.fillStyle = '#3d3d5c';
  // Body (sitting).
  ctx.beginPath();
  ctx.ellipse(x, y, 20, 24, 0, 0, Math.PI * 2);
  ctx.fill();
  // Head.
  circle(ctx, x + 2, y - 26, 13);
  ctx.fill();
  // Ears.
  ctx.beginPath();
  ctx.moveTo(x - 8, y - 34);
  ctx.lineTo(x - 4, y - 46);
  ctx.lineTo(x + 1, y - 35);
  ctx.moveTo(x + 6, y - 35);
  ctx.lineTo(x + 12, y - 46);
  ctx.lineTo(x + 15, y - 33);
  ctx.fill();
  // Tail curled around.
  ctx.strokeStyle = '#3d3d5c';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(x + 14, y + 14, 14, -0.4, 1.4);
  ctx.stroke();
  // Eyes.
  ctx.fillStyle = '#ffd166';
  fillCircle(ctx, x - 2, y - 28, 2.2, '#ffd166');
  fillCircle(ctx, x + 7, y - 28, 2.2, '#ffd166');
}

// ===========================================================================
// LEVEL 2 — Harbour at Dusk
// ===========================================================================
export function drawHarbour(ctx, W, H, diffs) {
  const has = (id) => diffs.has(id);
  // Sunset sky.
  const sky = ctx.createLinearGradient(0, 0, 0, 400);
  sky.addColorStop(0, '#2e2458');
  sky.addColorStop(0.5, '#b5503f');
  sky.addColorStop(1, '#f2a65a');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, 400);
  // Sun with rays (rays are the difference).
  fillCircle(ctx, 452, 122, 42, '#ffdf8e');
  fillCircle(ctx, 452, 122, 30, '#ffe9b0');
  if (!has('sun-ray')) {
    ctx.strokeStyle = 'rgba(255,223,142,0.9)';
    ctx.lineWidth = 4;
    for (let i = 0; i < 8; i += 1) {
      const a = (i / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(452 + Math.cos(a) * 50, 122 + Math.sin(a) * 50);
      ctx.lineTo(452 + Math.cos(a) * 64, 122 + Math.sin(a) * 64);
      ctx.stroke();
    }
  }
  // Clouds.
  cloud(ctx, 120, 76, 1.1, 'rgba(255,220,190,0.85)');
  if (!has('cloud-missing')) cloud(ctx, 300, 60, 0.9, 'rgba(255,220,190,0.7)');
  cloud(ctx, 480, 200, 0.8, 'rgba(255,200,170,0.55)');
  // Gulls.
  drawGull(ctx, 210, 110);
  if (!has('gull-missing')) drawGull(ctx, 300, 92);
  drawGull(ctx, 380, 130);
  // Lighthouse.
  ctx.fillStyle = '#f5efe2';
  ctx.beginPath();
  ctx.moveTo(58, 400);
  ctx.lineTo(70, 190);
  ctx.lineTo(118, 190);
  ctx.lineTo(130, 400);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#c0392b';
  ctx.beginPath();
  ctx.moveTo(62, 330);
  ctx.lineTo(126, 330);
  ctx.lineTo(128, 290);
  ctx.lineTo(60, 290);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(67, 240);
  ctx.lineTo(121, 240);
  ctx.lineTo(122, 210);
  ctx.lineTo(66, 210);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#2c2350';
  ctx.fillRect(64, 168, 60, 24);
  ctx.fillStyle = '#ffd166';
  ctx.fillRect(72, 174, 44, 12);
  ctx.fillStyle = '#c0392b';
  ctx.beginPath();
  ctx.moveTo(60, 168);
  ctx.lineTo(94, 146);
  ctx.lineTo(128, 168);
  ctx.closePath();
  ctx.fill();
  // Beam (off on the right panel when the difference applies).
  if (!has('beam-off')) {
    const beam = ctx.createLinearGradient(94, 220, 460, 260);
    beam.addColorStop(0, 'rgba(255,233,176,0.55)');
    beam.addColorStop(1, 'rgba(255,233,176,0)');
    ctx.fillStyle = beam;
    ctx.beginPath();
    ctx.moveTo(94, 176);
    ctx.lineTo(460, 224);
    ctx.lineTo(460, 268);
    ctx.lineTo(94, 186);
    ctx.closePath();
    ctx.fill();
  }
  // Sea.
  const sea = ctx.createLinearGradient(0, 400, 0, 640);
  sea.addColorStop(0, '#2a6f7e');
  sea.addColorStop(1, '#123a4d');
  ctx.fillStyle = sea;
  ctx.fillRect(0, 400, W, 240);
  // Sun reflection shimmer.
  ctx.fillStyle = 'rgba(255,200,120,0.35)';
  for (let i = 0; i < 9; i += 1) {
    const y = 410 + i * 24;
    const w = 60 + (i % 3) * 22;
    ctx.fillRect(452 - w / 2, y, w, 5);
  }
  ctx.strokeStyle = 'rgba(255,255,255,0.18)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 6; i += 1) {
    const y = 430 + i * 34;
    ctx.beginPath();
    ctx.moveTo(20 + (i % 2) * 40, y);
    ctx.quadraticCurveTo(200, y + 8, 380, y);
    ctx.quadraticCurveTo(500, y - 6, 590, y + 4);
    ctx.stroke();
  }
  // Buoys.
  drawBuoy(ctx, 180, 472, has('buoy-color') ? '#ffd166' : '#d62828');
  drawBuoy(ctx, 520, 540, '#ffd166');
  // Sailboat.
  drawSailboat(ctx, 396, 436, has('boat-window'), has('mast-flag'));
  // Rowboat.
  ctx.fillStyle = '#8d5a34';
  ctx.beginPath();
  ctx.moveTo(210, 500);
  ctx.lineTo(300, 500);
  ctx.lineTo(286, 522);
  ctx.lineTo(224, 522);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#5d3a1e';
  ctx.fillRect(228, 494, 54, 6);
  // Jumping fish (added on the right panel).
  if (has('fish-added')) {
    ctx.strokeStyle = '#8ecae6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(332, 448, 26, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
    ctx.fillStyle = '#cfe8ff';
    ctx.beginPath();
    ctx.ellipse(332, 424, 12, 6, -0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(322, 420);
    ctx.lineTo(312, 412);
    ctx.lineTo(314, 426);
    ctx.closePath();
    ctx.fill();
  }
  // Pier with crates and rope.
  ctx.fillStyle = '#6b4423';
  ctx.fillRect(0, 520, 300, 16);
  ctx.fillStyle = '#8d5a34';
  for (let x = 0; x < 300; x += 30) ctx.fillRect(x, 520, 26, 16);
  ctx.fillStyle = '#5d3a1e';
  ctx.fillRect(20, 536, 10, 60);
  ctx.fillRect(150, 536, 10, 60);
  ctx.fillRect(280, 536, 10, 60);
  const crateAt = has('crate-moved') ? 232 : 142;
  ctx.fillStyle = '#9c6b30';
  ctx.fillRect(crateAt - 22, 500, 44, 40);
  ctx.strokeStyle = '#6b4423';
  ctx.lineWidth = 2;
  ctx.strokeRect(crateAt - 22, 500, 44, 40);
  ctx.beginPath();
  ctx.moveTo(crateAt - 22, 500);
  ctx.lineTo(crateAt + 22, 540);
  ctx.moveTo(crateAt + 22, 500);
  ctx.lineTo(crateAt - 22, 540);
  ctx.stroke();
  if (!has('rope-coil')) {
    ctx.strokeStyle = '#d9c08a';
    ctx.lineWidth = 4;
    circle(ctx, 258, 548, 12);
    ctx.stroke();
    circle(ctx, 258, 548, 6);
    ctx.stroke();
  }
}

function drawGull(ctx, x, y) {
  ctx.strokeStyle = '#2c2140';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(x - 12, y);
  ctx.quadraticCurveTo(x - 5, y - 8, x, y);
  ctx.quadraticCurveTo(x + 5, y - 8, x + 12, y);
  ctx.stroke();
}
function drawBuoy(ctx, x, y, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x - 14, y);
  ctx.lineTo(x + 14, y);
  ctx.lineTo(x + 9, y + 16);
  ctx.lineTo(x - 9, y + 16);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#f5efe2';
  ctx.fillRect(x - 12, y + 4, 24, 5);
  ctx.fillStyle = '#2c2350';
  ctx.fillRect(x - 2, y - 14, 4, 14);
  fillCircle(ctx, x, y - 16, 3, '#ffd166');
}
function drawSailboat(ctx, x, y, showWindow, showFlag) {
  // Mast + flag.
  ctx.strokeStyle = '#5d3a1e';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x, y - 110);
  ctx.lineTo(x, y);
  ctx.stroke();
  if (showFlag) {
    ctx.fillStyle = '#d62828';
    ctx.beginPath();
    ctx.moveTo(x, y - 110);
    ctx.lineTo(x + 26, y - 102);
    ctx.lineTo(x, y - 94);
    ctx.closePath();
    ctx.fill();
  }
  // Sail.
  ctx.fillStyle = '#f5efe2';
  ctx.beginPath();
  ctx.moveTo(x + 4, y - 104);
  ctx.lineTo(x + 4, y - 14);
  ctx.lineTo(x + 62, y - 14);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'rgba(60,40,20,0.35)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x + 4, y - 104);
  ctx.lineTo(x + 4, y - 14);
  ctx.lineTo(x + 62, y - 14);
  ctx.closePath();
  ctx.stroke();
  // Hull + cabin.
  ctx.fillStyle = '#7a4a2b';
  ctx.beginPath();
  ctx.moveTo(x - 44, y);
  ctx.lineTo(x + 66, y);
  ctx.lineTo(x + 48, y + 22);
  ctx.lineTo(x - 28, y + 22);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#f5efe2';
  ctx.fillRect(x - 18, y - 16, 36, 16);
  if (showWindow) {
    fillCircle(ctx, x, y - 8, 5, '#2c6f7e');
  }
}

// ===========================================================================
// LEVEL 3 — Botanical Garden
// ===========================================================================
export function drawGarden(ctx, W, H, diffs) {
  const has = (id) => diffs.has(id);
  // Bright sky.
  const sky = ctx.createLinearGradient(0, 0, 0, 360);
  sky.addColorStop(0, '#8ecae6');
  sky.addColorStop(1, '#d8f3dc');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, 360);
  // Sun.
  fillCircle(ctx, 520, 84, 36, '#ffd166');
  fillCircle(ctx, 520, 84, 26, '#ffe9b0');
  // Clouds (one moves on the right panel).
  const cloudX = has('cloud-moved') ? 300 : 420;
  cloud(ctx, cloudX, 66, 1, 'rgba(255,255,255,0.95)');
  cloud(ctx, 110, 110, 0.8, 'rgba(255,255,255,0.85)');
  // Big trees framing the scene.
  drawTree(ctx, 84, 300, 1.15, has('tree-apple'));
  drawTree(ctx, 536, 310, 1.0, false);
  // Glasshouse.
  ctx.fillStyle = 'rgba(180,220,235,0.55)';
  ctx.beginPath();
  ctx.moveTo(170, 420);
  ctx.lineTo(170, 280);
  ctx.quadraticCurveTo(306, 180, 442, 280);
  ctx.lineTo(442, 420);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#5a7d5a';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(170, 420);
  ctx.lineTo(170, 280);
  ctx.quadraticCurveTo(306, 180, 442, 280);
  ctx.lineTo(442, 420);
  ctx.closePath();
  ctx.stroke();
  ctx.lineWidth = 2;
  for (const x of [226, 282, 338, 394]) {
    ctx.beginPath();
    ctx.moveTo(x, 420);
    ctx.lineTo(x, 250 + Math.abs(x - 306) * 0.35);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(170, 340);
  ctx.lineTo(442, 340);
  ctx.stroke();
  // Door.
  ctx.fillStyle = '#5a7d5a';
  rr(ctx, 282, 340, 48, 80, 6);
  ctx.fill();
  ctx.fillStyle = '#8ecae6';
  rr(ctx, 288, 348, 36, 64, 4);
  ctx.fill();
  // Plants inside the glasshouse.
  for (let i = 0; i < 5; i += 1) {
    const x = 196 + i * 56;
    ctx.strokeStyle = '#2d6a4f';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, 420);
    ctx.lineTo(x, 392);
    ctx.stroke();
    fillCircle(ctx, x, 386, 8, ['#ff8fa3', '#ffd166', '#b5179e', '#ff8fa3', '#ffd166'][i]);
  }
  // Butterflies.
  drawButterfly(ctx, 140, 240, '#b5179e');
  if (!has('butterfly-missing')) drawButterfly(ctx, 200, 182, '#ff8fa3');
  drawButterfly(ctx, 470, 220, '#4361ee');
  // Bee (added on the right panel).
  if (has('bee-added')) drawBee(ctx, 382, 302);
  drawBee(ctx, 250, 260);
  // Lawn.
  ctx.fillStyle = '#74c69d';
  ctx.fillRect(0, 420, W, 220);
  ctx.fillStyle = '#52b788';
  ctx.fillRect(0, 420, W, 10);
  // Fountain.
  ctx.fillStyle = '#b7b7a4';
  ctx.beginPath();
  ctx.ellipse(306, 452, 62, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#8ecae6';
  ctx.beginPath();
  ctx.ellipse(306, 450, 52, 11, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#b7b7a4';
  ctx.fillRect(300, 412, 12, 38);
  ctx.fillStyle = '#8ecae6';
  ctx.beginPath();
  ctx.arc(306, 412, 8, Math.PI, 0);
  ctx.fill();
  // Water jets: left, middle, right — the right one is the difference.
  drawJet(ctx, 282, 404);
  drawJet(ctx, 306, 396);
  if (!has('fountain-drop')) drawJet(ctx, 332, 402);
  // Path of stepping stones.
  const stones = [[306, 500], [282, 528], [330, 528], [306, 562], [280, 592], [332, 592]];
  for (const [sx, sy] of stones) {
    if (has('stone-missing') && sx === 306 && sy === 562) continue;
    ctx.fillStyle = '#d9d9d9';
    ctx.beginPath();
    ctx.ellipse(sx, sy, 22, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#b0b0b0';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  // Sunflower bed.
  for (let i = 0; i < 6; i += 1) {
    const x = 380 + i * 34;
    const y = 452 + (i % 2) * 10;
    const petal = has('sunflower-color') && i === 2 ? '#b5179e' : '#ffd166';
    drawSunflower(ctx, x, y, petal);
  }
  // Tulip bed.
  for (let i = 0; i < 8; i += 1) {
    const x = 92 + i * 30;
    if (has('tulip-missing') && i === 5) continue;
    drawTulip(ctx, x, 522, ['#ff8fa3', '#d62828', '#ffd166', '#b5179e'][i % 4]);
  }
  // Bench with a flower pot (added on the right panel).
  ctx.fillStyle = '#7a4a2b';
  ctx.fillRect(446, 486, 92, 10);
  ctx.fillRect(446, 508, 92, 8);
  ctx.fillStyle = '#5d3a1e';
  ctx.fillRect(452, 496, 8, 44);
  ctx.fillRect(524, 496, 8, 44);
  if (has('bench-pot')) {
    ctx.fillStyle = '#c0392b';
    ctx.beginPath();
    ctx.moveTo(468, 486);
    ctx.lineTo(500, 486);
    ctx.lineTo(496, 468);
    ctx.lineTo(472, 468);
    ctx.closePath();
    ctx.fill();
    fillCircle(ctx, 484, 460, 8, '#ff8fa3');
    fillCircle(ctx, 476, 464, 6, '#ffd166');
    fillCircle(ctx, 492, 464, 6, '#ff8fa3');
  }
  // Watering can (missing on the right panel).
  if (!has('can-missing')) {
    ctx.fillStyle = '#2a9d8f';
    rr(ctx, 132, 530, 44, 30, 6);
    ctx.fill();
    ctx.strokeStyle = '#2a9d8f';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(132, 540);
    ctx.quadraticCurveTo(112, 536, 108, 516);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(176, 538);
    ctx.quadraticCurveTo(196, 538, 196, 522);
    ctx.stroke();
    fillCircle(ctx, 106, 512, 4, '#8ecae6');
    fillCircle(ctx, 100, 520, 3, '#8ecae6');
  }
}

function drawTree(ctx, x, baseY, s, withApple) {
  ctx.fillStyle = '#6b4423';
  ctx.fillRect(x - 10 * s, baseY - 90 * s, 20 * s, 90 * s);
  ctx.fillStyle = '#40916c';
  circle(ctx, x, baseY - 110 * s, 52 * s);
  ctx.fill();
  circle(ctx, x - 38 * s, baseY - 84 * s, 34 * s);
  ctx.fill();
  circle(ctx, x + 38 * s, baseY - 84 * s, 34 * s);
  ctx.fill();
  ctx.fillStyle = '#52b788';
  circle(ctx, x - 16 * s, baseY - 128 * s, 26 * s);
  ctx.fill();
  circle(ctx, x + 20 * s, baseY - 122 * s, 22 * s);
  ctx.fill();
  if (withApple) {
    fillCircle(ctx, x + 12, baseY - 38, 7, '#d62828');
    fillCircle(ctx, x + 12, baseY - 45, 2.5, '#7ee081');
  }
}
function drawButterfly(ctx, x, y, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x - 8, y - 4, 9, 6, -0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(x + 8, y - 4, 9, 6, 0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(x - 7, y + 6, 7, 5, 0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(x + 7, y + 6, 7, 5, -0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#2c2140';
  ctx.fillRect(x - 1.5, y - 8, 3, 16);
}
function drawBee(ctx, x, y) {
  ctx.fillStyle = '#ffd166';
  ctx.beginPath();
  ctx.ellipse(x, y, 8, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#2c2140';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x - 3, y - 5);
  ctx.lineTo(x - 3, y + 5);
  ctx.moveTo(x + 3, y - 5);
  ctx.lineTo(x + 3, y + 5);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.8)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(x - 2, y - 8, 5, 3, -0.4, 0, Math.PI * 2);
  ctx.stroke();
}
function drawJet(ctx, x, y) {
  ctx.strokeStyle = '#8ecae6';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x, y + 10);
  ctx.quadraticCurveTo(x - 12, y - 8, x - 20, y - 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y + 10);
  ctx.quadraticCurveTo(x + 12, y - 8, x + 20, y - 2);
  ctx.stroke();
  fillCircle(ctx, x - 20, y - 2, 2.5, '#caf0f8');
  fillCircle(ctx, x + 20, y - 2, 2.5, '#caf0f8');
}
function drawSunflower(ctx, x, y, petal) {
  ctx.strokeStyle = '#2d6a4f';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x, y + 30);
  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.fillStyle = petal;
  for (let i = 0; i < 8; i += 1) {
    const a = (i / 8) * Math.PI * 2;
    ctx.beginPath();
    ctx.ellipse(x + Math.cos(a) * 13, y + Math.sin(a) * 13, 8, 4, a, 0, Math.PI * 2);
    ctx.fill();
  }
  fillCircle(ctx, x, y, 8, '#6b4423');
}
function drawTulip(ctx, x, y, color) {
  ctx.strokeStyle = '#2d6a4f';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x, y + 22);
  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x - 8, y);
  ctx.quadraticCurveTo(x - 9, y - 16, x, y - 12);
  ctx.quadraticCurveTo(x + 9, y - 16, x + 8, y);
  ctx.quadraticCurveTo(x, y + 4, x - 8, y);
  ctx.fill();
}
