import { Tileset, TilesetSchema } from "../types";

export default class TilesetFactory {
  private tilesets: Map<string, Tileset>;

  constructor() {
    this.tilesets = new Map<string, Tileset>();
  }

  async getTileset(src: string): Promise<Tileset> {
    let tileset = this.tilesets.get(src);
    if (tileset) {
      return tileset;
    }

    tileset = await TilesetFactory.loadTileset(src);
    this.tilesets.set(src, tileset);

    return tileset;
  }

  private static async loadTileset(src: string): Promise<Tileset> {
    const response = await fetch(src);
    return TilesetSchema.parse(await response.json());
  }
}

export const tilesetFactory = new TilesetFactory();
