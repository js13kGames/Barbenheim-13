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
  if (game.messageBox) {
    game.eventQueue.forEach((event) => {
      if (event.type === "click") {
        game.messageBox = null;
      }
    });
  } else if (game.side === "player") {
    game.eventQueue.forEach((event) => {
      if (event.type === "click") {
        const pos: Cursor = event.pos;
        const sprite = findSprite(game.ecs, (pos.x / 16) | 0, (pos.y / 16) | 0);
        const player = sprite && game.ecs.getComponent<PlayerComponent>(sprite.entity, "player");
        if (sprite && player && !player.moved) {
          game.selectedEntity = sprite.entity;
        } else {
          if (game.commandPreview.length > 0 && game.selectedEntity !== null) {
            const player = game.ecs.getComponent<PlayerComponent>(game.selectedEntity, "player")!;
            player.moved = true;
            game.commandQueue.push(...game.commandPreview);
            game.commandPreview = [];
          }
          game.selectedEntity = null;
        }
      }
    });

    if (game.selectedEntity !== null) {
      const selectedSprite = game.ecs.getComponent<SpriteComponent>(game.selectedEntity, "sprite")!;
      const startPos = getTilePos(selectedSprite);
      const targetPos = getTilePos(game.cursor);
      const pathObj = findPath(
        (pos) =>
          (pos.x === startPos.x && pos.y === startPos.y) ||
          (pos.x === targetPos.x && pos.y === targetPos.y) ||
          isFreeTile(game.ecs, game.tilemap!, game.objmap!, pos),
        startPos,
        targetPos,
      );
      const path = pathObj.path;

      game.commandPreview = [];
      const player = game.ecs.getComponent<PlayerComponent>(game.selectedEntity, "player")!;
      if (path && path.length > 0) {
        const lastPos = path[path.length - 1];
        const lastPosIsFree = isFreeTile(game.ecs, game.tilemap!, game.objmap!, lastPos);
        if (!lastPosIsFree) {
          path.pop();
        }
        if (path.length > 0) {
          game.commandPreview.push({
            entity: game.selectedEntity,
            type: "move",
            path: path,
            idx: 0,
            speed: player.speed,
          });
        }
        if (!lastPosIsFree) {
          const lastObj = game.objmap?.getTile(lastPos.x, lastPos.y) ?? -1;
          const action = game.ecs.getComponent<ActionComponent>(game.selectedEntity, "action")!;
          if (action) {
            if (lastObj === spriteNames.mountain && action.actions.includes("mine")) {
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
      if (rangedComponent && (cursorSprite || game.commandPreview.length > 0)) {
        const foe = cursorSprite && game.ecs.getComponent<FoeComponent>(cursorSprite.entity, "foe");
        let outOfReach = false;
        const lastMove = game.commandPreview.pop();
        if (lastMove?.type === "move") {
          outOfReach = lastMove.path.length > lastMove.speed;
        }
        if (foe && hDist(targetPos, startPos) <= rangedComponent.range) {
          game.commandPreview.push({
            type: "shoot",
            entity: game.selectedEntity!,
            pos: targetPos,
            idx: 0,
          });
        } else if (outOfReach && hDist(targetPos, startPos) <= rangedComponent.range) {
          game.commandPreview.push({
            type: "shoot",
            entity: game.selectedEntity!,
            pos: targetPos,
            idx: 0,
          });
        } else if (lastMove) {
          game.commandPreview.push(lastMove);
        }
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
