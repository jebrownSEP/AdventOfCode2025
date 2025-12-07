import { create2DGridFromLines, getFileByLinesSync, invert2DGrid, multiplyArray, sumArray } from '../shared/utils';

export function part1(lines: string[]): number {
  const grid = create2DGridFromLines(lines, ' ').map((arrVal) => arrVal.filter((val) => val !== ''));

  const numbers = grid.slice(0, grid.length - 1).map((arrVal) => arrVal.map((val) => +val));
  const operators = grid.slice(grid.length - 1).flat();

  const numbersAligned = invert2DGrid(numbers);

  // console.info(numbersAligned);

  const results = operators.map((op, index) => {
    if (op === '+') {
      return sumArray(numbersAligned[index]);
    } else {
      return multiplyArray(numbersAligned[index]);
    }
  });
  console.info(results);
  return sumArray(results);
}

// export function part2(freshRanges: string[], _ingredients: string[]): number {

// }

function main(): void {
  // const lines = getFileByLinesSync('./day6/simpleInput.txt');
  const lines = getFileByLinesSync('./day6/input.txt');

  console.info(part1(lines));
  // console.info(part2(freshRanges, ingredients));
}

main();
