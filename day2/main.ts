import { getFileByLinesSync } from '../shared/utils';

function getNextInvalidId(startSearchId: number): number {
  let currentSearchId = startSearchId;

  if (`${currentSearchId}`.length % 2 !== 0) {
    currentSearchId = 10 ** `${currentSearchId}`.length;
  }

  const firstHalf = +`${currentSearchId}`.substring(0, `${currentSearchId}`.length / 2);
  let nextInvalidId = +`${firstHalf}${firstHalf}`;
  if (nextInvalidId < startSearchId) {
    nextInvalidId = +`${firstHalf + 1}${firstHalf + 1}`;
  }
  return nextInvalidId;
}

export function part1(ranges: string[]): number {
  const invalidIds: number[] = [];

  for (const range of ranges) {
    const [rangeStart, rangeEnd] = range.split('-');

    let currentSearchId = +rangeStart;

    while (currentSearchId <= +rangeEnd) {
      const nextInvalidId = getNextInvalidId(currentSearchId);
      if (nextInvalidId > +rangeEnd) {
        break;
      }
      invalidIds.push(nextInvalidId);
      currentSearchId = nextInvalidId + 1;
    }
  }

  return invalidIds.reduce((a, b) => a + b);
}

// export function part2(rotations: string[]): number {
//   let position = 50;

//   let numberOfZeroPositions = 0;

//   rotations.forEach((rotation) => {
//     let movement = parseInt(rotation.substring(1), 10);

//     while (movement > 0) {
//       if (rotation.startsWith('L')) {
//         position = position - 1;
//       } else if (rotation.startsWith('R')) {
//         position = position + 1;
//       } else {
//         throw new Error('Invalid direction ' + rotation);
//       }
//       movement -= 1;

//       if (position > 99) {
//         position = position - 100;
//       } else if (position < 0) {
//         position = position + 100;
//       }

//       if (position === 0) {
//         numberOfZeroPositions += 1;
//       }
//     }
//   });

//   return numberOfZeroPositions;
// }

function main(): void {
  // const lines = getFileByLinesSync('./day2/simpleInput.txt');
  const lines = getFileByLinesSync('./day2/input.txt');

  // there is only one line
  if (lines.length > 1) {
    throw new Error('invalid input');
  }
  const ranges = lines[0].split(',');

  console.info(part1(ranges));
}

main();
