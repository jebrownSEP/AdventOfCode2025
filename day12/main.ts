import { getFileByLinesSync, sumArray } from '../shared/utils';

interface Region {
  x: number;
  y: number;
  numberOfShapes: number[];
}

// interface Shape {

// }

function isPossible(region: Region, shapes: string[][]): boolean {
  const area = region.x * region.y;

  const shapesToAdd = region.numberOfShapes;

  let shapesArea = 0;
  shapes.forEach((shape, index) => {
    const shapeArea = sumArray(shape.map((shapeLine) => shapeLine.split('').filter((char) => char === '#').length));
    shapesArea += shapeArea * shapesToAdd[index];
  });

  return shapesArea <= area;
}

export function part1(shapes: string[][], regions: Region[]): number {
  const possibleRegions = regions.map((region) => isPossible(region, shapes)).filter((poss) => poss);

  return possibleRegions.length;
}

function main(): void {
  // const lines = getFileByLinesSync('./day12/simpleInput.txt');
  const lines = getFileByLinesSync('./day12/input.txt');

  const breaks = lines.map((line, index) => (line === '' ? index : null)).filter((line) => line !== null);
  console.info('breaks', breaks);

  const shapes: string[][] = [];

  let previousBreakIndex = 1;
  breaks.forEach((breakIndex) => {
    const shape: string[] = [];
    for (let i = previousBreakIndex; i < breakIndex; i++) {
      shape.push(lines[i]);
    }
    previousBreakIndex = breakIndex + 2;
    shapes.push(shape);
  });

  console.info('shapes', shapes);

  const regions: Region[] = [];

  for (let i = breaks[breaks.length - 1] + 1; i < lines.length; i++) {
    const parts = lines[i].split(' ');
    const [x, y] = parts[0].substring(0, parts[0].length - 1).split('x');

    const shapeNumbers = parts.slice(1).map((num) => +num);

    regions.push({ x: +x, y: +y, numberOfShapes: shapeNumbers });
  }

  console.info('regions', regions);

  console.info(part1(shapes, regions));
  // console.info(part2(freshRanges, ingredients));
}

main();
