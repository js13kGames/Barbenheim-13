import { Game } from "./game.ts";
import { FoeComponent, PlayerComponent, ShootComponent, SpriteComponent } from "./components.ts";
import { findSprite } from "./levelGenerator.ts";
import { spriteNames } from "./sprites.ts";
import { AttackCommand, ShootCommand } from "./commands.ts";

function updateStats(game: Game, command: AttackCommand | ShootCommand) {
  const targetSprite = findSprite(game.ecs, command.pos.x, command.pos.y);
  const targetFoe = targetSprite && game.ecs.getComponent<FoeComponent>(targetSprite.entity, "foe");
  const targetPlayer =
    targetSprite && game.ecs.getComponent<PlayerComponent>(targetSprite.entity, "player");
  const actor =
    game.ecs.getComponent<PlayerComponent>(command.entity, "player") ??
    game.ecs.getComponent<FoeComponent>(command.entity, "foe");
  const target = targetFoe ?? targetPlayer;
  if (actor && target) {
    target.health -= actor.strength;
    if (target.health <= 0) {
      game.ecs.removeEntity(targetSprite!.entity);
      const skull = game.ecs.createEntity();
      game.ecs.addComponents(skull, {
        type: "sprite",
        x: targetSprite!.x,
        y: targetSprite!.y,
        sprite: spriteNames.skull,
      });

      if (game.side === "player") {
        const foeCount = game.ecs.getComponentsByType<FoeComponent>("foe").length;
        if (foeCount === 0) {
          game.state = "win";
        }
      } else {
        const playerCount = game.ecs.getComponentsByType<PlayerComponent>("player").length;
        if (playerCount === 0) {
          game.state = "lose";
        }
      }
    }
  }
}

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
      if (command.ttl-- === 0) {
        game.inventory.ore += (3 + Math.random() * 3) | 0;
        game.commandQueue.splice(game.commandQueue.indexOf(command), 1);
      }
      break;
    }
    case "attack": {
      if (command.ttl-- === 0) {
        updateStats(game, command);
        game.commandQueue.splice(game.commandQueue.indexOf(command), 1);
      }
      break;
    }
    case "shoot": {
      command.idx += 0.1;
      if (command.idx >= 10) {
        updateStats(game, command);
        game.commandQueue.splice(game.commandQueue.indexOf(command), 1);
        const shootComponent = game.ecs.getComponent<ShootComponent>(command.entity, "shoot");
        if (shootComponent?.bullet === 16 * 4 + 1) {
          game.tilemap?.setTile(command.pos.x, command.pos.y, 16 * 4 + 5);
          game.nuke = { x: command.pos.x, y: command.pos.y, tStart: game.tick };
        }
      }
      break;
    }
  }
}
