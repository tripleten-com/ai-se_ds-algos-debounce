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

console.log("\nMap and Set\n");

const compiled = checkCompiles(root);
if (!compiled.ok) {
  console.log(
    "❌ TypeScript compilation failed — fix all type errors before running tests\n",
  );
  console.log(compiled.output);
  process.exit(1);
}
console.log("✅ Project compiles without type errors\n");

const src = read("map-set/map-set.ts");

test("map-set.ts exists", () => {
  assert(src !== null, "map-set/map-set.ts not found");
});

test("logLevels is exported and uses Set", () => {
  assert(
    src && src.includes("logLevels") && src.includes("Set"),
    "Export a Set named logLevels containing all unique log levels",
  );
});

test("capitalByCountry is exported and uses Map", () => {
  assert(
    src && src.includes("capitalByCountry") && src.includes("Map"),
    "Export a Map named capitalByCountry mapping country names to capitals",
  );
});

test("logLevels is built from the logs array (not hardcoded)", () => {
  assert(
    src && src.includes("logs"),
    "logLevels should be built from the logs array, not hardcoded",
  );
});

test("capitalByCountry is built from the capitals array (not hardcoded)", () => {
  assert(
    src && src.includes("capitals") && src.includes(".capital"),
    "capitalByCountry should be built by iterating over the capitals array",
  );
});

test("uniqueRoles and userById have correct values", () => {
  const result = checkBehavior(root, "tests/lib/map-set.behavior.ts");
  assert(
    result.ok,
    "Behavioral tests failed — run `npx tsx tests/lib/map-set.behavior.ts` to debug",
  );
});

console.log(`\n${pass} passed, ${fail} failed`);
if (fail === 0) {
  const code = Buffer.from("dnMwNW1hcHNldA==", "base64").toString();
  console.log(`\nVerification code: ${code}`);
}
if (fail > 0) process.exit(1);
