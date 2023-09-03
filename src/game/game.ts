import { Ecs, Entity } from "../engine/Ecs.ts";
import { TileMap } from "../engine/tilemap.ts";
import { Command } from "./commands.ts";
import { Point } from "../engine/findPath.ts";

export interface Cursor {
  x: number;
  y: number;
}

export class Game {
  t = 0;
  ecs = new Ecs();
  activePlayer: Entity | null = null;
  cursor: Point = { x: 0, y: 0 };
  prevCursor: Point = { x: 0, y: 0 };
  eventQueue: any[] = [];
  tilemap: TileMap | null = null;
  side: "player" | "foe" = "player";
  commandPreview: Command[] = [];
  commandQueue: Command[] = [];
  inventory = {
    xp: 0,
    ore: 0,
  };

  init() {
    const ecs = this.ecs;

    const player = ecs.createEntity();
    ecs.addComponents(
      player,
      { type: "player", moved: false, speed: 5 },
      { type: "sprite", x: 3 * 16, y: 3 * 16, sprite: 16 * 3 },
    );

    const player2 = ecs.createEntity();
    ecs.addComponents(
      player2,
      { type: "player", moved: false, speed: 5 },
      { type: "sprite", x: 2 * 16, y: 5 * 16, sprite: 16 * 3 + 2 },
    );

    const player3 = ecs.createEntity();
    ecs.addComponents(
      player3,
      { type: "player", moved: false, speed: 5 },
      { type: "sprite", x: 2 * 16, y: 10 * 16, sprite: 16 * 4 + 2 },
      { type: "shoot", bullet: 16 * 4 + 0 },
    );

    const player4 = ecs.createEntity();
    ecs.addComponents(
      player4,
      { type: "player", moved: false, speed: 3 },
      { type: "sprite", x: 2 * 16, y: 8 * 16, sprite: 16 * 4 + 3 },
      { type: "shoot", bullet: 16 * 4 + 1 },
    );

    const foe = ecs.createEntity();
    ecs.addComponents(
      foe,
      { type: "foe", moved: false, speed: 5 },
      { type: "sprite", x: 20 * 16, y: 10 * 16, sprite: 16 * 5 + 1 },
    );

    const foe2 = ecs.createEntity();
    ecs.addComponents(
      foe2,
      { type: "foe", moved: false, speed: 5 },
      { type: "sprite", x: 21 * 16, y: 12 * 16, sprite: 16 * 5 + 1 },
    );
  }
}
