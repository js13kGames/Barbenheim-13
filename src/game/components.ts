export interface SpriteComponent {
  type: "sprite";
  x: number;
  y: number;
  sprite: number;
}

export interface PlayerComponent extends Stats {
  type: "player";
  moved: boolean;
}

export interface FoeComponent extends Stats {
  type: "foe";
  moved: boolean;
}

export interface ShootComponent {
  type: "shoot";
  bullet: number;
}

export interface Stats {
  baseClass: BaseClass;
  health: number;
  strength: number;
  speed: number;
}

export type BaseClass =
  | "swordsman"
  | "archer"
  | "dwarf"
  | "trebuchet"
  | "orc"
  | "dragon"
  | "princess";
