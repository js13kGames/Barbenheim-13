import { Ecs, Entity } from "../engine/Ecs.ts";
import { TileMap } from "../engine/tilemap.ts";
import { Command } from "./commands.ts";
import { Point } from "../engine/findPath.ts";
import { generateLevel } from "./levelGenerator.ts";
import { Level } from "./levels.ts";
import { PlayerComponent, SpriteComponent } from "./components.ts";

export interface Cursor {
  x: number;
  y: number;
}

export class Game {
  tick = 0;
  level = 0;
  turn = 0;
  ecs = new Ecs();
  selectedEntity: Entity | null = null;
  cursor: Point = { x: 0, y: 0 };
  prevCursor: Point = { x: 0, y: 0 };
  eventQueue: any[] = [];
  tilemap: TileMap | null = null;
  objmap: TileMap | null = null;
  side: "player" | "foe" = "player";
  commandPreview: Command[] = [];
  commandQueue: Command[] = [];
  inventory = {
    ore: 0,
  };
  state: "playing" | "win" | "lose" = "playing";
  nuke: { x: number; y: number; tStart: number } | null = null;
  messageBox: string | null = null;

  constructor(public levels: Level[]) {}

  init() {
    this.tilemap = new TileMap(30, 17);
    this.objmap = new TileMap(30, 17);
    this.populateLevel();
  }

  populateLevel() {
    this.side = "player";
    const levelSpec = this.levels[this.level];
    generateLevel(this.tilemap!, this.objmap!, levelSpec);
    this.messageBox = levelSpec.prompt;

    const ecs = this.ecs;
    ecs.clear();
    for (const spec of levelSpec.entities) {
      const entity = ecs.createEntityFromPrefab(spec.prefab);
      if (spec.position) {
        const sprite = ecs.getComponent<SpriteComponent>(entity, "sprite")!;
        sprite.x = spec.position.x * 16;
        sprite.y = spec.position.y * 16;
      }
    }
  }

  endTurn() {
    this.side = "foe";
    this.ecs.getComponentsByType<PlayerComponent>("player").forEach((c) => {
      c.moved = false;
    });
    this.ecs.getComponentsByType<PlayerComponent>("foe").forEach((c) => {
      c.moved = false;
    });
  }
}
