import { throwErrorOnAssertion, getFileByLinesSync, sumArray } from '../shared/utils';

export function part1(rotations: string[]): number {
  let position = 50;
  const rotatedPositions = [position];
  rotations.forEach((rotation) => {
    let movement = parseInt(rotation.substring(1), 10);

    while (movement > 100) {
      movement -= 100;
    }

    if (rotation.startsWith('L')) {
      position = position - movement;
    } else if (rotation.startsWith('R')) {
      position = position + movement;
    } else {
      throw new Error('Invalid diretion ' + rotation);
    }

    if (position > 99) {
      position = position - 100;
    } else if (position < 0) {
      position = position + 100;
    }

    rotatedPositions.push(position);
  });

  console.info(rotatedPositions);

  const zeroPositions = rotatedPositions.filter((pos) => pos === 0);
  return zeroPositions.length;
}

export function part2(rotations: string[]): number {
  let position = 50;

  let numberOfZeroPositions = 0;

  rotations.forEach((rotation) => {
    let movement = parseInt(rotation.substring(1), 10);

    while (movement > 0) {
      if (rotation.startsWith('L')) {
        position = position - 1;
      } else if (rotation.startsWith('R')) {
        position = position + 1;
      } else {
        throw new Error('Invalid direction ' + rotation);
      }
      movement -= 1;

      if (position > 99) {
        position = position - 100;
      } else if (position < 0) {
        position = position + 100;
      }

      if (position === 0) {
        numberOfZeroPositions += 1;
      }
    }
  });

  return numberOfZeroPositions;
}

function main(): void {
  // const lines = getFileByLinesSync('./day1/simpleInput.txt');
  const lines = getFileByLinesSync('./day1/input.txt');
  // console.info(part1(lines));
  console.info(part2(lines));
}

main();

// TODO: 5984 is too high
// 5502 is too low
