import { linearSearch, binarySearch } from '../../searching/search.ts';

function assert(condition: boolean, message: string): void {
  if (!condition) {
    console.error(`  Assertion failed: ${message}`);
    process.exit(1);
  }
}

const scores = [42, 17, 99, 5, 73];
const sortedScores = [5, 17, 42, 73, 99];

assert(
  linearSearch(scores, 99) === 2,
  'linearSearch should find 99 at index 2',
);
assert(
  linearSearch(scores, 100) === -1,
  'linearSearch should return -1 for 100',
);
assert(
  linearSearch([], 5) === -1,
  'linearSearch should return -1 on an empty array',
);
assert(
  linearSearch(scores, 5) === 3,
  'linearSearch should find 5 at index 3',
);

assert(
  binarySearch(sortedScores, 42) === 2,
  'binarySearch should find 42 at index 2 in sorted array',
);
assert(
  binarySearch(sortedScores, 100) === -1,
  'binarySearch should return -1 for 100',
);
assert(
  binarySearch([], 5) === -1,
  'binarySearch should return -1 on an empty array',
);
assert(
  binarySearch(sortedScores, 5) === 0,
  'binarySearch should find 5 at index 0',
);
assert(
  binarySearch(sortedScores, 99) === sortedScores.length - 1,
  'binarySearch should find 99 at the last index',
);
