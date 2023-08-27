import { Cursor, Game } from "./game.ts";
import { PlayerComponent, SpriteComponent } from "./components.ts";
import { findPath } from "../engine/findPath.ts";

export function inputSystem(game: Game) {
  if (game.side === "player") {
    game.queue.forEach((event) => {
      if (event.type === "click") {
        const pos: Cursor = event.pos;

        const player = game.ecs.getComponentsByType<PlayerComponent>("player").find((player) => {
          const sprite = game.ecs.getComponent<SpriteComponent>(player.entity, "sprite")!;
          return (
            ((sprite.x / 16) | 0) === ((pos.x / 16) | 0) &&
            ((sprite.y / 16) | 0) === ((pos.y / 16) | 0)
          );
        });

        if (player && !player.moved) {
          game.activePlayer = player.entity;
        } else {
          if (game.activePlayer !== null) {
            const sprite = game.ecs.getComponent<SpriteComponent>(game.activePlayer, "sprite")!;
            const path = findPath(
              (p) =>
                p.x >= 0 &&
                p.y >= 0 &&
                p.x < 30 &&
                p.y < 16 &&
                game.tilemap?.getTile(p.x, p.y) === 16 * 1 + 7,
              { x: (sprite.x / 16) | 0, y: (sprite.y / 16) | 0 },
              { x: (pos.x / 16) | 0, y: (pos.y / 16) | 0 },
            );
            if (path) {
              const movement = path.length > 5 ? path.slice(0, 5) : path;
              game.ecs.addComponent(game.activePlayer, { type: "move", path: movement, idx: 0 });
              game.ecs.getComponent<PlayerComponent>(game.activePlayer, "player")!.moved = true;
            }
          }
          game.activePlayer = null;
        }
      }
    });
  }
  game.queue.length = 0;
}
