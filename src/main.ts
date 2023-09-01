import "./style.css";
import { createCanvas, gameLoop, loadImage } from "./engine/gl-util.ts";
import { SpriteRenderer } from "./engine/SpriteRenderer.ts";
import { drawSprite2, drawText } from "./engine/renderUtils.ts";
import { TileMap } from "./engine/tilemap.ts";
import { Game } from "./game/game.ts";
import { generateLevel } from "./game/levelGenerator.ts";
import { FoeComponent, PlayerComponent, SpriteComponent } from "./game/components.ts";
import { inputSystem } from "./game/inputSystem.ts";
import { moveSystem } from "./game/moveSystem.ts";
import { enemySystem } from "./game/enemySystem.ts";
import { MoveCommand } from "./game/commands.ts";

const pixelSize = 4;
const canvas = createCanvas(1920, 1080);
document.body.appendChild(canvas);
const renderer = new SpriteRenderer(canvas, pixelSize);

loadImage("barbenheim13.png", (img) => {
  renderer.setTexture(img);
});

const game = new Game();

canvas.addEventListener("mousemove", (e) => {
  game.cursor.x = (e.offsetX / 16) * pixelSize;
  game.cursor.y = (e.offsetY / 16) * pixelSize;
});

canvas.addEventListener("click", () => {
  game.eventQueue.push({ type: "click", pos: { ...game.cursor } });
});

const tilemap = new TileMap(30, 16);
generateLevel(tilemap);
game.tilemap = tilemap;

game.init();

function update() {
  game.t++;
  inputSystem(game);
  enemySystem(game);
  moveSystem(game);
}

function render() {
  const t = game.t;

  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 30; x++) {
      drawSprite2(renderer, x * 16, y * 16, tilemap.tiles[x + y * tilemap.width]);
    }
  }

  if (game.activePlayer !== null) {
    const sprite = game.ecs.getComponent<SpriteComponent>(game.activePlayer, "sprite")!;
    drawSprite2(renderer, sprite.x, sprite.y, 16 * 2 + 6, 0.5 + Math.sin(t / 10) / 4);
  }

  game.ecs.getComponentsByType<SpriteComponent>("sprite").forEach((sprite) => {
    const playerComponent = game.ecs.getComponent<PlayerComponent>(sprite.entity, "player");
    if (playerComponent && !playerComponent.moved && game.side === "player") {
      drawSprite2(renderer, sprite.x, sprite.y, 19, 0.25 + Math.sin(t / 10) / 8);
    }

    const foeComponent = game.ecs.getComponent<FoeComponent>(sprite.entity, "foe");
    if (foeComponent && !foeComponent.moved && game.side === "foe") {
      drawSprite2(renderer, sprite.x, sprite.y, 19, 0.25 + Math.sin(t / 10) / 8);
    }

    drawSprite2(renderer, sprite.x, sprite.y, sprite.sprite);
  });

  if (game.side === "player") {
    let mouseX = (game.cursor.x / 16) | 0;
    let mouseY = (game.cursor.y / 16) | 0;
    drawSprite2(renderer, mouseX * 16, mouseY * 16, 16 * 1 + 2);

    if (game.commandPreview.length > 0) {
      game.commandPreview.forEach((command, cidx) => {
        if (command.type === "move") {
          command.path.forEach((p, idx) => {
            drawSprite2(renderer, p.x * 16, p.y * 16, 16 * 2 + 3, idx > 4 ? 0.2 : 1);
          });
        }
        const invalid =
          cidx > 0 &&
          game.commandPreview[cidx - 1].type === "move" &&
          (game.commandPreview[cidx - 1] as MoveCommand).path.length > 5;

        if (command.type === "mine") {
          drawSprite2(
            renderer,
            command.pos.x * 16,
            command.pos.y * 16,
            16 * 2 + 12,
            invalid ? 0.3 : 1,
          );
        }
        if (command.type === "attack") {
          drawSprite2(
            renderer,
            command.pos.x * 16,
            command.pos.y * 16,
            16 * 2 + 11,
            invalid ? 0.3 : 1,
          );
        }
      });
    }
  }

  const currentCmd = game.commandQueue.at(0);
  if (currentCmd) {
    switch (currentCmd.type) {
      case "attack": {
        drawSprite2(
          renderer,
          currentCmd.pos.x * 16 + Math.random() * 4 - 2,
          currentCmd.pos.y * 16 + Math.random() * 4 - 2,
          16 * 2 + 14,
        );
        break;
      }
      case "mine": {
        drawSprite2(
          renderer,
          currentCmd.pos.x * 16 + Math.random() * 4 - 2,
          currentCmd.pos.y * 16 + Math.random() * 4 - 2 - (20 - currentCmd.ttl) / 2,
          16 * 2 + 15,
        );
        break;
      }
    }
  }

  drawText(
    renderer,
    16,
    16 * 16 + 2,
    "Ore: " + game.inventory.ore + "    XP: " + game.inventory.xp,
  );

  renderer.render();
}

gameLoop(update, render);
