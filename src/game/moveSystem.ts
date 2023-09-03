import { Game } from "./game.ts";
import { ShootComponent, SpriteComponent } from "./components.ts";

export function moveSystem(game: Game) {
  if (game.commandQueue.length === 0) return;

  const command = game.commandQueue.at(0)!;
  switch (command.type) {
    case "move": {
      const sprite = game.ecs.getComponent<SpriteComponent>(command.entity, "sprite")!;
      const path = command.path;
      const next = path[command.idx];
      sprite.x += Math.sign(next.x * 16 - sprite.x);
      sprite.y += Math.sign(next.y * 16 - sprite.y);
      if (sprite.x === next.x * 16 && sprite.y === next.y * 16) {
        command.idx++;
        if (command.idx >= path.length) {
          game.commandQueue.splice(game.commandQueue.indexOf(command), 1);
        }
      }
      break;
    }
    case "mine": {
      game.inventory.ore += (3 + Math.random() * 3) | 0;
      if (command.ttl-- === 0) {
        game.commandQueue.splice(game.commandQueue.indexOf(command), 1);
      }
      break;
    }
    case "attack": {
      if (command.ttl-- === 0) {
        game.commandQueue.splice(game.commandQueue.indexOf(command), 1);
      }
      break;
    }
    case "shoot": {
      command.idx += 0.1;
      if (command.idx >= 10) {
        game.commandQueue.splice(game.commandQueue.indexOf(command), 1);
        const shootComponent = game.ecs.getComponent<ShootComponent>(command.entity, "shoot");
        if (shootComponent?.bullet === 16 * 4 + 1) {
          game.tilemap?.setTile(command.pos.x, command.pos.y, 16 * 4 + 5);
        }
      }
      break;
    }
  }
}
