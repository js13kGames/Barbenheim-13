import { Point } from "../engine/findPath.ts";
import { archer, dragon, dwarf, orc, princess, swordsman } from "./prefabs.ts";

export interface Instance {
  prefab: any[];
  position?: Point;
}

export interface Level {
  prompt: string;
  seed: number;
  entities: Instance[];
  river?: boolean;
  mountains?: number;
  trees?: number;
}

export const levels: Level[] = [
  {
    prompt: "Welcome to the game!",
    seed: 131313,
    river: true,
    entities: [{ prefab: archer }, { prefab: orc }],
    mountains: 10,
    trees: 10,
  },
  {
    prompt: "A bigger challenge!",
    seed: 0,
    mountains: 50,
    trees: 50,
    entities: [
      { prefab: swordsman },
      { prefab: swordsman, position: { x: 9, y: 4 } },
      { prefab: dwarf, position: { x: 9, y: 5 } },
      { prefab: archer },
      { prefab: orc },
      { prefab: dragon },
      { prefab: princess },
    ],
  },
];
