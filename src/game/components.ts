export interface SpriteComponent {
  type: "sprite";
  x: number;
  y: number;
  sprite: number;
}

export interface PlayerComponent {
  type: "player";
  moved: boolean;
  movePoints: number;
  hitPoints: number;
  speed: number;
}

export interface FoeComponent {
  type: "foe";
  moved: boolean;
  movePoints: number;
  hitPoints: number;
  speed: number;
}

export interface ShootComponent {
  type: "shoot";
  bullet: number;
}
