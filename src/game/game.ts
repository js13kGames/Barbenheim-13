import { Ecs, Entity } from "../engine/Ecs.ts";
import { TileMap } from "../engine/tilemap.ts";
import { Command } from "./commands.ts";
import { Point } from "../engine/findPath.ts";
import { spriteNames } from "./sprites.ts";

export interface Cursor {
  x: number;
  y: number;
}

export class Game {
  tick = 0;
  turn = 0;
  ecs = new Ecs();
  selectedEntity: Entity | null = null;
  cursor: Point = { x: 0, y: 0 };
  prevCursor: Point = { x: 0, y: 0 };
  eventQueue: any[] = [];
  tilemap: TileMap | null = null;
  side: "player" | "foe" = "player";
  commandPreview: Command[] = [];
  commandQueue: Command[] = [];
  inventory = {
    ore: 0,
  };
  state: "playing" | "win" | "lose" = "playing";
  nuke: { x: number; y: number; tStart: number } | null = null;
  messageBox: string | null = null;

  init() {
    const ecs = this.ecs;

    const player = ecs.createEntity();
    ecs.addComponents(
      player,
      {
        type: "player",
        moved: false,
        baseClass: "swordsman",
        health: 15,
        maxHealth: 15,
        strength: 7,
        speed: 5,
      },
      { type: "sprite", x: 8 * 16, y: 3 * 16, sprite: spriteNames.swordsman },
      { type: "action", actions: ["attack"] },
    );

    const player2 = ecs.createEntity();
    ecs.addComponents(
      player2,
      {
        type: "player",
        moved: false,
        baseClass: "dwarf",
        health: 17,
        maxHealth: 17,
        strength: 5,
        speed: 5,
      },
      { type: "sprite", x: 8 * 16, y: 5 * 16, sprite: spriteNames.dwarf },
      { type: "action", actions: ["mine", "attack"] },
    );

    const player3 = ecs.createEntity();
    ecs.addComponents(
      player3,
      {
        type: "player",
        moved: false,
        baseClass: "archer",
        health: 12,
        maxHealth: 12,
        strength: 3,
        speed: 5,
      },
      { type: "sprite", x: 6 * 16, y: 4 * 16, sprite: spriteNames.archer },
      { type: "shoot", bullet: spriteNames.arrow },
      { type: "ranged", range: 10, action: "attack" },
    );

    const player4 = ecs.createEntity();
    ecs.addComponents(
      player4,
      {
        type: "player",
        moved: false,
        baseClass: "trebuchet",
        health: 7,
        maxHealth: 7,
        strength: 99,
        speed: 3,
      },
      { type: "sprite", x: 6 * 16, y: 6 * 16, sprite: spriteNames.trebuchet },
      { type: "shoot", bullet: spriteNames.bomb },
      { type: "ranged", range: 10, action: "attack" },
    );

    const player5 = ecs.createEntity();
    ecs.addComponents(
      player5,
      {
        type: "player",
        moved: false,
        baseClass: "king",
        health: 7,
        maxHealth: 7,
        strength: 99,
        speed: 3,
      },
      { type: "sprite", x: 6 * 16, y: 2 * 16, sprite: spriteNames.king },
    );

    const foe = ecs.createEntity();
    ecs.addComponents(
      foe,
      {
        type: "foe",
        moved: false,
        baseClass: "orc",
        health: 10,
        maxHealth: 10,
        strength: 1,
        speed: 5,
      },
      { type: "sprite", x: 20 * 16, y: 10 * 16, sprite: spriteNames.orc },
    );

    const foe2 = ecs.createEntity();
    ecs.addComponents(
      foe2,
      {
        type: "foe",
        moved: false,
        baseClass: "orc",
        health: 10,
        maxHealth: 10,
        strength: 1,
        speed: 5,
      },
      { type: "sprite", x: 21 * 16, y: 12 * 16, sprite: spriteNames.orc },
    );

    const foe3 = ecs.createEntity();
    ecs.addComponents(
      foe3,
      {
        type: "foe",
        moved: false,
        baseClass: "princess",
        health: 10,
        maxHealth: 10,
        strength: 1,
        speed: 5,
      },
      { type: "sprite", x: 23 * 16, y: 11 * 16, sprite: spriteNames.princess },
    );

    const dragon = ecs.createEntity();
    ecs.addComponents(
      dragon,
      {
        type: "foe",
        moved: false,
        baseClass: "dragon",
        health: 57,
        maxHealth: 57,
        strength: 11,
        speed: 3,
      },
      { type: "sprite", x: 23 * 16, y: 9 * 16, sprite: spriteNames.dragon1 },
      { type: "shoot", bullet: spriteNames.fireball },
      { type: "ranged", range: 10, action: "attack" },
    );
  }
}
