import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { checkCompiles, checkBehavior, withIndicator, normalize } from "./lib/utils.js";

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

console.log("\nMap and Set\n");

const compiled = withIndicator('Checking TypeScript...', () => checkCompiles(root, { tsconfig: 'tsconfig.02.json' }));
if (!compiled.ok) {
  console.log(
    "❌ TypeScript compilation failed — fix all type errors before running tests\n",
  );
  console.log(compiled.output);
  process.exit(1);
}
console.log("✅ Project compiles without type errors\n");

const src = read("02-map-set/map-set.ts");

test("map-set.ts exists", () => {
  assert(src !== null, "02-map-set/map-set.ts not found");
});

test("logLevels is assigned a new Set", () => {
  assert(
    src && /logLevels\s*=\s*new\s+Set\s*\(/.test(src),
    "logLevels should be assigned with new Set(...)",
  );
});

test("capitalByCountry is assigned a new Map", () => {
  assert(
    src && /capitalByCountry\s*=\s*new\s+Map\s*\(/.test(src),
    "capitalByCountry should be assigned with new Map(...)",
  );
});

test("logLevels is built from the logs array (not hardcoded)", () => {
  assert(
    src && src.includes("logs"),
    "logLevels should be built from the logs array, not hardcoded",
  );
});

test("capitalByCountry is built from the countries array (not hardcoded)", () => {
  assert(
    src && src.includes("countries"),
    "capitalByCountry should be built from the countries array, not hardcoded",
  );
});

test("logLevels and capitalsByCountry have correct values", () => {
  const result = withIndicator('Running tests...', () => checkBehavior(root, "tests/lib/map-set.behavior.ts"));
  if (result.timedOut) {
    throw new Error("Timed out after 8s — check for an infinite loop in your implementation");
  }
  assert(result.ok, result.output ? `\n${result.output}` : "Behavioral tests failed");
});

console.log(`\n${pass} passed, ${fail} failed`);
if (fail === 0) {
  const code = Buffer.from("dnMwNW1hcHNldA==", "base64").toString();
  console.log(`\nVerification code: ${code}`);
}
if (fail > 0) process.exit(1);
