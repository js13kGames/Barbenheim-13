export interface SpriteComponent {
  type: "sprite";
  x: number;
  y: number;
  sprite: number;
}

export interface PlayerComponent {
  type: "player";
  moved: boolean;
}

export interface FoeComponent {
  type: "foe";
  moved: boolean;
}
