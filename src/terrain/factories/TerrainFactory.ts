import { Terrain, TerrainSchema } from "../types";

export default class TerrainFactory {
  private terrains: Map<string, Terrain>;

  constructor() {
    this.terrains = new Map<string, Terrain>();
  }

  async createTerrain(name: string, options: Partial<Terrain>) {
    const terrain = {
      size: {
        width: 10,
        height: 10,
        channels: 3,
      },
      ...options,
    };

    if (!terrain.data) {
      const { width, height, channels } = terrain.size!;
      terrain.data = new ArrayBuffer(width * height * channels);

      new Uint8Array(terrain.data).fill(0);
    }

    this.terrains.set(name, terrain as Terrain);
  }

  async getTerrain(src: string): Promise<Terrain> {
    let terrain = this.terrains.get(src);
    if (terrain) {
      return terrain;
    }

    terrain = await TerrainFactory.loadTileset(src);
    this.terrains.set(src, terrain);

    return terrain;
  }

  private static async loadTileset(src: string): Promise<Terrain> {
    const response = await fetch(src);
    return TerrainSchema.parse(await response.json());
  }
}

export const terrainFactory = new TerrainFactory();
