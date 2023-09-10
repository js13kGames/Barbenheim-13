import { TileMap } from "../engine/tilemap.ts";
import { Ecs } from "../engine/Ecs.ts";
import { Point } from "../engine/findPath.ts";
import { SpriteComponent } from "./components.ts";
import { spriteNames } from "./sprites.ts";
import { Random } from "../engine/random.ts";

function fillMap(tilemap: TileMap, tile: number) {
  for (let y = 0; y < tilemap.height; y++) {
    for (let x = 0; x < tilemap.width; x++) {
      tilemap.setTile(x, y, tile);
    }
  }
}

function createRiver(tilemap: TileMap, rnd: Random) {
  let x1 = tilemap.width / 2;
  let x2 = x1 + 1;
  for (let y = 0; y < tilemap.height; y++) {
    if (x2 <= x1 + 1) {
      x2 = x1 + 2;
    }
    for (let x = x1; x < x2; x++) {
      tilemap.setTile(x | 0, y, spriteNames.water);
    }
    if (rnd.next() > 0.5) {
      x1 += rnd.next() < 0.5 ? -1 : 1;
    }
    if (rnd.next() > 0.5) {
      x2 += rnd.next() < 0.5 ? -1 : 1;
    }
  }
}

function createBridge(tilemap: TileMap, rnd: Random) {
  let y = 0.25 * tilemap.height + rnd.inext() * tilemap.height * 0.5;
  for (let x = 0; x < tilemap.width; x++) {
    tilemap.setTile(x, y | 0, spriteNames.road);
    if (rnd.next() > 0.75) {
      y += rnd.next() < 0.5 ? -1 : 1;
    }
  }
}

function createTerrain(tilemap: TileMap, _rnd: Random) {
  for (let y = 0; y < tilemap.height; y++) {
    for (let x = 0; x < tilemap.width; x++) {
      const tile = 16 + 7;
      tilemap.setTile(x, y, tile | 0);
    }
  }
}

export function generateLevel(tilemap: TileMap, objmap: TileMap) {
  const rnd = new Random(2);
  fillMap(tilemap, spriteNames.grass);
  fillMap(objmap, -1);
  createTerrain(tilemap, rnd);

  for (let i = 0; i < 30; i++) {
    const x = rnd.inext(tilemap.width);
    const y = rnd.inext(tilemap.height);
    if (i % 2 === 0) {
      objmap.setTile(x | 0, y | 0, spriteNames.mountain);
    } else {
      objmap.setTile(x | 0, y | 0, spriteNames.tree);
    }
  }

  for (let i = 0; i < 7; i++) {
    const x = rnd.inext(tilemap.width);
    const y = rnd.inext(tilemap.height);
    objmap.setTile(x | 0, y | 0, spriteNames.castle);
  }

  createRiver(tilemap, rnd);
  createBridge(tilemap, rnd);
}

export function isFreeTile(ecs: Ecs, tilemap: TileMap, objmap: TileMap, p: Point) {
  if (p.x < 0 && p.y >= 0 && p.x < 30 && p.y < 16) return false;
  const tile = tilemap.getTile(p.x, p.y);
  const obj = objmap.getTile(p.x, p.y);
  if (obj !== -1) return false;
  return (tile === 16 * 1 + 7 || tile === 16 * 1 + 8) && !findSprite(ecs, p.x, p.y);
}

export function findSprite(ecs: Ecs, x: number, y: number) {
  let sprite = ecs.getComponentsByType<SpriteComponent>("sprite").find((sprite) => {
    return ((sprite.x / 16) | 0) === (x | 0) && ((sprite.y / 16) | 0) === (y | 0);
  });
  return sprite;
}
