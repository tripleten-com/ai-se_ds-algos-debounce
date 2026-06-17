import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import {
  test,
  assert,
  checkBehavior,
  withIndicator,
  normalize,
  runCompileGate,
  summary,
} from "./lib/utils.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function read(relPath) {
  try {
    return normalize(readFileSync(join(root, relPath), "utf8"));
  } catch {
    return null;
  }
}

console.log("\nDebouncing\n");

runCompileGate(root, { tsconfig: "tsconfig.04.json" });

const src = read("04-debouncing/debounce.ts");

test("debounce.ts exists", () => {
  assert(src !== null, "04-debouncing/debounce.ts not found");
});

test("debounce is exported", () => {
  assert(
    (src && src.includes("export function debounce")) ||
      (src && src.includes("export const debounce")),
    "debounce is not exported — export a function named debounce",
  );
});

test("debounce uses setTimeout", () => {
  assert(
    src && src.includes("setTimeout"),
    "debounce should use setTimeout to schedule the delay",
  );
});

test("debounce uses clearTimeout", () => {
  assert(
    src && src.includes("clearTimeout"),
    "debounce should use clearTimeout to cancel previous timers",
  );
});

test("Leading-edge behavior is correct", () => {
  const result = withIndicator("Running tests...", () =>
    checkBehavior(root, "tests/lib/debouncing.behavior.ts"),
  );
  if (result.timedOut) {
    throw new Error(
      "Timed out after 8s — check for an infinite loop in your implementation",
    );
  }
  assert(result.ok, result.output ? `\n${result.output}` : "Behavioral tests failed");
});

summary("dnMwNWRlYm91bmNl");
