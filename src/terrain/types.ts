import { z } from "zod";

export const PositionSchema = z.object({
  x: z.number(),
  y: z.number(),
});

export type Position = z.infer<typeof PositionSchema>;

export const SizeSchema = z.object({
  width: z.number().nonnegative(),
  height: z.number().nonnegative(),
});

export type Size = z.infer<typeof SizeSchema>;

export const TilePositionSchema = z.object({
  x: z.number().nonnegative(),
  y: z.number().nonnegative(),
});

export const TilesetSchema = z.object({
  image: z.string().min(3),
  offset: TilePositionSchema,
  gap: TilePositionSchema,
  tiles: z.object({
    size: SizeSchema,
    numberOfTiles: TilePositionSchema,
  }),
});

export type Tileset = z.infer<typeof TilesetSchema>;

export const TerrainSizeSchema = SizeSchema.extend({
  channels: z.number().min(1),
});

export type TerrainSize = z.infer<typeof TerrainSizeSchema>;

export const TerrainSchema = z.object({
  tileset: z.string().min(3),
  size: TerrainSizeSchema,
  data: z.union([
    z
      .string()
      .base64()
      .transform((str: string) => Uint8Array.from(str as any).buffer),
    z
      .number()
      .nonnegative()
      .array()
      .transform((arr: number[]) => new Uint8Array(arr).buffer),
  ]),
});

export type Terrain = z.infer<typeof TerrainSchema>;
export type TerrainOptions = Omit<Terrain, "data" | "tileset"> &
  Partial<Terrain>;
