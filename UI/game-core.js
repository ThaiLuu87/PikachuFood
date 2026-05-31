/* Pikachu Food — pure game logic (no DOM). Shared by the browser game and Node tests.
 *
 * Board model: grid[r][c] = type string | null(empty).  r in 0..rows-1, c in 0..cols-1.
 * Border ring: coordinates with r===-1 || r===rows || c===-1 || c===cols are always
 * passable (classic Pikachu "route around the outside" rule).
 */
(function (root) {
  'use strict';

  function inBorder(rows, cols, r, c) {
    return r === -1 || r === rows || c === -1 || c === cols;
  }

  // A coordinate is passable for a path's *intermediate* cells if it is on the border
  // ring, or inside the grid and empty. Endpoints are handled by the caller.
  function passable(grid, rows, cols, r, c) {
    if (r < -1 || r > rows || c < -1 || c > cols) return false;
    if (inBorder(rows, cols, r, c)) return true;
    return grid[r][c] === null;
  }

  // Inclusive list of integer cells along one axis-aligned segment. null if diagonal.
  function segmentCells(r1, c1, r2, c2) {
    const cells = [];
    if (r1 === r2) {
      const step = c2 >= c1 ? 1 : -1;
      for (let c = c1; ; c += step) { cells.push([r1, c]); if (c === c2) break; }
    } else if (c1 === c2) {
      const step = r2 >= r1 ? 1 : -1;
      for (let r = r1; ; r += step) { cells.push([r, c1]); if (r === r2) break; }
    } else {
      return null;
    }
    return cells;
  }

  // Every cell of the polyline (except endpoints a,b) must be passable.
  function pathClear(grid, rows, cols, pts, a, b) {
    const seen = new Set();
    const all = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const seg = segmentCells(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1]);
      if (!seg) return false;
      for (const cell of seg) {
        const k = cell[0] + ',' + cell[1];
        if (!seen.has(k)) { seen.add(k); all.push(cell); }
      }
    }
    for (const [r, c] of all) {
      if ((r === a.r && c === a.c) || (r === b.r && c === b.c)) continue;
      if (!passable(grid, rows, cols, r, c)) return false;
    }
    return true;
  }

  function dedupePoints(pts) {
    const out = [];
    for (const p of pts) {
      const last = out[out.length - 1];
      if (!last || last[0] !== p[0] || last[1] !== p[1]) out.push(p);
    }
    return out.map(([r, c]) => ({ r, c }));
  }

  // Find a connecting polyline with <=2 turns (<=3 segments) between a and b.
  // Returns array of {r,c} corner points (2..4) or null. Pure geometry — does NOT
  // check that a and b share a type (the caller does that).
  function findPath(grid, rows, cols, a, b) {
    if (a.r === b.r && a.c === b.c) return null;
    // Horizontal rail at row R: a -> (R,a.c) -> (R,b.c) -> b. Covers 0/1/2-turn paths.
    for (let R = -1; R <= rows; R++) {
      const pts = [[a.r, a.c], [R, a.c], [R, b.c], [b.r, b.c]];
      if (pathClear(grid, rows, cols, pts, a, b)) return dedupePoints(pts);
    }
    // Vertical rail at col C: a -> (a.r,C) -> (b.r,C) -> b.
    for (let C = -1; C <= cols; C++) {
      const pts = [[a.r, a.c], [a.r, C], [b.r, C], [b.r, b.c]];
      if (pathClear(grid, rows, cols, pts, a, b)) return dedupePoints(pts);
    }
    return null;
  }

  // Dual gravity: every remaining tile falls along dir.dy (down=+1/up=-1) then slides
  // along dir.dx (right=+1/left=-1). dir defaults to down+right. Returns a new grid.
  function applyGravity(grid, rows, cols, dir) {
    const dy = (dir && dir.dy < 0) ? -1 : 1;
    const dx = (dir && dir.dx < 0) ? -1 : 1;
    const g = grid.map(row => row.slice());
    for (let c = 0; c < cols; c++) {
      const stack = [];
      for (let r = 0; r < rows; r++) if (g[r][c] != null) stack.push(g[r][c]);
      for (let r = 0; r < rows; r++) g[r][c] = null;
      if (dy === 1) { let rr = rows - 1; for (let i = stack.length - 1; i >= 0; i--) g[rr--][c] = stack[i]; }
      else { let rr = 0; for (let i = 0; i < stack.length; i++) g[rr++][c] = stack[i]; }
    }
    for (let r = 0; r < rows; r++) {
      const items = [];
      for (let c = 0; c < cols; c++) if (g[r][c] != null) items.push(g[r][c]);
      for (let c = 0; c < cols; c++) g[r][c] = null;
      if (dx === 1) { let cc = cols - 1; for (let i = items.length - 1; i >= 0; i--) g[r][cc--] = items[i]; }
      else { let cc = 0; for (let i = 0; i < items.length; i++) g[r][cc++] = items[i]; }
    }
    return g;
  }

  // Collect matchable positions by type, skipping frozen cells (frozen[r][c] truthy).
  function matchableByType(grid, rows, cols, frozen) {
    const byType = new Map();
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const t = grid[r][c];
      if (t == null) continue;
      if (frozen && frozen[r] && frozen[r][c]) continue;
      if (!byType.has(t)) byType.set(t, []);
      byType.get(t).push({ r, c });
    }
    return byType;
  }

  // True if at least one connectable same-type pair exists (i.e. not a deadlock).
  // Frozen cells (optional) are excluded as match candidates.
  function hasAnyMove(grid, rows, cols, frozen) {
    for (const list of matchableByType(grid, rows, cols, frozen).values()) {
      for (let i = 0; i < list.length; i++)
        for (let j = i + 1; j < list.length; j++)
          if (findPath(grid, rows, cols, list[i], list[j])) return true;
    }
    return false;
  }

  // Return one connectable pair [a, b] or null (used by Hint). Skips frozen cells.
  function findHint(grid, rows, cols, frozen) {
    for (const list of matchableByType(grid, rows, cols, frozen).values()) {
      for (let i = 0; i < list.length; i++)
        for (let j = i + 1; j < list.length; j++)
          if (findPath(grid, rows, cols, list[i], list[j])) return [list[i], list[j]];
    }
    return null;
  }

  function shuffleArray(arr, rand) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      const t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }

  // Generate a full board: rows*cols (even) cells, pairs distributed across `types`
  // as evenly as possible (so every type count is even), arranged so at least one
  // move exists. rand() in [0,1).
  function generateBoard(rows, cols, types, rand) {
    rand = rand || Math.random;
    const N = rows * cols;
    if (N % 2 !== 0) throw new Error('rows*cols must be even');
    const flat = [];
    for (let p = 0; p < N / 2; p++) {
      const t = types[p % types.length];
      flat.push(t, t);
    }
    for (let attempt = 0; attempt < 200; attempt++) {
      shuffleArray(flat, rand);
      const g = [];
      let k = 0;
      for (let r = 0; r < rows; r++) {
        const row = [];
        for (let c = 0; c < cols; c++) row.push(flat[k++]);
        g.push(row);
      }
      if (hasAnyMove(g, rows, cols)) return g;
    }
    // Extremely unlikely fallback: return last arrangement anyway.
    const g = [];
    let k = 0;
    for (let r = 0; r < rows; r++) {
      const row = [];
      for (let c = 0; c < cols; c++) row.push(flat[k++]);
      g.push(row);
    }
    return g;
  }

  // Reshuffle the remaining tiles among their current filled positions (empties stay
  // empty), keeping at least one move. Returns a new grid.
  function shuffle(grid, rows, cols, rand) {
    rand = rand || Math.random;
    const positions = [];
    const tiles = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      if (grid[r][c] != null) { positions.push([r, c]); tiles.push(grid[r][c]); }
    }
    for (let attempt = 0; attempt < 200; attempt++) {
      shuffleArray(tiles, rand);
      const g = grid.map(row => row.map(() => null));
      for (let i = 0; i < positions.length; i++) g[positions[i][0]][positions[i][1]] = tiles[i];
      if (positions.length === 0 || hasAnyMove(g, rows, cols)) return g;
    }
    const g = grid.map(row => row.map(() => null));
    for (let i = 0; i < positions.length; i++) g[positions[i][0]][positions[i][1]] = tiles[i];
    return g;
  }

  const api = { passable, findPath, applyGravity, hasAnyMove, findHint, generateBoard, shuffle };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.GameCore = api;
})(typeof window !== 'undefined' ? window : globalThis);
