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
): Point[] | undefined {
  // a-star, mostly implemented by copilot
  const open: Record<string, Cell> = {};
  const closed: Record<string, Cell> = {};
  if (!isFree(start) || !isFree(target)) return undefined;
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
    for (let i = 0; i < fourDirections.length; i++) {
      const pos = { x: current.x + fourDirections[i].x, y: current.y + fourDirections[i].y };
      const { x, y } = fourDirections[i];
      if (x === 0 && y === 0) continue;
      if (!isFree(pos)) continue;
      const g = current.g + (x === 0 || y === 0 ? 10 : 14);
      const h = hDist(pos, target);
      const f = g + h;
      const existing = open[`${pos.x},${pos.y}`];
      if (existing === undefined || existing.f > f) {
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
  if (closed[`${target.x},${target.y}`] === undefined) return undefined;
  const path: Point[] = [];
  let current = closed[`${target.x},${target.y}`];
  while (current.parent !== undefined) {
    path.push(current);
    current = current.parent;
  }
  return path.reverse();
}

function hDist(a: Point, b: Point) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}
