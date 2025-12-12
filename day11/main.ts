import { getFileByLinesSync, sumArray } from '../shared/utils';

export function part1(nodeMap: Map<string, string[]>): number {
  const pathsOutCountMap = new Map<string, number>();

  function getNumberPathsOut(currentNode: string): number {
    if (currentNode === 'out') {
      return 1;
    } else if (pathsOutCountMap.has(currentNode)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return pathsOutCountMap.get(currentNode)!;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const currentEndNodes = nodeMap.get(currentNode)!;

      const results = currentEndNodes.map((endNode) => {
        const result = getNumberPathsOut(endNode);
        pathsOutCountMap.set(endNode, result);
        return result;
      });
      const sum = sumArray(results);
      pathsOutCountMap.set(currentNode, sum);
      return sum;
    }
  }

  return getNumberPathsOut('you');
}

// export function part2(freshRanges: string[], _ingredients: string[]): number {

// }

function main(): void {
  // const lines = getFileByLinesSync('./day11/simpleInput.txt');
  const lines = getFileByLinesSync('./day11/input.txt');

  const nodeMap = new Map<string, string[]>();
  lines.forEach((line) => {
    const [node, list] = line.split(':');
    const endNodes = list.trim().split(' ');
    nodeMap.set(node, endNodes);
  });
  nodeMap.set('out', []);
  // console.info(nodeMap);

  console.info(part1(nodeMap));
  // console.info(part2(freshRanges, ingredients));
}

main();
