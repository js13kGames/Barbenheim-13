import { Game } from "./game.ts";
import { FoeComponent, PlayerComponent, SpriteComponent } from "./components.ts";
import { findPath } from "../engine/findPath.ts";

export function enemySystem(game: Game) {
  if (game.side !== "foe") return;
  if (game.ecs.getComponentsByType("move").length > 0) return;

  const foe = game.ecs.getComponentsByType<FoeComponent>("foe").find((c) => {
    return !c.moved;
  });
  if (foe) {
    const players = game.ecs.getComponentsByType<PlayerComponent>("player");
    let closestPlayer = { entity: players[0].entity, distance: 1000 };
    const foeSprite = game.ecs.getComponent<SpriteComponent>(foe.entity, "sprite")!;
    foe.moved = true;

    players.forEach((player) => {
      const playerSprite = game.ecs.getComponent<SpriteComponent>(player.entity, "sprite")!;
      const distance =
        Math.abs(playerSprite.x - foeSprite.x) + Math.abs(playerSprite.y - foeSprite.y);
      if (distance < closestPlayer.distance) {
        closestPlayer = { entity: player.entity, distance };
      }
    });

    const playerSprite = game.ecs.getComponent<SpriteComponent>(closestPlayer.entity, "sprite")!;

    const path = findPath(
      (p) =>
        p.x >= 0 &&
        p.y >= 0 &&
        p.x < 30 &&
        p.y < 16 &&
        game.tilemap?.getTile(p.x, p.y) === 16 * 1 + 7,
      { x: (foeSprite.x / 16) | 0, y: (foeSprite.y / 16) | 0 },
      { x: (playerSprite.x / 16) | 0, y: (playerSprite.y / 16) | 0 },
    );
    if (path) {
      const movement = path.length > 5 ? path.slice(0, 5) : path;

      game.ecs.addComponent(foe.entity, { type: "move", path: movement, idx: 0 });
    }
  } else {
    game.side = "player";
    game.ecs.getComponentsByType<PlayerComponent>("player").forEach((c) => {
      c.moved = false;
    });
    game.ecs.getComponentsByType<PlayerComponent>("foe").forEach((c) => {
      c.moved = false;
    });
  }
}
