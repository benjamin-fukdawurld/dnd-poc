import { LitElement, PropertyValueMap, css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { Ref, createRef, ref } from "lit/directives/ref.js";

import TerrainRenderer from "../TerrainRenderer";

@customElement("dnd-terrain")
export default class DndTerrain extends LitElement {
  static readonly styles = [
    css`
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }

      canvas {
        width: 100%;
        height: 100%;
      }
    `,
  ];

  canvasRef: Ref<HTMLCanvasElement> = createRef();

  ctx!: CanvasRenderingContext2D;
  renderer: TerrainRenderer;
  stopDrawing: boolean;

  constructor() {
    super();
    this.renderer = new TerrainRenderer();
    this.stopDrawing = false;
  }

  firstUpdated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    super.firstUpdated(_changedProperties);

    const ctx = this.canvasRef.value?.getContext("2d");
    if (!ctx) {
      throw new Error("Cannot get canvas context");
    }

    this.ctx = ctx;
    this.renderer.init("/terrains/terrain.json", ctx).then(() => this.draw());
    const sizeObserver = new ResizeObserver(() => {
      this.renderer.resizeCanvas();
      this.draw();
    });

    sizeObserver.observe(this.canvasRef.value!);
    this.canvasRef.value?.addEventListener("mousemove", (event) => {
      const pos = {
        x: Math.floor(
          (event.x - this.renderer.origin.x) / this.renderer.tileSize.width
        ),
        y: Math.floor(
          (event.y - this.renderer.origin.y) / this.renderer.tileSize.height
        ),
      };
      if (
        pos.x < 0 ||
        pos.x >= this.renderer.terrainController!.size.width ||
        pos.y < 0 ||
        pos.y >= this.renderer.terrainController!.size.height
      ) {
        this.renderer.cursor = undefined;
      } else {
        this.renderer.cursor = pos;
      }

      requestAnimationFrame(() => this.draw());
    });
  }

  disconnectedCallback(): void {
    this.stopDrawing = true;
  }

  protected draw() {
    if (this.stopDrawing) {
      return;
    }

    if (!this.renderer.terrainController) {
      requestAnimationFrame(() => this.draw());
      return;
    }

    this.renderer.render();
  }

  protected render(): unknown {
    return html`<canvas ${ref(this.canvasRef)}></canvas>`;
  }
}
