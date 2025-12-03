import { getFileByLinesSync, sumArray } from '../shared/utils';

// Didn't work
export function part1Old(banks: number[][]): number {
  const maxJoltages: number[] = [];

  banks.forEach((bank) => {
    const bankSorted = [...bank].sort().reverse();

    const battery1 = bankSorted[0];
    const battery2 = bankSorted[1];

    if (bank.indexOf(battery1) < bank.indexOf(battery2)) {
      maxJoltages.push(+`${battery1}${battery2}`);
    } else {
      maxJoltages.push(+`${battery2}${battery1}`);
    }
  });

  if (maxJoltages.length !== banks.length) {
    throw new Error('Invalid lengths');
  }

  console.info(maxJoltages);
  return sumArray(maxJoltages);
}

export function part1(banks: number[][]): number {
  const maxJoltages: number[] = [];

  banks.forEach((bank) => {
    let battery1 = -1;
    let indexOfBattery1 = -1;

    for (let i = 0; i < bank.length - 1; i++) {
      if (bank[i] > battery1) {
        battery1 = bank[i];
        indexOfBattery1 = i;
      }
    }
    if (battery1 === -1) {
      throw new Error('invalid battery1');
    }

    let battery2 = -1;

    for (let i = indexOfBattery1 + 1; i < bank.length; i++) {
      if (bank[i] > battery2) {
        battery2 = bank[i];
      }
    }
    if (battery2 === -1) {
      throw new Error('invalid battery2');
    }

    maxJoltages.push(+`${battery1}${battery2}`);
  });

  if (maxJoltages.length !== banks.length) {
    throw new Error('Invalid lengths');
  }

  console.info(maxJoltages);
  return sumArray(maxJoltages);
}

// export function part2(ranges: string[]): number {}

function main(): void {
  // const lines = getFileByLinesSync('./day3/simpleInput.txt');
  const lines = getFileByLinesSync('./day3/input.txt');

  const banks = lines.map((line) => line.split('').map((val) => +val));

  console.info(part1(banks));
  // console.info(part2(banks));
}

main();
