import { Ecs, Entity } from "../engine/Ecs.ts";

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

  init() {
    const ecs = this.ecs;

    const player = ecs.createEntity();
    ecs.addComponents(
      player,
      { type: "player" },
      { type: "sprite", x: 3 * 16, y: 3 * 16, sprite: 16 * 3 },
    );

    const player2 = ecs.createEntity();
    ecs.addComponents(
      player2,
      { type: "player" },
      { type: "sprite", x: 2 * 16, y: 5 * 16, sprite: 16 * 3 },
    );

    const foe = ecs.createEntity();
    ecs.addComponents(foe, { type: "sprite", x: 20 * 16, y: 10 * 16, sprite: 16 * 5 + 1 });
  }
}
