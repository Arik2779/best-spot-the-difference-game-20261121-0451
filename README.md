# Lantern Market — Spot the Difference

[![make.fun](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Arik2779/best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Arik2779/best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)

A complete, original spot-the-difference game that plays offline in a desktop
browser from static files. Two near-identical pictures, drawn procedurally on
canvas, sit side by side — find every difference by clicking it on either picture.

Bounty: https://make.fun/bounty/best-spot-the-difference-game-20261121-0451
Repo: Arik2779/best-spot-the-difference-game-20261121-0451

## How to play

- **Click / tap** a difference on either picture to mark it (gold ring + sparkle + chime).
- A wrong click costs **5 seconds** — never a hard fail.
- **H** — hint: briefly pulses one difference you haven't found yet (3 per level, 8 s cooldown).
- **R** — restart the round. **M** — mute. **1 / 2 / 3** — jump to a level. **P** — pause.
- Find all differences before the timer runs out to clear the round and earn a time bonus.
- Combos: consecutive finds without a wrong click pay +25 extra each.

## The three scenes

1. **Night Market Stall** — 8 differences, 2:30. Lanterns, candy jars, a stall cat, string lights.
2. **Harbour at Dusk** — 10 differences, 2:15. Lighthouse beam, sailboat, buoys, gulls.
3. **Botanical Garden** — 10 differences, 2:00. Glasshouse, fountain, flower beds, butterflies.

All art is original procedural canvas drawing; all sounds are tiny WebAudio synth
blips. No images, fonts, or scripts are loaded from the network — the game makes
zero network requests.

## Run it

Serve `game/` with any static server and open `game/index.html`, for example:

```sh
node serve.ts   # serves game/ on http://localhost:8080
```

Screenshot modes (reproducible frames): `?shot=start`, `?shot=play`, `?shot=end`
(with `&seed=1`).

## Hand in

`main.ts` (Node 22, stdlib only) copies `game/` and `screenshots/` to `/output` and
writes `/output/dossier.json` with `buildDossier` from `vendor/makefun-game.ts`:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## License

MIT — see LICENSE.
