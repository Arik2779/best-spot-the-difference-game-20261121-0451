// Level definitions: name, time limit, and every planted difference.
// A difference is found by clicking any of its `spots` (scene coordinates, shared by both
// panels) on EITHER panel. `kind` describes how the right panel differs from the left.
export const LEVELS = [
  {
    id: 'market',
    name: 'Night Market Stall',
    sub: 'Level 1 · 8 differences · 2:30',
    seconds: 150,
    differences: [
      { id: 'lantern-missing', kind: 'removed', label: 'a hanging lantern', spots: [{ x: 306, y: 348, r: 28 }] },
      { id: 'sign-color', kind: 'recoloured', label: 'the paper sign', spots: [{ x: 306, y: 361, r: 34 }] },
      { id: 'cat-moved', kind: 'moved', label: 'the stall cat', spots: [{ x: 522, y: 556, r: 34 }, { x: 432, y: 424, r: 34 }] },
      { id: 'extra-apple', kind: 'added', label: 'an apple in the basket', spots: [{ x: 492, y: 428, r: 22 }] },
      { id: 'star-missing', kind: 'removed', label: 'a star by the moon', spots: [{ x: 118, y: 58, r: 16 }] },
      { id: 'awning-stripe', kind: 'recoloured', label: 'an awning stripe', spots: [{ x: 278, y: 278, r: 28 }] },
      { id: 'jar-lid', kind: 'recoloured', label: 'a candy-jar lid', spots: [{ x: 240, y: 378, r: 26 }] },
      { id: 'bulb-missing', kind: 'removed', label: 'a string-light bulb', spots: [{ x: 408, y: 203, r: 18 }] },
    ],
  },
  {
    id: 'harbour',
    name: 'Harbour at Dusk',
    sub: 'Level 2 · 10 differences · 2:15',
    seconds: 135,
    differences: [
      { id: 'gull-missing', kind: 'removed', label: 'a gull in the sky', spots: [{ x: 300, y: 92, r: 20 }] },
      { id: 'buoy-color', kind: 'recoloured', label: 'the red buoy', spots: [{ x: 180, y: 472, r: 24 }] },
      { id: 'boat-window', kind: 'removed', label: 'the sailboat cabin window', spots: [{ x: 396, y: 428, r: 22 }] },
      { id: 'beam-off', kind: 'removed', label: 'the lighthouse beam', spots: [{ x: 300, y: 238, r: 44 }] },
      { id: 'fish-added', kind: 'added', label: 'a jumping fish', spots: [{ x: 332, y: 424, r: 26 }] },
      { id: 'cloud-missing', kind: 'removed', label: 'a cloud', spots: [{ x: 320, y: 62, r: 34 }] },
      { id: 'crate-moved', kind: 'moved', label: 'a crate on the pier', spots: [{ x: 142, y: 520, r: 30 }, { x: 232, y: 520, r: 30 }] },
      { id: 'rope-coil', kind: 'removed', label: 'a coil of rope', spots: [{ x: 258, y: 548, r: 24 }] },
      { id: 'mast-flag', kind: 'removed', label: 'the mast flag', spots: [{ x: 398, y: 332, r: 18 }] },
      { id: 'sun-ray', kind: 'removed', label: 'the sun rays', spots: [{ x: 452, y: 122, r: 48 }] },
    ],
  },
  {
    id: 'garden',
    name: 'Botanical Garden',
    sub: 'Level 3 · 10 differences · 2:00',
    seconds: 120,
    differences: [
      { id: 'butterfly-missing', kind: 'removed', label: 'a butterfly', spots: [{ x: 200, y: 182, r: 20 }] },
      { id: 'sunflower-color', kind: 'recoloured', label: 'a sunflower', spots: [{ x: 448, y: 452, r: 26 }] },
      { id: 'fountain-drop', kind: 'removed', label: 'a fountain jet', spots: [{ x: 332, y: 402, r: 22 }] },
      { id: 'stone-missing', kind: 'removed', label: 'a stepping stone', spots: [{ x: 306, y: 562, r: 24 }] },
      { id: 'bench-pot', kind: 'added', label: 'a flower pot on the bench', spots: [{ x: 484, y: 470, r: 24 }] },
      { id: 'bee-added', kind: 'added', label: 'a bee by the flowers', spots: [{ x: 382, y: 302, r: 16 }] },
      { id: 'tree-apple', kind: 'removed', label: 'an apple on the tree', spots: [{ x: 96, y: 262, r: 18 }] },
      { id: 'can-missing', kind: 'removed', label: 'the watering can', spots: [{ x: 152, y: 546, r: 28 }] },
      { id: 'cloud-moved', kind: 'moved', label: 'a cloud', spots: [{ x: 454, y: 66, r: 34 }, { x: 334, y: 66, r: 34 }] },
      { id: 'tulip-missing', kind: 'removed', label: 'a tulip in the bed', spots: [{ x: 242, y: 522, r: 20 }] },
    ],
  },
];
