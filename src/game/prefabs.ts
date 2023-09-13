import { spriteNames } from "./sprites.ts";

export const swordsman = [
  {
    type: "player",
    moved: false,
    baseClass: "swordsman",
    health: 15,
    maxHealth: 15,
    strength: 7,
    speed: 5,
  },
  { type: "sprite", x: 9 * 16, y: 3 * 16, sprite: spriteNames.swordsman },
  { type: "action", actions: ["attack"] },
];

export const dwarf = [
  {
    type: "player",
    moved: false,
    baseClass: "dwarf",
    health: 17,
    maxHealth: 17,
    strength: 5,
    speed: 5,
  },
  { type: "sprite", x: 9 * 16, y: 5 * 16, sprite: spriteNames.dwarf },
  { type: "action", actions: ["mine", "attack"] },
];

export const archer = [
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
];

export const trebuchet = [
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
];

export const king = [
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
  { type: "action", actions: ["attack"] },
];

export const orc = [
  {
    type: "foe",
    moved: false,
    baseClass: "orc",
    health: 10,
    maxHealth: 10,
    strength: 1,
    speed: 5,
  },
  { type: "sprite", x: 26 * 16, y: 10 * 16, sprite: spriteNames.orc },
];

export const princess = [
  {
    type: "foe",
    moved: false,
    baseClass: "princess",
    health: 10,
    maxHealth: 10,
    strength: 1,
    speed: 5,
  },
  { type: "sprite", x: 25 * 16, y: 11 * 16, sprite: spriteNames.princess },
];

export const dragon = [
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
];
