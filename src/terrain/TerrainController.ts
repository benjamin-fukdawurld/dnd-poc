import { Position, Terrain, TerrainSize, Tileset } from "./types";

export default class TerrainController {
  readonly image: HTMLImageElement;
  readonly tileset: Tileset;
  readonly size: TerrainSize;
  readonly data: ArrayBufferLike;

  constructor({
    terrain,
    tileset,
    image,
  }: {
    terrain: Terrain;
    tileset: Tileset;
    image: HTMLImageElement;
  }) {
    this.image = image;
    this.tileset = tileset;
    this.size = terrain.size;
    this.data = terrain.data;
  }

  getCell(pos: Position): Uint8Array {
    return this.getCellByIndex(this.getIndex(pos));
  }

  getCellByIndex(index: number): Uint8Array {
    return new Uint8Array(this.data, index, this.size.channels);
  }

  getGridIndex(pos: Position) {
    return pos.y * this.size.width + pos.x;
  }

  getIndex(pos: Position) {
    return (pos.y * this.size.width + pos.x) * this.size.channels;
  }

  getPosition(index: number) {
    const posIndex = Math.floor(index / this.size.channels);
    const y = Math.floor(posIndex / this.size.width);
    return {
      x: posIndex - y * this.size.width,
      y,
    };
  }

  getGridPosition(index: number): Position {
    const y = Math.floor(index / this.size.width);
    return { x: index - y * this.size.width, y };
  }
}
