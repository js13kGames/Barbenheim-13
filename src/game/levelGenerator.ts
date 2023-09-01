import { TileMap } from "../engine/tilemap.ts";
import { Ecs } from "../engine/Ecs.ts";
import { Point } from "../engine/findPath.ts";
import { SpriteComponent } from "./components.ts";

export function generateLevel(tilemap: TileMap) {
  for (let y = 0; y < tilemap.height; y++) {
    for (let x = 0; x < tilemap.width; x++) {
      tilemap.setTile(x, y, 16 * 1 + 7);
    }
  }

  for (let i = 0; i < 50; i++) {
    const x = (Math.random() * tilemap.width) | 0;
    const y = (Math.random() * tilemap.height) | 0;
    let tile = (16 * 1 + 8 + Math.random() * 5) | 0;
    if (tile === 16 * 1 + 10) tile = 16 * 3 + 4;
    tilemap.setTile(x, y, tile);
  }
}

export function isFreeTile(ecs: Ecs, tilemap: TileMap, p: Point) {
  return (
    p.x >= 0 &&
    p.y >= 0 &&
    p.x < 30 &&
    p.y < 16 &&
    tilemap.getTile(p.x, p.y) === 16 * 1 + 7 &&
    !findSprite(ecs, p.x, p.y)
  );
}

export function findSprite(ecs: Ecs, x: number, y: number) {
  let sprite = ecs.getComponentsByType<SpriteComponent>("sprite").find((sprite) => {
    return ((sprite.x / 16) | 0) === (x | 0) && ((sprite.y / 16) | 0) === (y | 0);
  });
  return sprite;
}
