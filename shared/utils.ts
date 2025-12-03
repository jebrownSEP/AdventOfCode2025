import * as fs from 'fs';

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
 * Takes yxMap and returns an xyMap; requires a sqaure map as written
 */
export function invert2DGrid(yxMap: string[][]): string[][] {
  const xyMap: string[][] = [];
  for (let x = 0; x < yxMap[0].length; x++) {
    xyMap.push([]);
    for (let y = 0; y < yxMap.length; y++) {
      xyMap[x].push(yxMap[y][x]);
    }
  }

  return xyMap;
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

export interface Coordinate {
  x: number;
  y: number;
}

export interface ThreeDCoordinate {
  x: number;
  y: number;
  z: number;
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
