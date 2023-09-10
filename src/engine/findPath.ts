export interface Point {
  x: number;
  y: number;
}

export interface Cell extends Point {
  g: number;
  h: number;
  f: number;
  parent?: Cell;
}

const fourDirections = [
  { x: 0, y: -1 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
  { x: 1, y: 0 },
];

export function findPath(
  isFree: (pos: Point) => boolean,
  start: Point,
  target: Point,
): { found: boolean; path?: Point[] } {
  // a-star, mostly implemented by copilot
  const open: Record<string, Cell> = {};
  const closed: Record<string, Cell> = {};
  if (!isFree(start) || !isFree(target)) return { found: false };
  open[`${start.x},${start.y}`] = {
    ...start,
    g: 0,
    h: hDist(start, target),
    f: hDist(start, target),
  };
  while (closed[`${target.x},${target.y}`] === undefined && Object.keys(open).length > 0) {
    const current = Object.values(open).reduce((a, b) => (a.f < b.f ? a : b));
    delete open[`${current.x},${current.y}`];
    closed[`${current.x},${current.y}`] = current;
    if (current.x === target.x && current.y === target.y) {
      break;
    }
    for (let i = 0; i < fourDirections.length; i++) {
      const { x, y } = fourDirections[i];
      const pos = { x: current.x + x, y: current.y + y };
      if (x === 0 && y === 0) continue;
      if (!isFree(pos)) continue;
      const g = current.g + (x === 0 || y === 0 ? 10 : 14);
      const h = hDist(pos, target);
      const f = g + h;
      const existingOpen = open[`${pos.x},${pos.y}`];
      const existingClosed = closed[`${pos.x},${pos.y}`];
      if (existingClosed === undefined && (existingOpen === undefined || existingOpen.f > f)) {
        open[`${pos.x},${pos.y}`] = {
          ...pos,
          g,
          h,
          f,
          parent: current,
        };
      }
    }
  }

  const found = closed[`${target.x},${target.y}`] !== undefined;
  let current = found
    ? closed[`${target.x},${target.y}`]
    : Object.values(closed).reduce((a, b) => (a.h < b.h ? a : b));

  const path: Point[] = [];
  while (current.parent !== undefined) {
    path.push(current);
    current = current.parent;
  }

  return { found, path: path.reverse() };
}

export function hDist(a: Point, b: Point) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}
