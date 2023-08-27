export class TileMap {
  constructor(
    public width: number,
    public height: number,
    public tiles: number[] = [],
  ) {}
  getTile(x: number, y: number) {
    return this.tiles[x + y * this.width];
  }
  setTile(x: number, y: number, tile: number) {
    this.tiles[x + y * this.width] = tile;
  }
}
