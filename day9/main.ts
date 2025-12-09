import { Coordinate, getFileByLinesSync, getPairsOfValueOrderAgnostic, PairOfTWithValue } from '../shared/utils';

function getLargestAreaPairs(coordinates: Coordinate[]): PairOfTWithValue<Coordinate>[] {
  const allPairs = getPairsOfValueOrderAgnostic(coordinates);

  const orderedPairsByArea: PairOfTWithValue<Coordinate>[] = allPairs
    .map(([coordinate1, coordinate2]) => {
      const area = (Math.abs(coordinate1.x - coordinate2.x) + 1) * (Math.abs(coordinate1.y - coordinate2.y) + 1);
      return { coordinate1, coordinate2, value: area };
    })
    .sort(({ value: area1 }, { value: area2 }) => area2 - area1);

  return orderedPairsByArea;
}

export function part1(coordinates: Coordinate[]): number {
  const largestAreaPairs = getLargestAreaPairs(coordinates);

  console.info(largestAreaPairs);
  return largestAreaPairs[0].value;
}

function main(): void {
  // const lines = getFileByLinesSync('./day9/simpleInput.txt');
  const lines = getFileByLinesSync('./day9/input.txt');

  const coordinates: Coordinate[] = lines.map((line) => {
    const [x, y] = line.split(',');
    return { x: +x, y: +y };
  });

  console.info(part1(coordinates));
  // console.info(part2(junction3DCoordinates));
}

main();
