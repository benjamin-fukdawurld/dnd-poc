import { imageFactory } from "../common/ImageFactory";
import TerrainController from "./TerrainController";
import { terrainFactory } from "./factories/TerrainFactory";
import { tilesetFactory } from "./factories/TilesetFactory";
import { Position, Size } from "./types";

export type RenderPass = (renderer: TerrainRenderer) => boolean | void;

export default class TerrainRenderer {
  terrainController?: TerrainController;
  context?: CanvasRenderingContext2D;
  renderPipeline: RenderPass[];

  origin: Position;
  cursor?: Position;
  tileSize: Size;

  constructor() {
    this.renderPipeline = [
      (renderer: TerrainRenderer) => {
        renderer.clearCanvas();
      },
      (renderer: TerrainRenderer) => {
        renderer.updatePosition();
      },
      (renderer: TerrainRenderer) => {
        renderer.drawTileset();
      },
      (renderer: TerrainRenderer) => {
        renderer.drawTerrainDifficulty();
      },
      () => {
        const ctx = this.context!;
        ctx.resetTransform();
      },
    ];
    this.origin = {
      x: 0,
      y: 0,
    };
    this.tileSize = {
      width: 50,
      height: 50,
    };
  }

  async init(src: string, context: CanvasRenderingContext2D) {
    this.context = context;
    this.context.lineWidth = 1;
    this.resizeCanvas();

    const controller = this.terrainController ?? (await this.loadTerrain(src));

    return controller;
  }

  resizeCanvas() {
    const ctx = this.context!;
    ctx.canvas.width = ctx.canvas.clientWidth;
    ctx.canvas.height = ctx.canvas.clientHeight;
  }

  clearCanvas() {
    const ctx = this.context!;
    ctx.fillStyle = "lightgray";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  updatePosition() {
    const ctx = this.context!;
    ctx.save();
    ctx.transform(1, 0, 0, 1, this.origin.x, this.origin.y);
  }

  drawTileset() {
    const tileset = this.terrainController?.tileset;
    if (!tileset) {
      return;
    }

    const span = {
      x: tileset.gap.x + tileset.tiles.size.width,
      y: tileset.gap.y + tileset.tiles.size.height,
    };
    const size = tileset.tiles.size;

    for (let y = 0; y < this.terrainController!.size.height; ++y) {
      for (let x = 0; x < this.terrainController!.size.width; ++x) {
        this.context!.drawImage(
          this.terrainController!.image,
          span.x * this.terrainController!.getCell({ x, y })[1],
          span.y * this.terrainController!.getCell({ x, y })[2],
          size.width,
          size.height,
          x * this.tileSize.width,
          y * this.tileSize.height,
          this.tileSize.width,
          this.tileSize.height
        );
      }
    }
  }

  drawTerrainDifficulty() {
    const ctx = this.context;
    if (!ctx) {
      return;
    }

    ctx.globalAlpha = 0.5;
    for (let y = 0; y < this.terrainController!.size.height; ++y) {
      for (let x = 0; x < this.terrainController!.size.width; ++x) {
        ctx.fillStyle = this.tileDifficultyColor(
          this.terrainController!.getCell({ x, y })[0]
        );
        ctx.strokeRect(
          x * this.tileSize.width,
          y * this.tileSize.height,
          this.tileSize.width,
          this.tileSize.height
        );
        ctx.fillRect(
          y * this.tileSize.height,
          x * this.tileSize.width,
          this.tileSize.width,
          this.tileSize.height
        );
      }
    }
    ctx.globalAlpha = 1.0;

    if (this.cursor) {
      ctx.fillStyle = "blue";
      ctx.strokeRect(
        this.cursor.x * this.tileSize.width,
        this.cursor.y * this.tileSize.height,
        this.tileSize.width,
        this.tileSize.height
      );
      ctx.fillRect(
        this.cursor.x * this.tileSize.width,
        this.cursor.y * this.tileSize.height,
        this.tileSize.width,
        this.tileSize.height
      );
    }
  }

  render() {
    for (let i = 0, imax = this.renderPipeline.length; i < imax; ++i) {
      if (this.renderPipeline[i](this) === false) {
        break;
      }
    }
  }

  async loadTerrain(src: string) {
    const terrain = await terrainFactory.getTerrain(src);
    const tileset = await tilesetFactory.getTileset(terrain.tileset);
    const tilesetImage = await imageFactory.getImage(tileset.image);
    this.terrainController = new TerrainController({
      image: tilesetImage!,
      tileset: tileset!,
      terrain,
    });

    return this.terrainController;
  }

  private tileDifficultyColor(
    difficulty: number
  ): CanvasFillStrokeStyles["fillStyle"] {
    switch (true) {
      case difficulty === 0 || Number.isNaN(difficulty) || difficulty === 255:
        return `black`;

      case difficulty === 1:
        return "green";

      case difficulty > 1:
        return `color-mix(in srgb, green ${Math.max(
          0,
          100 - (difficulty - 1) * 30
        )}%, red)`;
    }
    return "green";
  }
}
