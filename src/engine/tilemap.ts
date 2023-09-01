export class TileMap {
  tiles: number[];
  constructor(
    public width: number,
    public height: number,
  ) {
    this.tiles = new Array(this.width * this.height).fill(0);
  }
  getTile(x: number, y: number) {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) return -1;
    return this.tiles[x + y * this.width];
  }
  setTile(x: number, y: number, tile: number) {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) return;
    this.tiles[x + y * this.width] = tile;
  }

  fill(number: number) {
    this.tiles.fill(number);
  }
}
