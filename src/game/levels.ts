import { Point } from "../engine/findPath.ts";
import { archer, dragon, dwarf, king, orc, princess, swordsman, trebuchet } from "./prefabs.ts";

export interface Instance {
  prefab: any[];
  position?: Point;
}

export interface Level {
  prompt: string;
  seed: number;
  entities: Instance[];
  river?: boolean;
  castle?: boolean;
  mountains?: number;
  trees?: number;
}

export const levels: Level[] = [
  {
    prompt: "Welcome to the game!",
    seed: 131313,
    river: true,
    castle: true,
    mountains: 10,
    trees: 10,
    entities: [{ prefab: archer }, { prefab: orc }],
  },
  {
    prompt: "A bigger challenge!",
    seed: 1,
    mountains: 70,
    trees: 50,
    entities: [
      { prefab: swordsman },
      { prefab: swordsman, position: { x: 9, y: 4 } },
      { prefab: dwarf, position: { x: 9, y: 5 } },
      { prefab: trebuchet },
      { prefab: king },
      { prefab: archer },
      { prefab: orc },
      { prefab: dragon },
      { prefab: princess },
    ],
  },
];
