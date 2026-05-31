const test = require('node:test');
const assert = require('node:assert');
const core = require('./game-core.js');

// helper: build grid from array of strings. '.' = empty(null), other char = type
function G(rows) {
  return rows.map(r => r.split('').map(ch => (ch === '.' ? null : ch)));
}
const P = (r, c) => ({ r, c });

test('findPath: straight horizontal, adjacent tiles', () => {
  const g = G(['AA']); // 1x2
  assert.ok(core.findPath(g, 1, 2, P(0, 0), P(0, 1)));
});

test('findPath: straight horizontal across an empty gap', () => {
  const g = G(['A.A']); // 1x3
  assert.ok(core.findPath(g, 1, 3, P(0, 0), P(0, 2)));
});

test('findPath: straight vertical across an empty gap', () => {
  const g = G(['A', '.', 'A']); // 3x1
  assert.ok(core.findPath(g, 3, 1, P(0, 0), P(2, 0)));
});

test('findPath: blocked straight line routes around via the outer border', () => {
  const g = G(['ABA']); // 1x3, B blocks the direct line
  // must go up out of the grid, across the top border ring, and back down
  assert.ok(core.findPath(g, 1, 3, P(0, 0), P(0, 2)));
});

test('findPath: one-turn L-shape through empty corner', () => {
  // A at (0,0) and (2,2); corner (0,2) empty, column/row clear
  const g = G([
    'A.',
    '..',
    '.A',
  ]); // 3x2 -> cols=2
  // reshape: use 3x3 for a clean L
  const g2 = G([
    'A..',
    '...',
    '..A',
  ]);
  assert.ok(core.findPath(g2, 3, 3, P(0, 0), P(2, 2)));
});

test('findPath: returns null when no path of <=2 turns exists (fully packed diagonal)', () => {
  const g = G([
    'CACC',
    'CCCC',
    'CCAC',
    'CCCC',
  ]); // 4x4 fully packed; the two A are diagonal and boxed in
  assert.strictEqual(core.findPath(g, 4, 4, P(0, 1), P(2, 2)), null);
});

test('findPath: returns null for the same cell', () => {
  const g = G(['AA']);
  assert.strictEqual(core.findPath(g, 1, 2, P(0, 0), P(0, 0)), null);
});

test('applyGravity: tiles fall down then pack right (down+right)', () => {
  const g = G([
    'A..',
    '..B',
  ]); // 2x3
  const out = core.applyGravity(g, 2, 3);
  assert.deepStrictEqual(out, G([
    '...',
    '.AB',
  ]));
});

test('applyGravity: single row packs to the right', () => {
  const g = G(['A.B']);
  const out = core.applyGravity(g, 1, 3);
  assert.deepStrictEqual(out, G(['.AB']));
});

test('hasAnyMove: true when a connectable same-type pair exists', () => {
  const g = G([
    'AA',
    'BB',
  ]);
  assert.strictEqual(core.hasAnyMove(g, 2, 2), true);
});

test('hasAnyMove: false on a checkerboard deadlock (no connectable pair)', () => {
  const g = G([
    'AB',
    'BA',
  ]); // packed; like-tiles only diagonal and boxed in
  assert.strictEqual(core.hasAnyMove(g, 2, 2), false);
});

// seeded RNG so generation tests are deterministic
function lcg(seed) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

function counts(grid) {
  const m = new Map();
  for (const row of grid) for (const t of row) if (t != null) m.set(t, (m.get(t) || 0) + 1);
  return m;
}

test('generateBoard: fills every cell, even count per type, and has a move', () => {
  const rows = 12, cols = 16, types = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x'];
  const g = core.generateBoard(rows, cols, types, lcg(42));
  assert.strictEqual(g.length, rows);
  assert.strictEqual(g[0].length, cols);
  let filled = 0;
  for (const row of g) for (const t of row) { assert.ok(t != null, 'no empty cells at start'); filled++; }
  assert.strictEqual(filled, rows * cols);
  for (const [, n] of counts(g)) assert.strictEqual(n % 2, 0, 'each type appears an even number of times');
  assert.strictEqual(core.hasAnyMove(g, rows, cols), true);
});

test('shuffle: preserves the tile multiset and the filled positions, keeps a move', () => {
  // a partly-cleared board
  const g = G([
    'ab.c',
    '.dd.',
    'caab',
  ]); // 3x4
  const before = counts(g);
  const filledBefore = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) if (g[r][c] != null) filledBefore.push(r + ',' + c);
  const out = core.shuffle(g, 3, 4, lcg(7));
  const after = counts(out);
  assert.deepStrictEqual([...after.entries()].sort(), [...before.entries()].sort());
  const filledAfter = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) if (out[r][c] != null) filledAfter.push(r + ',' + c);
  assert.deepStrictEqual(filledAfter.sort(), filledBefore.sort());
  assert.strictEqual(core.hasAnyMove(out, 3, 4), true);
});
