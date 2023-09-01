import { Cursor, Game } from "./game.ts";
import { FoeComponent, PlayerComponent, SpriteComponent } from "./components.ts";
import { findPath, Point } from "../engine/findPath.ts";
import { findSprite } from "./levelGenerator.ts";

export function getTilePos(pixelPos: Point) {
  return { x: (pixelPos.x / 16) | 0, y: (pixelPos.y / 16) | 0 };
}

export function inputSystem(game: Game) {
  if (game.side === "player") {
    game.eventQueue.forEach((event) => {
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
        } else if (game.commandPreview.length > 0) {
          let chopRemaining = false;
          if (game.commandPreview[0].type === "move") {
            if (game.commandPreview[0].path.length > 5) {
              chopRemaining = true;
            }
            game.commandPreview[0].path = game.commandPreview[0].path.slice(0, 5);
          }
          if (chopRemaining) {
            game.commandQueue.push(game.commandPreview[0]);
          } else {
            game.commandQueue.push(...game.commandPreview);
          }
          game.commandPreview = [];
          game.activePlayer = null;
          game.commandQueue.forEach((command) => {
            const player = game.ecs.getComponent<PlayerComponent>(command.entity, "player")!;
            player.moved = true;
          });
        }
      }
    });

    if (game.activePlayer !== null) {
      const playerSprite = game.ecs.getComponent<SpriteComponent>(game.activePlayer, "sprite")!;
      const playerPos = getTilePos(playerSprite);
      const path = findPath(
        (p) =>
          (playerPos.x === p.x && playerPos.y === p.y) ||
          (p.x === ((game.cursor.x / 16) | 0) && p.y === ((game.cursor.y / 16) | 0)) ||
          (game.tilemap?.getTile(p.x, p.y) === 16 + 7 && !findSprite(game.ecs, p.x, p.y)),
        playerPos,
        getTilePos(game.cursor),
      );
      if (path && path.length > 0) {
        const lastIndex = path.length - 1;
        const lastPos = path[lastIndex];
        const lastTile = game.tilemap?.getTile(lastPos.x, lastPos.y);
        const sprite = findSprite(game.ecs, lastPos.x, lastPos.y);

        if (lastTile === 16 * 3 + 4) {
          game.commandPreview = [];
          if (lastIndex > 0) {
            game.commandPreview.push({
              entity: game.activePlayer,
              type: "move",
              path: path.slice(0, lastIndex),
              idx: 0,
            });
          }
          game.commandPreview.push({
            entity: game.activePlayer,
            type: "mine",
            pos: lastPos,
            ttl: 20,
          });
        } else if (sprite) {
          game.commandPreview = [];
          if (lastIndex > 0) {
            game.commandPreview.push({
              entity: game.activePlayer,
              type: "move",
              path: path.slice(0, lastIndex),
              idx: 0,
            });
          }
          const foe = game.ecs.getComponent<FoeComponent>(sprite.entity, "foe");
          if (foe) {
            game.commandPreview.push({
              entity: game.activePlayer,
              type: "attack",
              pos: lastPos,
              ttl: 20,
            });
          }
        } else {
          game.commandPreview = [
            { entity: game.activePlayer, type: "move", path: path.slice(0, lastIndex), idx: 0 },
          ];
        }
      } else {
        game.commandPreview = [];
      }
    }

    const freePlayer = game.ecs.getComponentsByType<PlayerComponent>("player").find((c) => {
      return !c.moved;
    });
    if (!freePlayer) {
      game.side = "foe";
      game.ecs.getComponentsByType<PlayerComponent>("player").forEach((c) => {
        c.moved = false;
      });
      game.ecs.getComponentsByType<PlayerComponent>("foe").forEach((c) => {
        c.moved = false;
      });
    }
  }
  game.eventQueue.length = 0;
}
