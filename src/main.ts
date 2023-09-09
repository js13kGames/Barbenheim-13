import "./style.css";
import { createCanvas, gameLoop, loadImage } from "./engine/gl-util.ts";
import { SpriteRenderer } from "./engine/SpriteRenderer.ts";
import { drawPanel, drawSprite2, drawText, drawTextbox } from "./engine/renderUtils.ts";
import { TileMap } from "./engine/tilemap.ts";
import { Game } from "./game/game.ts";
import { findSprite, generateLevel } from "./game/levelGenerator.ts";
import {
  FoeComponent,
  PlayerComponent,
  ShootComponent,
  SpriteComponent,
} from "./game/components.ts";
import { getTilePos, inputSystem } from "./game/inputSystem.ts";
import { moveSystem } from "./game/moveSystem.ts";
import { enemySystem } from "./game/enemySystem.ts";
import { spriteNames } from "./game/sprites.ts";
import { AttackCommand, MineCommand, ShootCommand } from "./game/commands.ts";

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

const tilemap = new TileMap(30, 17);
generateLevel(tilemap);
game.tilemap = tilemap;

game.init();

function update() {
  game.tick++;
  inputSystem(game);
  enemySystem(game);
  moveSystem(game);

  if (game.turn >= 0) {
    game.messageBox = story[game.turn++];
  }
}

function render() {
  const t = game.tick;

  for (let y = 0; y < 17; y++) {
    for (let x = 6; x < 30; x++) {
      drawSprite2(renderer, x * 16, y * 16, tilemap.tiles[x + y * tilemap.width]);
    }
  }

  game.ecs.getComponentsByType<SpriteComponent>("sprite").forEach((sprite) => {
    const playerComponent = game.ecs.getComponent<PlayerComponent>(sprite.entity, "player");
    if (playerComponent && !playerComponent.moved && game.side === "player") {
      drawSprite2(renderer, sprite.x, sprite.y, spriteNames.idle, 0.25 + Math.sin(t / 10) / 8);
    }

    const foeComponent = game.ecs.getComponent<FoeComponent>(sprite.entity, "foe");
    if (foeComponent && !foeComponent.moved && game.side === "foe") {
      drawSprite2(renderer, sprite.x, sprite.y, spriteNames.idle, 0.25 + Math.sin(t / 10) / 8);
    }

    drawSprite2(renderer, sprite.x, sprite.y, sprite.sprite);
    if (sprite.sprite === spriteNames.dragon1) {
      drawSprite2(renderer, sprite.x + 16, sprite.y, spriteNames.dragon2);
    }
  });

  if (game.selectedEntity !== null) {
    const sprite = game.ecs.getComponent<SpriteComponent>(game.selectedEntity, "sprite")!;
    drawSprite2(renderer, sprite.x, sprite.y, spriteNames.selected, 0.5 + Math.sin(t / 10) / 4);

    // @ts-ignore
    game.commandPreview.forEach((command, cidx) => {
      switch (command.type) {
        case "move": {
          // @ts-ignore
          command.path.forEach((p, idx) => {
            drawSprite2(renderer, p.x * 16, p.y * 16, spriteNames.greenDot, 1);
          });
          break;
        }
        case "mine": {
          const mineCommand = command as MineCommand;
          drawSprite2(
            renderer,
            mineCommand.pos.x * 16,
            mineCommand.pos.y * 16,
            spriteNames.mine,
            1,
          );
          break;
        }
        case "attack": {
          const attackCommand = command as AttackCommand;
          drawSprite2(
            renderer,
            attackCommand.pos.x * 16,
            attackCommand.pos.y * 16,
            spriteNames.attack,
            1,
          );
          break;
        }
        case "shoot": {
          const attackCommand = command as ShootCommand;
          drawSprite2(
            renderer,
            attackCommand.pos.x * 16,
            attackCommand.pos.y * 16,
            spriteNames.attack,
            1,
          );
          const dx = (command.pos.x * 16 - sprite.x) / 10;
          const dy = (command.pos.y * 16 - sprite.y) / 10;
          for (let i = 0; i < 10; i++) {
            const r = Math.PI / 10;
            const h = Math.sin(i * r) * 2 * 16;
            drawSprite2(renderer, sprite.x + dx * i, sprite.y + dy * i - h, spriteNames.redDot, 1);
          }
          break;
        }
      }
    });
  }

  const cursor = getTilePos(game.cursor);
  drawSprite2(renderer, cursor.x * 16, cursor.y * 16, spriteNames.cursor, 1);

  const currentCmd = game.commandQueue.at(0);
  if (currentCmd) {
    switch (currentCmd.type) {
      case "attack": {
        drawSprite2(
          renderer,
          currentCmd.pos.x * 16 + Math.random() * 4 - 2,
          currentCmd.pos.y * 16 + Math.random() * 4 - 2,
          spriteNames.blood,
        );
        break;
      }
      case "mine": {
        drawSprite2(
          renderer,
          currentCmd.pos.x * 16 + Math.random() * 4 - 2,
          currentCmd.pos.y * 16 + Math.random() * 4 - 2 - (20 - currentCmd.ttl) / 2,
          spriteNames.ore,
        );
        break;
      }
      case "shoot": {
        const i = currentCmd.idx;
        const sprite = game.ecs.getComponent<SpriteComponent>(currentCmd.entity, "sprite")!;
        const shooter = game.ecs.getComponent<ShootComponent>(currentCmd.entity, "shoot")!;
        const dx = (currentCmd.pos.x * 16 - sprite.x) / 10;
        const dy = (currentCmd.pos.y * 16 - sprite.y) / 10;
        const r = Math.PI / 10;
        const h = Math.sin(i * r) * 2 * 16;
        const a = -Math.cos(i * r);
        if (shooter.bullet === spriteNames.fireball) {
          drawSprite2(
            renderer,
            sprite.x + dx * i,
            sprite.y + dy * i,
            shooter.bullet,
            1,
            game.tick / 6,
          );
        } else {
          drawSprite2(renderer, sprite.x + dx * i, sprite.y + dy * i - h, shooter.bullet, 1, a);
        }
      }
    }
  }

  const stats = game.ecs.getComponent<PlayerComponent>(game.selectedEntity!, "player")!;
  if (stats) {
    let y = 16;
    drawPanel(renderer, 0, (y += 8), 12, 7);
    drawText(renderer, 8, (y += 8), stats.baseClass);
    drawText(renderer, 8, (y += 16), "HP: " + stats.health + "/" + stats.maxHealth);
    drawText(renderer, 8, (y += 8), "AP: " + stats.strength);
    drawText(renderer, 8, (y += 8), "MP: " + stats.speed);
  }

  const hoveredSprite = findSprite(game.ecs, game.cursor.x / 16, game.cursor.y / 16);
  if (hoveredSprite) {
    const foeStats = game.ecs.getComponent<FoeComponent>(hoveredSprite.entity, "foe")!;
    if (foeStats) {
      let y = 16 + 8 * 7;
      drawPanel(renderer, 0, (y += 8), 12, 7);
      drawText(renderer, 8, (y += 8), foeStats.baseClass);
      drawText(renderer, 8, (y += 16), "HP: " + foeStats.health + "/" + foeStats.maxHealth);
      drawText(renderer, 8, (y += 8), "AP: " + foeStats.strength);
      drawText(renderer, 8, (y += 8), "MP: " + foeStats.speed);
    } else if (game.selectedEntity === null) {
      const playerStats = game.ecs.getComponent<PlayerComponent>(hoveredSprite.entity, "player")!;
      if (playerStats) {
        let y = 16;
        drawPanel(renderer, 0, (y += 8), 12, 7);
        drawText(renderer, 8, (y += 8), playerStats.baseClass);
        drawText(renderer, 8, (y += 16), "HP: " + playerStats.health + "/" + playerStats.maxHealth);
        drawText(renderer, 8, (y += 8), "AP: " + playerStats.strength);
        drawText(renderer, 8, (y += 8), "MP: " + playerStats.speed);
      }
    }
  }

  drawPanel(renderer, 0, 0, 12, 3);
  drawText(renderer, 8, 8, game.side + " turn");

  if (game.state === "win") {
    drawTextbox(renderer, 16 * 8, 16 * 8, 40, "You win!", true);
  } else if (game.state === "lose") {
    drawTextbox(renderer, 16 * 8, 16 * 8, 40, "You lose!", true);
  }

  if (game.nuke) {
    const { x, y, tStart } = game.nuke;

    //--- begin nuke
    const t2 = (0.7 * (t - tStart)) % 32;
    const alpha = (32 - t2) / 32;
    if (t2 > 16) {
      drawSprite2(renderer, 16 * x, 16 * (y - 1), 16 * 7 + (Math.random() > 0.5 ? 16 : 0), alpha);
    }
    drawSprite2(renderer, 16 * x, 16 * y, 16 * 7 + (Math.random() > 0.5 ? 16 : 0), alpha);

    drawSprite2(renderer, 16 * x - 8, 16 * y - t2, 16 * 6, alpha, 0, 2 - alpha);
    drawSprite2(renderer, 16 * (x + 1) - 8, 16 * y - t2, 16 * 6 + 1, alpha, 0, 2 - alpha);

    drawSprite2(renderer, 16 * x - 8, 16 * y - t2, 16 * 8 + 2, alpha * 0.7, -t2 / 5, 3 - alpha);
    drawSprite2(
      renderer,
      16 * (x + 1) - 8 + t2 * 0.15,
      16 * y - t2,
      16 * 8 + 2,
      alpha * 0.7,
      t2 / 5,
      3 - alpha,
    );

    for (let i = 0; i < 10; i++) {
      drawSprite2(
        renderer,
        16 * x + Math.random() * 24 - 12,
        16 * y + 8,
        16 * 6 + 4 + (Math.random() < 0.25 ? 0 : 1),
        alpha,
        Math.sin(t),
      );
    }
    if (t2 >= 31) {
      game.nuke = null;
    }
  }

  if (game.messageBox) {
    drawTextbox(renderer, 16 * 8, 16 * 8, 40, game.messageBox);
  }

  //--- end nuke
  renderer.render();
}

gameLoop(update, render);

const story = [
  "In the 13th century, a tragedy fell upon the kingdom of Barbenheim. Their beloved princess suddenly dissapeared. Rumors say that she was kidnapped by a dragon and taken to his lair in the mountains.",
  "Our alchemist needs you to bring him som rare ore from the mines. You will recognize it by its green glow. He will use it to craft a powerful weapon that will help you defeat the dragon.",
  "A goat farmer has lost a good deal of his heard. He suspects that the dragon has been feeding on his goats. He will reward you if you bring him back some goat meat.",
  "The dragon has been terrorizing the kingdom for too long. It is time to put an end to this. Find the princess and bring her back to the castle.",
  "The weapon is ready. It is time to face the dragon.",
  "Much to our surprise, the princess refuses to return to the castle. She fled to the mountains to get some rest from the constant courtship from the princes of the neighboring kingdoms. She is not in any danger and will return to the castle when she is ready.",
];
