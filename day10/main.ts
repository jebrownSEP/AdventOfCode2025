import { getFileByLinesSync, sumArray } from '../shared/utils';

interface Requirement {
  indicatorLight: string;
  buttons: number[][];
  joltages: number[];
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

function getFewestPressesForLights(requirement: Requirement): number {
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
  const fewestPresses = requirements.map((req) => getFewestPressesForLights(req));

  console.info(fewestPresses);
  return sumArray(fewestPresses);
}

function getFewestPressesForJoltages(requirement: Requirement): number {
  // eslint-disable-next-line prefer-const
  let { buttons, joltages } = requirement;
  buttons = buttons.sort((a, b) => b.length - a.length);
  const queue: { joltages: number[]; steps: number }[] = [{ joltages: joltages.map((_) => 0), steps: 0 }];
  // const visitedConfigs = new Set<string>();

  let currentJoltage: { joltages: number[]; steps: number } | undefined;
  do {
    console.info(queue.length);
    currentJoltage = queue.shift();

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (currentJoltage!.joltages.some((joltage, index) => joltage > requirement.joltages[index])) {
      continue;
    }

    buttons.forEach((buttonGroup) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      // if (!visitedConfigs.has(`${currentJoltage!.light},${buttonGroup.join(',')}`)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const updatedJoltages = [...currentJoltage!.joltages];
      buttonGroup.forEach((buttonIndex) => {
        updatedJoltages[buttonIndex] = updatedJoltages[buttonIndex] + 1;
      });
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      queue.push({ joltages: updatedJoltages, steps: currentJoltage!.steps + 1 });
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      // visitedConfigs.add(`${currentJoltage!.light},${buttonGroup.join(',')}`);
      // }
    });
  } while (currentJoltage && !currentJoltage.joltages.every((joltage, index) => joltage === requirement.joltages[index]));

  return currentJoltage?.steps ?? Infinity;
}

export function part2(requirements: Requirement[]): number {
  const fewestPresses = requirements.map((req) => getFewestPressesForJoltages(req));

  console.info(fewestPresses);
  return sumArray(fewestPresses);
}

function main(): void {
  const lines = getFileByLinesSync('./day10/simpleInput.txt');
  // const lines = getFileByLinesSync('./day10/input.txt');

  const requirements: Requirement[] = lines.map((line) => {
    const splitLine = line.split(' ');
    const lightIndicator = splitLine[0];
    const joltages = splitLine[splitLine.length - 1];
    const buttons = splitLine.slice(1, splitLine.length - 1);

    return {
      indicatorLight: lightIndicator.substring(1, lightIndicator.length - 1),
      buttons: buttons.map((buttonStr) => {
        return buttonStr
          .substring(1, buttonStr.length - 1)
          .split(',')
          .map((val) => +val);
      }),
      joltages: joltages
        .substring(1, joltages.length - 1)
        .split(',')
        .map((val) => +val),
    };
  });

  // console.info(JSON.stringify(requirements, null, 2));

  // console.info(part1(requirements));
  console.info(part2(requirements));
}

main();
