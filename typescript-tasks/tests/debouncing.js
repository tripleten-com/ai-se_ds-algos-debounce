import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { checkCompiles, checkBehavior, normalize } from "./lib/utils.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function read(relPath) {
  try {
    return normalize(readFileSync(join(root, relPath), "utf8"));
  } catch {
    return null;
  }
}

let pass = 0;
let fail = 0;

function test(label, fn) {
  try {
    fn();
    console.log(`✅ ${label}`);
    pass++;
  } catch (err) {
    console.log(`❌ ${label} — ${err.message}`);
    fail++;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

console.log("\nDebouncing\n");

const compiled = checkCompiles(root);
if (!compiled.ok) {
  console.log(
    "❌ TypeScript compilation failed — fix all type errors before running tests\n",
  );
  console.log(compiled.output);
  process.exit(1);
}
console.log("✅ Project compiles without type errors\n");

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
  const result = checkBehavior(root, "tests/lib/debouncing.behavior.ts");
  assert(
    result.ok,
    "Behavioral tests failed — run `npx tsx tests/lib/debouncing.behavior.ts` to debug",
  );
});

console.log(`\n${pass} passed, ${fail} failed`);
if (fail === 0) {
  const code = Buffer.from("dnMwNWRlYm91bmNl", "base64").toString();
  console.log(`\nVerification code: ${code}`);
}
if (fail > 0) process.exit(1);
