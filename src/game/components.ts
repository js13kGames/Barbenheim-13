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
}

export interface FoeComponent {
  type: "foe";
  moved: boolean;
  movePoints: number;
  hitPoints: number;
}
