import { Ecs, Entity } from "../engine/Ecs.ts";
import { TileMap } from "../engine/tilemap.ts";

export interface Cursor {
  x: number;
  y: number;
}

export class Game {
  t = 0;
  ecs = new Ecs();
  activePlayer: Entity | null = null;
  cursor = { x: 0, y: 0 };
  queue: any[] = [];
  tilemap: TileMap | null = null;
  side: "player" | "foe" = "player";

  init() {
    const ecs = this.ecs;

    const player = ecs.createEntity();
    ecs.addComponents(
      player,
      { type: "player", moved: false },
      { type: "sprite", x: 3 * 16, y: 3 * 16, sprite: 16 * 3 },
    );

    const player2 = ecs.createEntity();
    ecs.addComponents(
      player2,
      { type: "player", moved: false },
      { type: "sprite", x: 2 * 16, y: 5 * 16, sprite: 16 * 3 },
    );

    const player3 = ecs.createEntity();
    ecs.addComponents(
      player3,
      { type: "player", moved: false },
      { type: "sprite", x: 2 * 16, y: 10 * 16, sprite: 16 * 4 + 2 },
    );

    const foe = ecs.createEntity();
    ecs.addComponents(
      foe,
      { type: "foe", moved: false },
      { type: "sprite", x: 20 * 16, y: 10 * 16, sprite: 16 * 5 + 1 },
    );

    const foe2 = ecs.createEntity();
    ecs.addComponents(
      foe2,
      { type: "foe", moved: false },
      { type: "sprite", x: 21 * 16, y: 12 * 16, sprite: 16 * 5 + 1 },
    );
  }
}
