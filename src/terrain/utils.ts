import { Position, Size } from "./types";

export function areEqual(a: Position, b: Position): boolean {
  return a.x === b.x && a.y === b.y;
}

export function areAdjacent(a: Position, b: Position): boolean {
  return chebyshevDistance(a, b) === 1;
}

export function distance(a: Position, b: Position): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

export function squaredDistance(a: Position, b: Position): number {
  return (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
}

export function manhattanDistance(a: Position, b: Position): number {
  return a.x - b.x + (a.y - b.y);
}

export function chebyshevDistance(a: Position, b: Position): number {
  return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
}

export function updateAdjacentPositions(
  result: Position[],
  pos: Position,
  grid: Size
): number {
  while (result.length < 8) {
    result.push({ x: -1, y: -1 });
  }

  let index = 0;
  if (pos.y > 0) {
    if (pos.x > 0) {
      result[index].x = pos.x - 1;
      result[index].y = pos.y - 1;
      index++;
    }

    result[index].x = pos.x;
    result[index].y = pos.y - 1;
    index++;

    if (pos.x < grid.width - 1) {
      result[index].x = pos.x + 1;
      result[index].y = pos.y - 1;
      index++;
    }
  }

  if (pos.x > 0) {
    result[index].x = pos.x - 1;
    result[index].y = pos.y;
    index++;
  }

  if (pos.x < grid.width - 1) {
    result[index].x = pos.x + 1;
    result[index].y = pos.y;
    index++;
  }

  if (pos.y < grid.height - 1) {
    if (pos.x > 0) {
      result[index].x = pos.x - 1;
      result[index].y = pos.y + 1;
      index++;
    }

    result[index].x = pos.x;
    result[index].y = pos.y + 1;
    index++;

    if (pos.x < grid.width - 1) {
      result[index].x = pos.x + 1;
      result[index].y = pos.y + 1;
      index++;
    }
  }

  return index;
}

export function getAdjacentPositions(pos: Position, grid: Size): Position[] {
  const result: Position[] = [];
  const size = updateAdjacentPositions(result, pos, grid);

  return result.slice(0, size);
}
