import { TileMap } from "../engine/tilemap.ts";

export function generateLevel(tilemap: TileMap) {
  for (let y = 0; y < tilemap.height; y++) {
    for (let x = 0; x < tilemap.width; x++) {
      tilemap.setTile(x, y, 16 * 1 + 7);
    }
  }

  for (let i = 0; i < 50; i++) {
    const x = (Math.random() * tilemap.width) | 0;
    const y = (Math.random() * tilemap.height) | 0;
    tilemap.setTile(x, y, (16 * 1 + 8 + Math.random() * 4) | 0);
  }
}
