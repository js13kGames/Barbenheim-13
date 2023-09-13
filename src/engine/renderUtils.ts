import { SpriteRenderer } from "./SpriteRenderer.ts";

export function drawTextbox(
  renderer: SpriteRenderer,
  x: number,
  y: number,
  w: number,
  text: string,
  centered = false,
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
    const leftPad = centered ? 7 + (maxWidth - line.length * 7) / 2 : 8;
    drawText(renderer, x + leftPad, y + 8 + i * 8, line);
  });
}

export function drawButton(
  renderer: SpriteRenderer,
  x: number,
  y: number,
  w: number,
  text: string,
  centered = false,
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
  drawPanel(renderer, x, y, w, lines.length + 2, 32 * 3 + 4);
  lines.forEach((line, i) => {
    const leftPad = centered ? 7 + (maxWidth - line.length * 7) / 2 : 8;
    drawText(renderer, x + leftPad, y + 8 + i * 8, line);
  });
}

export function drawPanel(
  renderer: SpriteRenderer,
  x: number,
  y: number,
  w: number,
  h: number,
  base = 32 * 3 + 1,
) {
  for (let dy = 0; dy < h; dy++) {
    for (let dx = 0; dx < w; dx++) {
      let sprite = base;
      if (dy === 0) sprite -= 32;
      if (dy === h - 1) sprite += 32;
      if (dx === 0) sprite -= 1;
      if (dx === w - 1) sprite += 1;
      drawSprite(renderer, x + dx * 8, y + dy * 8, sprite);
    }
  }
}

export function drawText(renderer: SpriteRenderer, x: number, y: number, text: string, alpha = 1) {
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
    const sy = (sprite / 32) | 0;
    const sx = sprite % 32;
    renderer.drawSprite(x + count * 7, y, sx * 8, sy * 8, 8, 8, alpha);
    count++;
  }
}

export function drawSprite(renderer: SpriteRenderer, x: number, y: number, sprite: number) {
  const sy = (sprite / 32) | 0;
  const sx = sprite % 32;
  renderer.drawSprite(x, y, sx * 8, sy * 8, 8, 8);
}

export function drawSprite2(
  renderer: SpriteRenderer,
  x: number,
  y: number,
  sprite: number,
  alpha = 1,
  angle = 0,
  scale = 1,
) {
  const sy = (sprite / 16) | 0;
  const sx = sprite % 16;
  renderer.drawSprite(x, y, sx * 16, sy * 16, 16, 16, alpha, angle, scale, 0);
}

export function drawSprite3(
  renderer: SpriteRenderer,
  x: number,
  y: number,
  sprite: number,
  alpha = 1,
  angle = 0,
  scale = 1,
) {
  if (sprite < 0) return;
  const sy = (sprite / 16) | 0;
  const sx = sprite % 16;
  renderer.drawSprite(x, y - 8, sx * 16, sy * 16, 16, 24, alpha, angle, scale, 0);
}
