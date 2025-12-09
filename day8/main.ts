import {
  getEuclideanDistanceBetween3DCoordinates,
  getFileByLinesSync,
  multiplyArray,
  PairOfThreeDCoordinatesWithDistance,
  stringifyCoordinate3D,
  ThreeDCoordinate,
} from '../shared/utils';

function getClosestCoordinates(coordinates: ThreeDCoordinate[]): PairOfThreeDCoordinatesWithDistance[] {
  const allPairs: ThreeDCoordinate[][] = [];

  for (let i = 0; i < coordinates.length - 1; i++) {
    for (let j = i + 1; j < coordinates.length; j++) {
      allPairs.push([coordinates[i], coordinates[j]]);
    }
  }
  // console.info(allPairs.length);

  const orderedPairsByDistance = allPairs
    .map(([coordinate1, coordinate2]) => {
      const distance = getEuclideanDistanceBetween3DCoordinates(coordinate1, coordinate2);
      return { coordinate1, coordinate2, distance };
    })
    .sort(({ distance: distance1 }, { distance: distance2 }) => distance1 - distance2);

  return orderedPairsByDistance;
}

export function part1(junction3DCoordinates: ThreeDCoordinate[], connectionSteps: number): number {
  const closestPairs = getClosestCoordinates(junction3DCoordinates);
  // console.info(closestPairs);

  const circuits: Set<string>[] = junction3DCoordinates.map((coord) => new Set<string>([stringifyCoordinate3D(coord)]));

  for (let i = 0; i < connectionSteps; i++) {
    const { coordinate1, coordinate2 } = closestPairs[i];
    const circuit1Index = circuits.findIndex((circuit) => circuit.has(stringifyCoordinate3D(coordinate1)));
    const circuit2Index = circuits.findIndex((circuit) => circuit.has(stringifyCoordinate3D(coordinate2)));

    if (circuit1Index !== circuit2Index) {
      circuits[circuit1Index] = new Set<string>([...circuits[circuit1Index], ...circuits[circuit2Index]]);
      circuits[circuit2Index] = new Set<string>();
    }
  }
  const removedEmptySorted = circuits.filter((circuit) => circuit.size > 0).sort((setA, setB) => setB.size - setA.size);

  const top3Sizes = [removedEmptySorted[0].size, removedEmptySorted[1].size, removedEmptySorted[2].size];
  console.info(top3Sizes);
  return multiplyArray(top3Sizes);
}

// export function part2(freshRanges: string[], _ingredients: string[]): number {

// }

function main(): void {
  // const lines = getFileByLinesSync('./day8/simpleInput.txt');
  const lines = getFileByLinesSync('./day8/input.txt');

  const junction3DCoordinates: ThreeDCoordinate[] = lines.map((line) => {
    const [x, y, z] = line.split(',');
    return { x: +x, y: +y, z: +z };
  });

  console.info(part1(junction3DCoordinates, 1000));
  // console.info(part2(freshRanges, ingredients));
}

main();
