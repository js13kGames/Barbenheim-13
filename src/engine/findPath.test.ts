import { describe, expect, it } from "vitest";
import { TileMap } from "./tilemap.ts";
import { findPath, Point } from "./findPath.ts";

describe("pathfinding", () => {
  it("should find a path", () => {
    const map = new TileMap(5, 5);
    const isFree = (p: Point) => map.getTile(p.x, p.y) === 0;
    const path = findPath(isFree, { x: 0, y: 0 }, { x: 4, y: 4 });
    expect(path).toBeDefined();
  });

  it("should find a path around obstacle", () => {
    const map = new TileMap(5, 5);
    map.setTile(2, 2, 1);
    const isFree = (p: Point) => map.getTile(p.x, p.y) === 0;
    const path = findPath(isFree, { x: 0, y: 2 }, { x: 4, y: 2 });
    expect(path).toBeDefined();
  });

  it("should not find a path", () => {
    const map = new TileMap(5, 5);
    const isFree = (p: Point) => (p.x === 0 && p.y === 0) || map.getTile(p.x, p.y) === 0;
    map.setTile(0, 1, 1);
    map.setTile(1, 0, 1);
    const path = findPath(isFree, { x: 0, y: 0 }, { x: 4, y: 4 });
    expect(path).toBeUndefined();
  });
});
