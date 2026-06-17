import { linearSearch, binarySearch } from "../../03-searching/search.ts";

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

const scores = [42, 17, 99, 5, 73];
const sortedScores = [5, 17, 42, 73, 99];

assert(
  linearSearch(scores, 99) === 2,
  `linearSearch([${scores}], 99) should return 2`,
);
assert(
  linearSearch(scores, 100) === -1,
  `linearSearch([${scores}], 100) should return -1`,
);
assert(linearSearch([], 5) === -1, "linearSearch([], 5) should return -1");
assert(
  linearSearch(scores, 5) === 3,
  `linearSearch([${scores}], 5) should return 3`,
);

assert(
  binarySearch(sortedScores, 42) === 2,
  `binarySearch([${sortedScores}], 42) should return 2`,
);
assert(
  binarySearch(sortedScores, 100) === -1,
  `binarySearch([${sortedScores}], 100) should return -1`,
);
assert(binarySearch([], 5) === -1, "binarySearch([], 5) should return -1");
assert(
  binarySearch(sortedScores, 5) === 0,
  `binarySearch([${sortedScores}], 5) should return 0`,
);
assert(
  binarySearch(sortedScores, 99) === sortedScores.length - 1,
  `binarySearch([${sortedScores}], 99) should return ${sortedScores.length - 1}`,
);
