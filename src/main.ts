import "./style.css";
import { createCanvas, gameLoop, loadImage } from "./engine/gl-util.ts";
import { SpriteRenderer } from "./engine/SpriteRenderer.ts";
import { drawSprite } from "./engine/renderUtils.ts";
import { Ecs } from "./engine/Ecs.ts";

const canvas = createCanvas(1920, 1080);
document.body.appendChild(canvas);
const renderer = new SpriteRenderer(canvas);
const ecs = new Ecs();

loadImage("barbenheim13.png", (img) => {
  renderer.setTexture(img);
});

function update() {}

function render() {
  for (let y = 0; y < 34; y++) {
    for (let x = 0; x < 60; x++) {
      drawSprite(renderer, x * 8, y * 8, 16 * 10);
    }
  }
  renderer.render();
}

gameLoop(update, render);
