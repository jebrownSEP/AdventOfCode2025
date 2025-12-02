import { getFileByLinesSync } from '../shared/utils';

function getNextInvalidIdPart1(startSearchId: number): number {
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

function getNextInvalidIdPart2(startSearchId: number): number {
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

// Smallest will be 1, will not include the number itself
function getLargestDivisor(number: number): { largestDivisor: number; multiplier: number } {
  // Brute force to get divisor; can try better approach if see this is getting too large
  let i = 2;
  while (i < 100) {
    if (number % i === 0) {
      // console.info('getLargestDivisor', number, number / i, i);

      return { largestDivisor: number / i, multiplier: i };
    }
    i += 1;
  }

  throw new Error('could not find divisor ' + number);
}

function isInvalidId(searchId: number): boolean {
  const searchIdAsString = `${searchId}`;

  for (let numberOfParts = 2; numberOfParts <= searchIdAsString.length; numberOfParts++) {
    if (searchIdAsString.length % numberOfParts !== 0) {
      continue;
    }
    const partsLength = searchIdAsString.length / numberOfParts;
    const parts = [];
    for (let i = 0; i < searchIdAsString.length; i += partsLength) {
      parts.push(searchIdAsString.substring(i, i + partsLength));
    }

    if (parts.length > 0 && parts.every((part, _, partsArr) => part === partsArr[0])) {
      return true;
    }
  }

  return false;
}

export function part1(ranges: string[]): number {
  const invalidIds: number[] = [];

  for (const range of ranges) {
    const [rangeStart, rangeEnd] = range.split('-');

    let currentSearchId = +rangeStart;

    while (currentSearchId <= +rangeEnd) {
      const nextInvalidId = getNextInvalidIdPart1(currentSearchId);
      if (nextInvalidId > +rangeEnd) {
        break;
      }
      invalidIds.push(nextInvalidId);
      currentSearchId = nextInvalidId + 1;
    }
  }

  return invalidIds.reduce((a, b) => a + b, 0);
}

// This way didn't work
export function part2Old(ranges: string[]): number {
  const invalidIds: number[] = [];

  for (const range of ranges) {
    const [rangeStart, rangeEnd] = range.split('-');

    const tempInvalidIds: number[] = [];

    let currentSearchId = +rangeStart;
    let currentSearchLength = `${currentSearchId}`.length;

    let divisorObj = getLargestDivisor(currentSearchLength);

    while (currentSearchId <= +rangeEnd) {
      const part = +`${currentSearchId}`.substring(0, divisorObj.largestDivisor);
      const nextInvalidId = +`${part}`.repeat(divisorObj.multiplier);

      if (nextInvalidId > +rangeEnd) {
        break;
      }
      if (nextInvalidId >= currentSearchId) {
        tempInvalidIds.push(nextInvalidId);
      } else {
        // console.info('skipping');
      }
      if (currentSearchLength < `${nextInvalidId + 1}`.length) {
        currentSearchId = nextInvalidId + 1;
        currentSearchLength = `${currentSearchId}`.length;
        divisorObj = getLargestDivisor(currentSearchLength);
      } else {
        currentSearchId = +`${part + 1}`.repeat(divisorObj.multiplier);
        if (currentSearchLength !== `${currentSearchId}`.length) {
          // console.info(currentSearchId, nextInvalidId, divisorObj.largestDivisor, divisorObj.multiplier, part, temp);
          throw new Error('oops');
        }
      }
    }

    console.info(tempInvalidIds);
    invalidIds.push(...tempInvalidIds);
  }

  return invalidIds.reduce((a, b) => a + b, 0);
}

// This way worked with brute force
export function part2(ranges: string[]): number {
  const invalidIds: number[] = [];

  for (const range of ranges) {
    const [rangeStart, rangeEnd] = range.split('-');

    const tempInvalidIds: number[] = [];

    let currentSearchId = +rangeStart;

    while (currentSearchId <= +rangeEnd) {
      if (isInvalidId(currentSearchId)) {
        tempInvalidIds.push(currentSearchId);
      }
      currentSearchId += 1;
    }

    console.info(tempInvalidIds);
    invalidIds.push(...tempInvalidIds);
  }

  return invalidIds.reduce((a, b) => a + b, 0);
}

function main(): void {
  // const lines = getFileByLinesSync('./day2/simpleInput.txt');
  const lines = getFileByLinesSync('./day2/input.txt');

  // there is only one line
  if (lines.length > 1) {
    throw new Error('invalid input');
  }
  const ranges = lines[0].split(',');

  console.info(part2(ranges));
}

main();
