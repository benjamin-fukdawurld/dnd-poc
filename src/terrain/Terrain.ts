import { Position, TerrainOptions, TerrainSize } from "./types";
import { areAdjacent, getAdjacentPositions, squaredDistance } from "./utils";

export default class Terrain {
  size: TerrainSize;
  data: Uint8Array;

  constructor(
    options: TerrainOptions = { size: { width: 10, height: 10, channels: 1 } }
  ) {
    this.size = options.size;
    this.data = options.data
      ? new Uint8Array(options.data)
      : new Uint8Array(this.size.width * this.size.height);

    if (!options.data) {
      this.data.fill(1);
    }
  }

  getCell(pos: Position): number {
    return this.data[this.getCellIndex(pos)];
  }

  setCell(pos: Position, val: number): void {
    const index = this.getCellIndex(pos);
    this.data[index] = val;
  }

  getCellIndex({ x, y }: Position) {
    return y * this.size.width + x;
  }

  getCellPosition(index: number) {
    const y = Math.floor(index / this.size.width);
    return { x: index - y, y };
  }

  distance(from: Position, to: Position) {
    return squaredDistance(from, to);
  }

  isAdjacent(a: Position, b: Position): boolean {
    return areAdjacent(a, b);
  }

  adjacentCells(cell: Position): Position[] {
    return getAdjacentPositions(cell, this.size);
  }

  moveScore(pos1: Position, pos2: Position, target: Position): number {
    const factor1 = this.getCell(pos1),
      factor2 = this.getCell(pos2);
    const diff =
      this.distance(pos1, target) * factor1 -
      this.distance(pos2, target) * factor2;
    if (diff !== 0) {
      return diff;
    }

    return factor1 - factor2;
  }

  pickNextMove(possibles: Position[], target: Position) {
    let found = possibles[0];
    for (let i = 1, imax = possibles.length; i < imax; i++) {
      if (this.moveScore(found, possibles[i], target) > 0) {
        found = possibles[i];
      }
    }

    return found;
  }

  async path(from: Position, to: Position): Promise<number[][]> {
    if (this.getCell(to) === 0) {
      return [];
    }

    const destIndex = this.getCellIndex(to);
    const dijkstra = async (
      cellIndex: number,
      path: number[]
    ): Promise<number[][]> => {
      const cell = this.getCellPosition(cellIndex);
      if (this.distance(cell, to) === 1) {
        return [[...path, destIndex]];
      }

      let children = this.adjacentCells(cell)
        .sort((a, b) => {
          const diff = this.distance(a, to) - this.distance(b, to);
          if (diff !== 0) {
            return diff;
          }

          return this.getCell(a) - this.getCell(b);
        })
        .map((current) => this.getCellIndex(current))
        .filter((current) => !path.includes(current));

      return (
        await Promise.all(
          children.map((current) => dijkstra(current, [...path, current]))
        )
      ).flat();
    };

    const cellIndex = this.getCellIndex(from);
    return []; //await dijkstra(cellIndex, [cellIndex]);
  }
}
