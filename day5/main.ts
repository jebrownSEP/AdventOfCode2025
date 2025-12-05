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

export function part2Old(freshRanges: string[], _ingredients: string[]): number {
  const rangeObjs = freshRanges.map((range) => {
    const splitted = range.split('-');
    return { start: +splitted[0], end: +splitted[1] };
  });

  const freshIngredientsSet = new Set<number>();

  rangeObjs.forEach(({ start, end }) => {
    for (let i = start; i <= end; i++) {
      freshIngredientsSet.add(i);
    }
  });
  return freshIngredientsSet.size;
}

interface Range {
  start: number;
  end: number;
}

function combineRanges(range1: Range, range2: Range): Range {
  const sorted = [range1.start, range1.end, range2.start, range2.end].sort();

  return { start: sorted[0], end: sorted[sorted.length - 1] };
}

export function part2(freshRanges: string[], _ingredients: string[]): number {
  const rangeObjs = freshRanges.map((range) => {
    const splitted = range.split('-');
    return { start: +splitted[0], end: +splitted[1] };
  });

  const checkedRanges: (Range | null)[] = [];

  rangeObjs.forEach((rangeObj) => {
    let currentRange = rangeObj;
    for (let i = 0; i < checkedRanges.length; i++) {
      const checked = checkedRanges[i];
      // overlap
      if (checked !== null && !(currentRange.end < checked.start || currentRange.start > checked.end)) {
        const combinedRange = combineRanges(currentRange, checked);
        checkedRanges[i] = null;
        currentRange = combinedRange;
      }
    }
    checkedRanges.push(currentRange);
  });

  console.info(checkedRanges);

  return checkedRanges.filter((range) => range !== null).reduce((total, currentRange) => currentRange.end - currentRange.start + 1 + total, 0);
}

function main(): void {
  // const lines = getFileByLinesSync('./day5/simpleInput.txt');
  const lines = getFileByLinesSync('./day5/input.txt');

  const blankIndex = lines.indexOf('');
  const freshRanges = lines.slice(0, blankIndex);
  const ingredients = lines.slice(blankIndex + 1);

  // console.info(part1(freshRanges, ingredients));
  console.info(part2(freshRanges, ingredients));
}

main();
