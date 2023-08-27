import { Cursor, Game } from "./game.ts";
import { PlayerComponent, SpriteComponent } from "./components.ts";

export interface MoveComponent {
  type: "move";
  path: Cursor[];
  idx: number;
}

export function moveSystem(game: Game) {
  game.ecs.getComponentsByType<MoveComponent>("move").forEach((move) => {
    const sprite = game.ecs.getComponent<SpriteComponent>(move.entity, "sprite")!;
    const path = move.path;
    const next = path[move.idx];
    sprite.x += Math.sign(next.x * 16 - sprite.x);
    sprite.y += Math.sign(next.y * 16 - sprite.y);
    if (sprite.x === next.x * 16 && sprite.y === next.y * 16) {
      move.idx++;
      if (move.idx >= path.length) {
        game.ecs.removeComponent(move.entity, move);
      }
    }
  });

  const openMoves = game.ecs.getComponentsByType(game.side).filter((c) => {
    return !(c as any as PlayerComponent).moved;
  });
  const activeMoves = game.ecs.getComponentsByType<MoveComponent>("move");

  if (openMoves.length === 0 && activeMoves.length === 0) {
    game.side = game.side === "player" ? "foe" : "player";
    game.ecs.getComponentsByType<PlayerComponent>("player").forEach((c) => {
      c.moved = false;
    });
    game.ecs.getComponentsByType<PlayerComponent>("foe").forEach((c) => {
      c.moved = false;
    });
  }
}
