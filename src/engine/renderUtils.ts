import { SpriteRenderer } from "./SpriteRenderer.ts";

export function drawTextbox(
  renderer: SpriteRenderer,
  x: number,
  y: number,
  w: number,
  text: string,
) {
  let lines = [];
  let currentWidth = 0;
  const maxWidth = w * 8 - 16;
  let currentLine: string[] = [];
  const words = text.split(" ");
  words.forEach((word, i) => {
    if (currentWidth + word.length * 7 > maxWidth) {
      lines.push(currentLine.join(" "));
      currentWidth = 0;
      currentLine = [];
    }
    currentLine.push(word);
    currentWidth += word.length * 7;
    if (i < words.length - 1) {
      currentWidth += 7;
    }
  });
  if (currentLine.length > 0) {
    lines.push(currentLine.join(" "));
  }
  drawPanel(renderer, x, y, w, lines.length + 2);
  lines.forEach((line, i) => {
    drawText(renderer, x + 8, y + 8 + i * 8, line);
  });
}

export function drawPanel(renderer: SpriteRenderer, x: number, y: number, w: number, h: number) {
  for (let dy = 0; dy < h; dy++) {
    for (let dx = 0; dx < w; dx++) {
      let sprite = 64 + 17;
      if (dy === 0) sprite -= 16;
      if (dy === h - 1) sprite += 16;
      if (dx === 0) sprite -= 1;
      if (dx === w - 1) sprite += 1;
      drawSprite(renderer, x + dx * 8, y + dy * 8, sprite);
    }
  }
}

export function drawText(renderer: SpriteRenderer, x: number, y: number, text: string) {
  let count = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.toUpperCase().charCodeAt(i);
    let sprite = char - 32; // + 32 * 26;
    if (char === 123) {
      const end = text.indexOf("}", i);
      const numberString = text.substring(i + 1, end);
      sprite = parseInt(numberString);
      i = end;
    }
    const sy = (sprite / 16) | 0;
    const sx = sprite % 16;
    renderer.drawSprite(x + count * 7, y, sx * 8, sy * 8, 8, 8);
    count++;
  }
}

export function drawSprite(renderer: SpriteRenderer, x: number, y: number, sprite: number) {
  const sy = (sprite / 16) | 0;
  const sx = sprite % 16;
  renderer.drawSprite(x, y, sx * 8, sy * 8, 8, 8);
}
