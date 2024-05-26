import TerrainController from "./TerrainController";
import { Position } from "./types";
import {
  areEqual,
  chebyshevDistance,
  getAdjacentPositions,
  squaredDistance,
  updateAdjacentPositions,
} from "./utils";

export interface IPathFinder {
  cost: (terrain: TerrainController, pos: Position) => number;
  distance: (
    terrain: TerrainController,
    from: Position,
    to: Position
  ) => number;
}

export default class PathFinder implements IPathFinder {
  cost: (terrain: TerrainController, pos: Position) => number;
  distance: (
    terrain: TerrainController,
    from: Position,
    to: Position
  ) => number;

  constructor(_: Partial<IPathFinder>) {
    this.cost = (terrain: TerrainController, pos: Position) => {
      const cost = terrain.getCell(pos)[0];
      return cost !== 0 ? cost : 255;
    };
    this.distance = (_: TerrainController, from: Position, to: Position) =>
      chebyshevDistance(from, to) ** 2;
  }

  score(distance: number, cost: number) {
    return distance * cost;
  }

  getPath(terrain: TerrainController, from: Position, to: Position) {
    const fromIndex = terrain.getGridIndex(from);
    const destinationIndex = terrain.getGridIndex(to);
    const done = new Map<number, Position>();
    const todo: number[] = [fromIndex];
    const path: number[] = [];

    while (todo.length) {
      const current = todo.pop()!;
      path.push(current);
      done.set(current, terrain.getGridPosition(current));
      if (current === destinationIndex) {
        return path;
      }

      const children = getAdjacentPositions(
        terrain.getGridPosition(current),
        terrain.size
      );

      let batch: [number, Position, number, number][] = [];
      for (let child of children) {
        const childIndex = terrain.getGridIndex(child);
        if (done.has(childIndex) || todo.includes(childIndex)) {
          continue;
        }

        batch.push([
          childIndex,
          child,
          this.distance(terrain, child, to),
          this.cost(terrain, child),
        ]);
      }

      if (batch.length === 0) {
        path.pop();
      }

      batch = batch.sort(
        (a, b) => this.score(b[2], b[3]) - this.score(a[2], a[3])
      );

      todo.push(...batch.map((a) => a[0]));
    }

    return [];
  }
}
