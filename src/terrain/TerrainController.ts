import { combatantFactory } from "../combatant/factories/CombatantFactory";
import { ICombatantController } from "../combatant/types";
import { Combat, Combatant } from "../common/types";

export default class TerrainController {
  width: number;
  height: number;
  tileWidth: number;
  tileHeight: number;

  constructor(public ctx: CanvasRenderingContext2D, combat: Combat) {
    this.width = ctx.canvas.width;
    this.height = ctx.canvas.height;
    this.tileWidth = 80;
    this.tileHeight = 80;

    ctx.canvas.addEventListener("mousemove", (e: MouseEvent) => {
      const position = {
        x: e.offsetX - this.tileWidth / 2,
        y: e.offsetY - this.tileHeight / 2,
      };

      this.draw(combat);
      ctx.fillStyle = "red";
      ctx.save();
      //this.ctx.transform(1, 1, 2, -2, 0, 0);
      //this.ctx.transform(1 / 2, 1 / 4, -1 / 2, 1 / 4, 0, 0);
      this.ctx.fillRect(
        position.x,
        position.y,
        this.tileWidth,
        this.tileHeight
      );
      ctx.restore();
    });
  }

  centerCanvas() {
    this.ctx.transform(
      1,
      0,
      0,
      1,
      (this.width - this.tileWidth) / 2,
      (this.height - this.tileHeight) / 2
    );
  }

  isoCanvas() {
    this.ctx.transform(1 / 2, 1 / 4, -1 / 2, 1 / 4, 0, 0);
  }

  drawSkyBox() {
    this.ctx.fillStyle = "aliceblue";
    this.ctx.rect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.fill();
  }

  drawCombatants(combat: Combat) {
    let index = 0;
    this.ctx.transform(1, 0, 0, 1, this.tileWidth / 2, this.tileHeight / 2);
    const controllers: ICombatantController[] = [];
    for (const group of combat.groups) {
      this.ctx.fillStyle = ["green", "red", "blue"][index++];
      for (const id of group) {
        const controller = combatantFactory.get(id);
        if (!controller) {
          continue;
        }

        controllers.push(controller);
        this.ctx.beginPath();
        this.ctx.arc(
          this.tileWidth * controller.combatant.position.x,
          this.tileHeight * controller.combatant.position.y,
          this.tileWidth / 2,
          0,
          Math.PI * 2
        );
        this.ctx.closePath();
        this.ctx.fill();
      }
    }

    for (const controller of controllers) {
      this.ctx.save();
      this.ctx.transform(5, 0, 0, 5, -this.tileWidth / 5, -this.tileHeight / 5);
      this.ctx.beginPath();
      this.ctx.fillStyle = "black";
      this.ctx.scale(1, -1);
      this.ctx.fillText(
        controller.combatant.name[0],
        (this.tileWidth * controller.combatant.position.x) / 5,
        -(this.tileHeight * controller.combatant.position.y) / 5
      );
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.restore();
    }
  }

  drawTile({ x, y, color }: { x: number; y: number; color: string }) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(
      x * this.tileWidth,
      y * this.tileHeight,
      this.tileWidth,
      this.tileHeight
    );
  }

  drawTerrain(combat: Combat) {
    this.ctx.save();
    this.ctx.transform(1, 0, 0, -1, 0, 0);
    for (let y = -10; y <= 10; ++y) {
      for (let x = -10; x <= 10; ++x) {
        this.drawTile({ x, y, color: (x + y) % 2 === 0 ? "#FFFA" : "#000A" });
      }
    }

    this.drawCombatants(combat);
    this.ctx.restore();
  }

  draw(combat: Combat): Combat {
    this.drawSkyBox();
    this.ctx.save();
    this.centerCanvas();
    this.isoCanvas();
    this.drawTerrain(combat);
    this.ctx.restore();
    return combat;
  }
}
