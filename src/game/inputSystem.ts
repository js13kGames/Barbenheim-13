import { Cursor, Game } from "./game.ts";
import { findPath, hDist, Point } from "../engine/findPath.ts";
import { findSprite, isFreeTile } from "./levelGenerator.ts";
import {
  ActionComponent,
  FoeComponent,
  PlayerComponent,
  RangedComponent,
  SpriteComponent,
} from "./components.ts";
import { spriteNames } from "./sprites.ts";

export function getTilePos(pixelPos: Point) {
  return { x: (pixelPos.x / 16) | 0, y: (pixelPos.y / 16) | 0 };
}

export function inputSystem(game: Game) {
  if (game.side === "player") {
    game.eventQueue.forEach((event) => {
      if (event.type === "click") {
        const pos: Cursor = event.pos;
        const sprite = findSprite(game.ecs, (pos.x / 16) | 0, (pos.y / 16) | 0);
        const player = sprite && game.ecs.getComponent<PlayerComponent>(sprite.entity, "player");
        if (sprite && player && !player.moved) {
          game.selectedEntity = sprite.entity;
        } else {
          if (game.commandPreview.length > 0 && game.selectedEntity !== null) {
            game.commandQueue.push(...game.commandPreview);
            game.commandPreview = [];
            const player = game.ecs.getComponent<PlayerComponent>(game.selectedEntity, "player")!;
            player!.moved = true;
          }
          game.selectedEntity = null;
        }
      }
    });

    if (game.selectedEntity !== null) {
      const selectedSprite = game.ecs.getComponent<SpriteComponent>(game.selectedEntity, "sprite")!;
      const startPos = getTilePos(selectedSprite);
      const targetPos = getTilePos(game.cursor);
      const path = findPath(
        (pos) =>
          (pos.x === startPos.x && pos.y === startPos.y) ||
          (pos.x === targetPos.x && pos.y === targetPos.y) ||
          isFreeTile(game.ecs, game.tilemap!, pos),
        startPos,
        targetPos,
      );

      game.commandPreview = [];
      const player = game.ecs.getComponent<PlayerComponent>(game.selectedEntity, "player")!;
      if (path && path.length > 0 && path.length <= player.speed) {
        const lastPos = path[path.length - 1];
        const lastPosIsFree = isFreeTile(game.ecs, game.tilemap!, lastPos);
        if (!lastPosIsFree) {
          path.pop();
        }
        if (path.length > 0) {
          game.commandPreview.push({ entity: game.selectedEntity, type: "move", path, idx: 0 });
        }
        if (!lastPosIsFree) {
          const lastTile = game.tilemap?.getTile(lastPos.x, lastPos.y) ?? -1;
          const action = game.ecs.getComponent<ActionComponent>(game.selectedEntity, "action")!;
          if (action) {
            if (lastTile === spriteNames.mountain && action.actions.includes("mine")) {
              game.commandPreview.push({
                type: "mine",
                entity: game.selectedEntity!,
                pos: lastPos,
                ttl: 20,
              });
            }
            if (action.actions.includes("attack")) {
              const foeSprite = findSprite(game.ecs, lastPos.x, lastPos.y);
              const foe = foeSprite && game.ecs.getComponent<FoeComponent>(foeSprite.entity, "foe");
              if (foe) {
                game.commandPreview.push({
                  type: "attack",
                  entity: game.selectedEntity!,
                  pos: lastPos,
                  ttl: 20,
                  ranged: false,
                });
              }
            }
          }
        }
      }

      const cursorSprite = findSprite(game.ecs, targetPos.x, targetPos.y);
      const rangedComponent = game.ecs.getComponent<RangedComponent>(player.entity, "ranged");
      if (rangedComponent && cursorSprite) {
        const foe = game.ecs.getComponent<FoeComponent>(cursorSprite.entity, "foe");
        if (hDist(targetPos, startPos) <= rangedComponent.range && foe) {
          if (game.commandPreview.length > 0) {
            game.commandPreview.pop();
          }
          game.commandPreview.push({
            type: "shoot",
            entity: game.selectedEntity!,
            pos: targetPos,
            idx: 0,
          });
        }
      }
    }

    /*
              const player = game.ecs.getComponentsByType<PlayerComponent>("player").find((player) => {
                const sprite = game.ecs.getComponent<SpriteComponent>(player.entity, "sprite")!;
                return (
                  ((sprite.x / 16) | 0) === ((pos.x / 16) | 0) &&
                  ((sprite.y / 16) | 0) === ((pos.y / 16) | 0)
                );
              });

              if (player && !player.moved) {
                game.selectedEntity = player.entity;
              } else if (game.commandPreview.length > 0) {
                let chopRemaining = false;
                if (game.commandPreview[0].type === "move") {
                  const player = game.ecs.getComponent<PlayerComponent>(
                    game.commandPreview[0].entity,
                    "player",
                  )!;
                  if (game.commandPreview[0].path.length > player!.speed) {
                    chopRemaining = true;
                  }
                  game.commandPreview[0].path = game.commandPreview[0].path.slice(0, player!.speed);
                }
                if (chopRemaining) {
                  game.commandQueue.push(game.commandPreview[0]);
                } else {
                  game.commandQueue.push(...game.commandPreview);
                }
                game.commandPreview = [];
                game.selectedEntity = null;
                game.commandQueue.forEach((command) => {
                  const player = game.ecs.getComponent<PlayerComponent>(command.entity, "player")!;
                  player.moved = true;
                });
              }
            }
            */

    // if (game.selectedEntity !== null) {
    //   const playerSprite = game.ecs.getComponent<SpriteComponent>(game.selectedEntity, "sprite")!;
    //   const playerPos = getTilePos(playerSprite);
    //   const path = findPath(
    //     (p) =>
    //       (playerPos.x === p.x && playerPos.y === p.y) ||
    //       (p.x === ((game.cursor.x / 16) | 0) && p.y === ((game.cursor.y / 16) | 0)) ||
    //       (game.tilemap?.getTile(p.x, p.y) === 16 + 7 && !findSprite(game.ecs, p.x, p.y)),
    //     playerPos,
    //     getTilePos(game.cursor),
    //   );
    //   if (path && path.length > 0) {
    //     const lastIndex = path.length - 1;
    //     const lastPos = path[lastIndex];
    //     const lastTile = game.tilemap?.getTile(lastPos.x, lastPos.y);
    //     const sprite = findSprite(game.ecs, lastPos.x, lastPos.y);
    //
    //     if (lastTile === 16 * 3 + 4) {
    //       game.commandPreview = [];
    //       if (lastIndex > 0) {
    //         game.commandPreview.push({
    //           entity: game.selectedEntity,
    //           type: "move",
    //           path: path.slice(0, lastIndex),
    //           idx: 0,
    //         });
    //       }
    //       game.commandPreview.push({
    //         entity: game.selectedEntity,
    //         type: "mine",
    //         pos: lastPos,
    //         ttl: 20,
    //       });
    //     } else if (sprite) {
    //       game.commandPreview = [];
    //       if (lastIndex > 0) {
    //         game.commandPreview.push({
    //           entity: game.selectedEntity,
    //           type: "move",
    //           path: path.slice(0, lastIndex),
    //           idx: 0,
    //         });
    //       }
    //       const foe = game.ecs.getComponent<FoeComponent>(sprite.entity, "foe");
    //       if (foe) {
    //         game.commandPreview.push({
    //           entity: game.selectedEntity,
    //           type: "attack",
    //           pos: lastPos,
    //           ttl: 20,
    //         });
    //       }
    //     } else if (lastTile === 16 * 1 + 7 && lastIndex > 0) {
    //       game.commandPreview = [
    //         { entity: game.selectedEntity, type: "move", path: path.slice(0, lastIndex), idx: 0 },
    //       ];
    //     }
    //
    //     const shootComponent = game.ecs.getComponent<ShootComponent>(game.selectedEntity, "shoot");
    //     if (shootComponent) {
    //       const dx = lastPos.x - playerPos.x;
    //       const dy = lastPos.y - playerPos.y;
    //       const len = Math.sqrt(dx * dx + dy * dy);
    //       console.log(len);
    //       if (len > 5 && len < 10) {
    //         game.commandPreview.pop();
    //         game.commandPreview.push({
    //           entity: game.selectedEntity,
    //           type: "shoot",
    //           pos: lastPos,
    //           idx: 0,
    //         });
    //       }
    //     }
    //   } else {
    //     game.commandPreview = [];
    //   }
    // }

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
