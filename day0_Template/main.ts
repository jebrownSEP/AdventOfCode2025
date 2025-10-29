import { throwErrorOnAssertion, getFileByLinesSync, create2DGridFromLines, invert2DGrid, sumArray } from '../shared/utils';

function getDistances(sortedLists: number[][]): number[] {
  const distances: number[] = [];
  sortedLists[0].forEach((_, index) => distances.push(Math.abs(sortedLists[0][index] - sortedLists[1][index])));
  return distances;
}

export function countInList(value: number, listToCountIn: number[]): number {
  return listToCountIn.filter((val) => val === value).length;
}

export function getSimilarityScore(value: number, numberOfTimesAppeared: number): number {
  return value * numberOfTimesAppeared;
}

export function part1(lists: number[][]): number {
  throwErrorOnAssertion(lists.length === 2, 'lists.length === 2');
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  throwErrorOnAssertion(lists[0]!.length === lists[1]!.length, 'lengths of lists are same');

  const sortedLists = lists.map((list) => list.sort());

  const distances = getDistances(sortedLists);
  const totalDistances = sumArray(distances);
  return totalDistances;
}

export function part2(lists: number[][]): number {
  throwErrorOnAssertion(lists.length === 2, 'lists.length === 2');
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  throwErrorOnAssertion(lists[0]!.length === lists[1]!.length, 'lengths of lists are same');

  const similarityScores = lists[0].map((val) => getSimilarityScore(val, countInList(val, lists[1])));
  return sumArray(similarityScores);
}

function main(): void {
  //   const lines = getFileByLinesSync('./day1/simpleInput.txt');
  const lines = getFileByLinesSync('./day1/input.txt');
  const grid = create2DGridFromLines(lines, '   ');
  // create a list for each column
  const columns = invert2DGrid(grid);
  const numColumns = columns.map((column) => column.map((strVal) => parseInt(strVal, 10)));
  console.info(part1(numColumns));

  console.info(part2(numColumns));
}

main();
