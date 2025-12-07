import { Coordinate, create2DGridFromLines, getFileByLinesSync, invert2DGrid, isOutOfXYGrid } from '../shared/utils';

export function part1(xyGrid: string[][], startCoordinate: Coordinate): number {
  const queue: Coordinate[] = [startCoordinate];
  const visitedSplits: Coordinate[] = [];

  let splitCount = 0;
  while (queue.length > 0) {
    const currentCoordinate = queue.shift() as Coordinate;
    if (isOutOfXYGrid(xyGrid, currentCoordinate)) {
      continue;
    }
    if (xyGrid[currentCoordinate.x][currentCoordinate.y] === '^') {
      if (!visitedSplits.some((coord) => coord.x === currentCoordinate.x && coord.y === currentCoordinate.y)) {
        splitCount += 1;
        visitedSplits.push(currentCoordinate);
      }
      console.info(`x: ${currentCoordinate.x} y: ${currentCoordinate.y}`);
      if (!queue.some((coord) => coord.x === currentCoordinate.x - 1 && coord.y === currentCoordinate.y)) {
        queue.push({ x: currentCoordinate.x - 1, y: currentCoordinate.y });
      }
      if (!queue.some((coord) => coord.x === currentCoordinate.x + 1 && coord.y === currentCoordinate.y)) {
        queue.push({ x: currentCoordinate.x + 1, y: currentCoordinate.y });
      }
    } else {
      if (!queue.some((coord) => coord.x === currentCoordinate.x && coord.y === currentCoordinate.y + 1)) {
        queue.push({ x: currentCoordinate.x, y: currentCoordinate.y + 1 });
      }
    }
  }

  return splitCount;
}

// export function part2(freshRanges: string[], _ingredients: string[]): number {

// }

function main(): void {
  // const lines = getFileByLinesSync('./day7/simpleInput.txt');
  const lines = getFileByLinesSync('./day7/input.txt');

  const yxGrid = create2DGridFromLines(lines, '');

  const startX = yxGrid[0].indexOf('S');
  const startCoordinate: Coordinate = { x: startX, y: 0 };

  const xyGrid = invert2DGrid(yxGrid);
  console.info(part1(xyGrid, startCoordinate));
  // console.info(part2(freshRanges, ingredients));
}

main();
