import { Coordinate, getFileByLinesSync, getPairsOfValueOrderAgnostic, PairOfTWithValue, stringifyCoordinate } from '../shared/utils';

// Globals

const PERIMETER_POINTS_SET: Set<string> = new Set();

const IS_IN_PERIMETER: Map<string, boolean> = new Map();

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

function getAllPointsBetweenExclusiveAtXOrY(coordinate1: Coordinate, coordinate2: Coordinate, xDirection?: boolean): Coordinate[] {
  if (xDirection === undefined) {
    xDirection = coordinate1.y === coordinate2.y;
  }

  const coordinatesBetween: Coordinate[] = [];

  if (xDirection) {
    const coord1ToCoord2 = coordinate2.x > coordinate1.x;
    let start: number;
    let end: number;
    if (coord1ToCoord2) {
      start = coordinate1.x + 1;
      end = coordinate2.x - 1;
    } else {
      start = coordinate2.x + 1;
      end = coordinate1.x - 1;
    }
    for (let i = start; i <= end; i++) {
      coordinatesBetween.push({ x: i, y: coordinate1.y });
    }
  } else {
    const coord1ToCoord2 = coordinate2.y > coordinate1.y;
    let start: number;
    let end: number;
    if (coord1ToCoord2) {
      start = coordinate1.y + 1;
      end = coordinate2.y - 1;
    } else {
      start = coordinate2.y + 1;
      end = coordinate1.y - 1;
    }
    for (let i = start; i <= end; i++) {
      coordinatesBetween.push({ y: i, x: coordinate1.x });
    }
  }

  return coordinatesBetween;
}

function populateGlobals(redCoords: Coordinate[]): void {
  // Loop through array once, then last and first.  Get all the green coordinates between.
  // For now, assume we do NOT need to fill in, and just need the edges.

  for (let i = 0; i < redCoords.length; i++) {
    const coord1 = redCoords[i];
    let coord2: Coordinate;
    if (i === redCoords.length - 1) {
      coord2 = redCoords[0];
    } else {
      coord2 = redCoords[i + 1];
    }
    PERIMETER_POINTS_SET.add(stringifyCoordinate(coord1));
    IS_IN_PERIMETER.set(stringifyCoordinate(coord1), true);

    let between;
    if (coord1.x === coord2.x) {
      between = getAllPointsBetweenExclusiveAtXOrY(coord1, coord2, false);
    } else {
      between = getAllPointsBetweenExclusiveAtXOrY(coord1, coord2, true);
    }
    between.forEach((coord) => {
      PERIMETER_POINTS_SET.add(stringifyCoordinate(coord));
      IS_IN_PERIMETER.set(stringifyCoordinate(coord), true);
    });
  }
}

function isWithinPerimeterIncludingEdge(coord: Coordinate): boolean {
  if (IS_IN_PERIMETER.has(stringifyCoordinate(coord))) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return IS_IN_PERIMETER.get(stringifyCoordinate(coord))!;
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const maxXCoord = Array.from(PERIMETER_POINTS_SET)
    .filter((perimCoord) => +perimCoord.split(',')[1] === coord.y)
    .map((perimCoordStr) => {
      const [x, y] = perimCoordStr.split(',');
      return { x: +x, y: +y } as Coordinate;
    })
    .sort((a, b) => b.x - a.x)[0]!;

  // Ray casting method
  // if arbitrary array from coord to edge
  // if odd intersections, inside, else outside

  // For easy test, just go right from coord
  const rayPoints = [coord, ...getAllPointsBetweenExclusiveAtXOrY(coord, { x: maxXCoord.x, y: coord.y }, true), { x: maxXCoord.x, y: coord.y }];

  const intersections = rayPoints.filter(
    (rayCoord) =>
      PERIMETER_POINTS_SET.has(stringifyCoordinate(rayCoord)) && PERIMETER_POINTS_SET.has(stringifyCoordinate({ x: rayCoord.x, y: rayCoord.y + 1 })),
  );

  const result = intersections.length % 2 !== 0;

  IS_IN_PERIMETER.set(stringifyCoordinate(coord), result);

  return result;
}

function getPerimeterPointsOfRectangleWithCornersInclusive(coord1: Coordinate, coord2: Coordinate): Coordinate[] {
  const maxX = Math.max(coord1.x, coord2.x);
  const maxY = Math.max(coord1.y, coord2.y);
  const minX = Math.min(coord1.x, coord2.x);
  const minY = Math.min(coord1.y, coord2.y);

  const topLeft = { x: minX, y: minY };
  const topRight = { x: maxX, y: minY };
  const bottomLeft = { x: minX, y: maxY };
  const bottomRight = { x: maxX, y: maxY };

  return [
    topLeft,
    ...getAllPointsBetweenExclusiveAtXOrY(topLeft, topRight),
    topRight,
    ...getAllPointsBetweenExclusiveAtXOrY(topLeft, bottomRight),
    bottomRight,
    bottomLeft,
    ...getAllPointsBetweenExclusiveAtXOrY(bottomLeft, topRight),
    ...getAllPointsBetweenExclusiveAtXOrY(bottomLeft, bottomRight),
  ];
}

function containsOnlyRedAndGreen(pairWithArea: PairOfTWithValue<Coordinate>): boolean {
  const { coordinate1, coordinate2 } = pairWithArea;

  // if (coordinate1.x === 83876 && coordinate1.y === 85247 && coordinate2.x === 16919 && coordinate2.y === 14055) {
  //   console.info('here');
  // }

  const maxX = Math.max(coordinate1.x, coordinate2.x);
  const maxY = Math.max(coordinate1.y, coordinate2.y);
  const minX = Math.min(coordinate1.x, coordinate2.x);
  const minY = Math.min(coordinate1.y, coordinate2.y);

  const topLeft = { x: minX, y: minY };
  const topRight = { x: maxX, y: minY };
  const bottomLeft = { x: minX, y: maxY };
  const bottomRight = { x: maxX, y: maxY };

  if ([topLeft, topRight, bottomLeft, bottomRight].some((point) => !isWithinPerimeterIncludingEdge(point))) {
    return false;
  }

  // // make a smaller square and check its corners
  // const smallTopLeft = { x: minX + 1, y: minY + 1 };
  // const smallTopRight = { x: maxX - 1, y: minY + 1 };
  // const smallBottomLeft = { x: minX + 1, y: maxY - 1 };
  // const smallBottomRight = { x: maxX - 1, y: maxY - 1 };

  // return [smallTopLeft, smallTopRight, smallBottomLeft, smallBottomRight].every((point) => isInPerimeterIncludingEdge(point));

  // TODO: this didn't work, too many points to check
  const innerPerimeterPoints: Coordinate[] = getPerimeterPointsOfRectangleWithCornersInclusive(coordinate1, coordinate2);

  return innerPerimeterPoints.every((point) => isWithinPerimeterIncludingEdge(point));
}

export function part2(coordinates: Coordinate[]): number {
  const largestAreaPairs = getLargestAreaPairs(coordinates);

  populateGlobals(coordinates);

  const pairsLength = largestAreaPairs.length;

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const firstOnlyRedAndGreen = largestAreaPairs.find((pairWithArea, index) => {
    // TEMP
    if (index < 546) {
      return false;
    }
    console.info(`${index} of ${pairsLength}`);
    return containsOnlyRedAndGreen(pairWithArea);
  })!;

  console.info(firstOnlyRedAndGreen);
  return firstOnlyRedAndGreen.value;
}

function main(): void {
  // const lines = getFileByLinesSync('./day9/simpleInput.txt');
  const lines = getFileByLinesSync('./day9/input.txt');

  const coordinates: Coordinate[] = lines.map((line) => {
    const [x, y] = line.split(',');
    return { x: +x, y: +y };
  });

  // console.info(part1(coordinates));
  console.info(part2(coordinates));
}

main();
