import * as fs from 'fs';

export interface Coordinate {
  x: number;
  y: number;
}

export interface CoordinateWithValue {
  x: number;
  y: number;
  value: string;
}

export interface ThreeDCoordinate {
  x: number;
  y: number;
  z: number;
}

export function getFileByLinesSync(filePath: string): string[] {
  const data = fs.readFileSync(filePath, 'utf8');
  return data.split('\n');
}

/**
 * Returned grid will be accessed (y, x) as y is the number of lines and x is the length of those lines; 0, 0 is top left of screen
 */
export function create2DGridFromLines(lines: string[], separator: string): string[][] {
  return lines.map((line) => line.split(separator));
}

/**
 *
 * Takes yxMap and returns an xyMap; requires a sqare map as written
 */
export function invert2DGrid<T>(yxMap: T[][]): T[][] {
  const xyMap: T[][] = [];
  for (let x = 0; x < yxMap[0].length; x++) {
    xyMap.push([]);
    for (let y = 0; y < yxMap.length; y++) {
      xyMap[x].push(yxMap[y][x]);
    }
  }

  return xyMap;
}

//  This "should" work with xy or yxGrid, but the comments assume xyGrid
export function get8AdjacentCoordinates(xyGrid: string[][], coordinate: Coordinate): CoordinateWithValue[] {
  const coordinates: CoordinateWithValue[] = [];
  const { x, y } = coordinate;

  if (y > 0) {
    // top
    coordinates.push({ value: xyGrid[x][y - 1], x: x, y: y - 1 });

    if (x > 0) {
      // top left
      coordinates.push({ value: xyGrid[x - 1][y - 1], x: x - 1, y: y - 1 });
    }

    if (x < xyGrid.length - 1) {
      // top right
      coordinates.push({ value: xyGrid[x + 1][y - 1], x: x + 1, y: y - 1 });
    }
  }

  if (x > 0) {
    // left
    coordinates.push({ value: xyGrid[x - 1][y], x: x - 1, y: y });
  }

  if (x < xyGrid.length - 1) {
    // right
    coordinates.push({ value: xyGrid[x + 1][y], x: x + 1, y: y });
  }

  if (y < xyGrid[0].length - 1) {
    // bottom
    coordinates.push({ value: xyGrid[x][y + 1], x: x, y: y + 1 });

    if (x > 0) {
      // bottom left
      coordinates.push({ value: xyGrid[x - 1][y + 1], x: x - 1, y: y + 1 });
    }

    if (x < xyGrid.length - 1) {
      // bottom right
      coordinates.push({ value: xyGrid[x + 1][y + 1], x: x + 1, y: y + 1 });
    }
  }

  return coordinates;
}

export function isOutOfXYGrid(xyGrid: string[][], coordinate: Coordinate): boolean {
  return coordinate.x < 0 || coordinate.x >= xyGrid.length || coordinate.y < 0 || coordinate.y >= xyGrid[0].length;
}

export function stringifyCoordnate(coordinate: Coordinate): string {
  return `${coordinate.x},${coordinate.y}`;
}

export function createSymbolToCoordinatesMap(yxMap: string[][], symbolsToIgnore = ['.']): Map<string, Coordinate[]> {
  const map = new Map<string, Coordinate[]>();
  for (let y = 0; y < yxMap.length; y++) {
    for (let x = 0; x < yxMap[y].length; x++) {
      const currentSymbol = yxMap[y][x];
      if (!symbolsToIgnore.includes(currentSymbol)) {
        if (!map.has(currentSymbol)) {
          map.set(currentSymbol, [{ x, y }]);
        } else {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          map.set(currentSymbol, [...map.get(currentSymbol)!, { x, y }]);
        }
      }
    }
  }
  return map;
}

export function sumArray(numArray: number[]): number {
  return numArray.reduce((prev, curr) => prev + curr, 0);
}
export function multiplyArray(numArray: number[]): number {
  return numArray.reduce((prev, curr) => prev * curr, 1);
}

export function throwErrorOnAssertion(assertedValue: boolean, assertedCondition = ''): void {
  if (!assertedValue) {
    throw new Error(`Assertion failed: ${assertedCondition}`);
  }
}

export function parseIntUpToChar(stringToParse: string, characterToStopAt: string): number {
  if (characterToStopAt === '') {
    return parseInt(stringToParse);
  }
  const indexOfChar = stringToParse.indexOf(characterToStopAt);
  return parseInt(stringToParse.substring(0, indexOfChar));
}

/**
 * Graph with vertex type identifier V and connections to each V of type V[]
 * Example: string means we identify the vertices as strings and the connections to the vertices with the string[]
 */
export class Graph<V extends string | number | symbol> {
  constructor(private connections: Record<V, V[]> = {} as Record<V, V[]>) {}

  addConnection(start: V, end: V): void {
    if (!this.connections[start]) {
      this.connections[start] = [];
    }
    this.connections[start].push(end);
    if (!this.connections[end]) {
      this.connections[end] = [];
    }
    this.connections[end].push(start);
  }

  getConnectionsToVertex(vertex: V): V[] | undefined {
    return this.connections[vertex];
  }

  getVertices(): string[] {
    return Object.keys(this.connections);
  }
}
