import "./style.css";
import { createCanvas, gameLoop, loadImage } from "./engine/gl-util.ts";
import { SpriteRenderer } from "./engine/SpriteRenderer.ts";
import { drawSprite2 } from "./engine/renderUtils.ts";
import { TileMap } from "./engine/tilemap.ts";
import { Cursor, Game } from "./game/game.ts";
import { generateLevel } from "./game/levelGenerator.ts";
import { findPath } from "./engine/findPath.ts";

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
  game.queue.push({ type: "click", pos: { ...game.cursor } });
});

const tilemap = new TileMap(30, 16);
generateLevel(tilemap);

game.init();

function update() {
  game.t++;
  game.queue.forEach((event) => {
    if (event.type === "click") {
      game.activePlayer = null;
      const pos: Cursor = event.pos;
      game.ecs.getComponentsByType("player").forEach((player) => {
        const sprite = game.ecs.getComponent<SpriteComponent>(player.entity, "sprite")!;
        if (
          ((sprite.x / 16) | 0) === ((pos.x / 16) | 0) &&
          ((sprite.y / 16) | 0) === ((pos.y / 16) | 0)
        ) {
          game.activePlayer = player.entity;
        }
      });
    }
  });
  game.queue.length = 0;
}

interface SpriteComponent {
  type: "sprite";
  x: number;
  y: number;
  sprite: number;
}

interface PlayerComponent {
  type: "player";
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
    drawSprite2(renderer, sprite.x, sprite.y, sprite.sprite);
  });

  let mouseX = (game.cursor.x / 16) | 0;
  let mouseY = (game.cursor.y / 16) | 0;
  drawSprite2(renderer, mouseX * 16, mouseY * 16, 16 * 1 + 2);

  if (game.activePlayer !== null) {
    const playerSprite = game.ecs.getComponent<SpriteComponent>(game.activePlayer, "sprite")!;

    const path = findPath(
      (p) =>
        p.x >= 0 && p.y >= 0 && p.x < 30 && p.y < 16 && tilemap.getTile(p.x, p.y) === 16 * 1 + 7,
      { x: (playerSprite.x / 16) | 0, y: (playerSprite.y / 16) | 0 },
      { x: mouseX, y: mouseY },
    );
    path?.forEach((p, idx) => {
      drawSprite2(renderer, p.x * 16, p.y * 16, idx < 5 ? 16 * 2 + 3 : 16 * 2 + 5);
      if (idx === 4 || (idx === path.length - 1 && idx < 5)) {
        drawSprite2(renderer, p.x * 16, p.y * 16, 16 * 2 + 6, 0.5 + Math.sin(t / 10) / 4);
      }
    });
  }

  renderer.render();
}

gameLoop(update, render);
