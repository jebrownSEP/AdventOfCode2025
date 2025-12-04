import { Coordinate, create2DGridFromLines, get8AdjacentCoordinates, getFileByLinesSync, invert2DGrid, sumArray } from '../shared/utils';

export function part1(xyGrid: string[][]): number {
  const accessibleRollCoords: Coordinate[] = [];

  for (let x = 0; x < xyGrid.length; x++) {
    for (let y = 0; y < xyGrid[x].length; y++) {
      if (xyGrid[x][y] === '@') {
        const adjCoordinates = get8AdjacentCoordinates(xyGrid, { x, y });
        const adjRolls = adjCoordinates.filter((coord) => coord.value === '@');
        if (adjRolls.length < 4) {
          accessibleRollCoords.push({ x, y });
        }
      }
    }
  }
  return accessibleRollCoords.length;
}

// export function part2(banks: number[][]): number {}

function main(): void {
  // const lines = getFileByLinesSync('./day4/simpleInput.txt');
  const lines = getFileByLinesSync('./day4/input.txt');

  const xyGrid = invert2DGrid(create2DGridFromLines(lines, ''));

  console.info(part1(xyGrid));
  // console.info(part2(banks));
}

main();
