import { getFileByLinesSync, sumArray } from '../shared/utils';

interface Requirement {
  indicatorLight: string;
  buttons: number[][];
  joltage: string;
}

function togglePosition(singleLight: string): string {
  if (singleLight === '.') {
    return '#';
  }
  return '.';
}

function togglePositions(light: string, positionsToToggle: number[]): string {
  const changedLight = light.split('');
  positionsToToggle.forEach((pos) => {
    changedLight[pos] = togglePosition(changedLight[pos]);
  });

  return changedLight.join('');
}

function getFewestPresses(requirement: Requirement): number {
  const { indicatorLight, buttons } = requirement;
  const queue: { light: string; steps: number }[] = [{ light: '.'.repeat(indicatorLight.length), steps: 0 }];
  const visitedConfigs = new Set<string>();

  let currentLight: { light: string; steps: number } | undefined;
  do {
    console.info(queue.length);
    currentLight = queue.shift();

    buttons.forEach((buttonGroup) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      if (!visitedConfigs.has(`${currentLight!.light},${buttonGroup.join(',')}`)) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        queue.push({ light: togglePositions(currentLight!.light, buttonGroup), steps: currentLight!.steps + 1 });
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        visitedConfigs.add(`${currentLight!.light},${buttonGroup.join(',')}`);
      }
    });
  } while (currentLight && currentLight.light !== indicatorLight);

  return currentLight?.steps ?? Infinity;
}

export function part1(requirements: Requirement[]): number {
  const fewestPresses = requirements.map((req) => getFewestPresses(req));

  console.info(fewestPresses);
  return sumArray(fewestPresses);
}

// export function part2(freshRanges: string[], _ingredients: string[]): number {

// }

function main(): void {
  // const lines = getFileByLinesSync('./day10/simpleInput.txt');
  const lines = getFileByLinesSync('./day10/input.txt');

  const requirements: Requirement[] = lines.map((line) => {
    const splitLine = line.split(' ');
    const lightIndicator = splitLine[0];
    const joltage = splitLine[splitLine.length - 1];
    const buttons = splitLine.slice(1, splitLine.length - 1);

    return {
      indicatorLight: lightIndicator.substring(1, lightIndicator.length - 1),
      buttons: buttons.map((buttonStr) => {
        return buttonStr
          .substring(1, buttonStr.length - 1)
          .split(',')
          .map((val) => +val);
      }),
      joltage: joltage,
    };
  });

  // console.info(JSON.stringify(requirements, null, 2));

  console.info(part1(requirements));
  // console.info(part2(freshRanges, ingredients));
}

main();
