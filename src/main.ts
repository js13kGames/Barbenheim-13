import "./style.css";
import { createCanvas, gameLoop, loadImage } from "./engine/gl-util.ts";
import { SpriteRenderer } from "./engine/SpriteRenderer.ts";
import { drawSprite2, drawText } from "./engine/renderUtils.ts";
import { Ecs } from "./engine/Ecs.ts";
import { findPath } from "./engine/findPath.ts";

const pixelSize = 4;
const canvas = createCanvas(1920, 1080);
document.body.appendChild(canvas);
const renderer = new SpriteRenderer(canvas, pixelSize);
const ecs = new Ecs();

loadImage("barbenheim13.png", (img) => {
  renderer.setTexture(img);
});

// interface SpriteComponent {
//   type: "sprite";
//   x: number;
//   y: number;
//   sprite: number;
// }

interface TileMap {
  width: number;
  height: number;
  tiles: number[];
}

const cursor = { x: 0, y: 0 };
canvas.addEventListener("mousemove", (e) => {
  cursor.x = (e.offsetX / 16) * pixelSize;
  cursor.y = (e.offsetY / 16) * pixelSize;
});

const player = ecs.createEntity();
ecs.addComponent(player, { type: "sprite", sprite: 16 * 7, x: 100, y: 100 });

const house = ecs.createEntity();
ecs.addComponent(house, { type: "sprite", sprite: 16 * 8 + 8, x: 50, y: 50 });

let t = 0;

const tilemap: TileMap = {
  width: 30,
  height: 16,
  tiles: [],
};
for (let y = 0; y < tilemap.height; y++) {
  for (let x = 0; x < tilemap.width; x++) {
    tilemap.tiles.push(16 * 1 + 7);
  }
}
for (let i = 0; i < 50; i++) {
  const x = (Math.random() * tilemap.width) | 0;
  const y = (Math.random() * tilemap.height) | 0;
  tilemap.tiles[x + y * tilemap.width] = (16 * 1 + 8 + Math.random() * 4) | 0;
}

function update() {
  t++;
}

function render() {
  // for (let x = 0; x < 60; x++) {
  //   drawSprite(renderer, x * 8, 2, (x % 10) + 16);
  // }
  drawText(renderer, 0, 0, "Hello World! This is a test of the emergency broadcast system...");

  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 30; x++) {
      drawSprite2(renderer, x * 16, y * 16, tilemap.tiles[x + y * tilemap.width]);
    }
  }

  // drawSprite2(renderer, 3 * 16, 3 * 16, 16 * 1 + 8);
  // drawSprite2(renderer, 10 * 16, 3 * 16, 16 * 1 + 11);

  drawSprite2(renderer, 3 * 16, 3 * 16, 16 * 2 + 6, 0.5 + Math.sin(t / 10) / 4);
  drawSprite2(renderer, 3 * 16, 3 * 16, 16 * 3);

  drawSprite2(renderer, 2 * 16, 7 * 16, 16 * 3);

  drawSprite2(renderer, 20 * 16, 5 * 16, 16 * 5 + 1);
  drawSprite2(renderer, 21 * 16, 5 * 16, 16 * 5 + 1);

  let mouseX = (cursor.x / 16) | 0;
  let mouseY = (cursor.y / 16) | 0;
  const path = findPath(
    (p) =>
      p.x >= 0 &&
      p.y >= 0 &&
      p.x < 30 &&
      p.y < 16 &&
      tilemap.tiles[p.x + p.y * tilemap.width] === 16 * 1 + 7,
    { x: 3, y: 3 },
    { x: mouseX, y: mouseY },
  );
  path?.forEach((p, idx) => {
    drawSprite2(
      renderer,
      p.x * 16,
      p.y * 16,
      idx < 5 ? 16 * 2 + 3 : 16 * 2 + 5,
      0.5 + Math.sin(t / 6 + idx / 1.5 + p.x + p.y) / 4,
    );
    if (idx === 4 || (idx === path.length - 1 && idx < 5)) {
      drawSprite2(renderer, p.x * 16, p.y * 16, 16 * 2 + 6, 0.5 + Math.sin(t / 10) / 4);
    }
  });
  // for (let y = 0; y < 1080 / (pixelSize * 16); y++) {
  //   for (let x = 0; x < 1920 / (pixelSize * 16); x++) {
  //     drawSprite2(renderer, x * 16, y * 16, 8 * 7 + 1);
  //   }
  // }
  // ecs.getComponentsByType<SpriteComponent>("sprite").forEach((sprite) => {
  //   drawSprite(renderer, sprite.x, sprite.y, sprite.sprite);
  // });
  // renderer.drawSprite(16, 16, 6 * 8, 6 * 8, 16, 16);
  // drawSprite2(renderer, 16 * mouseX, 16 * mouseY, 16 * 1 + 2);
  // drawTextbox(renderer, 175, 8, 12, "Hello World");
  renderer.render();
}

gameLoop(update, render);
