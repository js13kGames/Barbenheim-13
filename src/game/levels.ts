import { Point } from "../engine/findPath.ts";
import { archer, dragon, dwarf, king, orc, princess, swordsman, trebuchet } from "./prefabs.ts";

export interface Instance {
  prefab: any[];
  position?: Point;
}

export interface Level {
  prompt: string[];
  seed: number;
  entities: Instance[];
  river?: boolean;
  road?: boolean;
  castle?: boolean;
  mountains?: number;
  trees?: number;
}

export const levels: Level[] = [
  {
    prompt: [
      "In the 13th century, a tragedy fell upon the kingdom of Barbenheim. Their beloved princess suddenly disappeared. Rumors say that she was kidnapped by a dragon and taken to his lair in the mountains.",
      "Venture east towards the mountains. You control your units by clicking on them and then clicking on the map to move them. Attack enemies when they are within range, by clicking on them.",
    ],
    seed: 131313,
    river: true,
    road: true,
    castle: true,
    mountains: 10,
    trees: 10,
    entities: [
      { prefab: king },
      { prefab: archer, position: { x: 9, y: 6 } },
      { prefab: swordsman, position: { x: 11, y: 8 } },
      { prefab: orc },
    ],
  },
  {
    prompt: ["Venture through the forest"],
    seed: 76543,
    road: true,
    mountains: 80,
    trees: 80,
    entities: [
      { prefab: swordsman },
      { prefab: swordsman, position: { x: 9, y: 4 } },
      { prefab: dwarf, position: { x: 9, y: 5 } },
      //   { prefab: trebuchet },
      //   { prefab: king },
      { prefab: archer },
      { prefab: orc },
      { prefab: orc, position: { x: 28, y: 6 } },
      { prefab: orc, position: { x: 20, y: 4 } },
      { prefab: orc, position: { x: 18, y: 12 } },
    ],
  },
  {
    prompt: [
      "Our alchemist has developed a tiny nuclear bomb for your everyday dragon-slaying needs.",
      "You can launch it from the trebuchet!",
    ],
    seed: 123456,
    road: true,
    mountains: 120,
    trees: 10,
    entities: [
      { prefab: trebuchet },
      { prefab: swordsman },
      { prefab: swordsman, position: { x: 9, y: 4 } },
      { prefab: dwarf, position: { x: 9, y: 5 } },
      { prefab: orc, position: { x: 28, y: 6 } },
      { prefab: orc, position: { x: 20, y: 4 } },
      { prefab: orc, position: { x: 18, y: 12 } },
    ],
  },
  {
    prompt: [
      "You have found the princess. But she is angry at you for disturbing her peace. She commands her dragon and orcs against you",
    ],
    seed: 1234456,
    road: true,
    mountains: 120,
    trees: 10,
    entities: [
      { prefab: archer },
      { prefab: trebuchet },
      { prefab: swordsman },
      { prefab: swordsman, position: { x: 9, y: 4 } },
      { prefab: dwarf, position: { x: 9, y: 5 } },
      { prefab: orc, position: { x: 26, y: 10 } },
      { prefab: orc, position: { x: 24, y: 8 } },
      { prefab: orc, position: { x: 21, y: 12 } },
      { prefab: orc, position: { x: 19, y: 8 } },
      { prefab: dragon, position: { x: 22, y: 10 } },
      { prefab: princess },
    ],
  },
];
