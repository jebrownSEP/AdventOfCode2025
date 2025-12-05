import { getFileByLinesSync, sumArray } from '../shared/utils';

export function part1(freshRanges: string[], ingredients: string[]): number {
  const rangeObjs = freshRanges.map((range) => {
    const splitted = range.split('-');
    return { start: +splitted[0], end: +splitted[1] };
  });

  const freshIngredients: number[] = [];

  ingredients.forEach((ingredient) => {
    if (rangeObjs.some((range) => +ingredient >= range.start && +ingredient <= range.end)) {
      freshIngredients.push(+ingredient);
    }
  });

  console.info(freshIngredients);
  return freshIngredients.length;
}

// export function part2(banks: number[][]): number {

// }

function main(): void {
  const lines = getFileByLinesSync('./day5/simpleInput.txt');
  // const lines = getFileByLinesSync('./day5/input.txt');

  const blankIndex = lines.indexOf('');
  const freshRanges = lines.slice(0, blankIndex);
  const ingredients = lines.slice(blankIndex + 1);

  console.info(part1(freshRanges, ingredients));
  // console.info(part2(freshRanges, ingredients)));
}

main();
