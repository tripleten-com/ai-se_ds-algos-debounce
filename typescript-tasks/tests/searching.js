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

console.log("\nSearching\n");

const compiled = checkCompiles(root);
if (!compiled.ok) {
  console.log(
    "❌ TypeScript compilation failed — fix all type errors before running tests\n",
  );
  console.log(compiled.output);
  process.exit(1);
}
console.log("✅ Project compiles without type errors\n");

const src = read("03-searching/search.ts");

test("search.ts exists", () => {
  assert(src !== null, "03-searching/search.ts not found");
});

test("linearSearch is exported", () => {
  assert(
    src && src.includes("linearSearch"),
    "linearSearch is not defined — add a function named linearSearch",
  );
});

test("binarySearch is exported", () => {
  assert(
    src && src.includes("binarySearch"),
    "binarySearch is not defined — add a function named binarySearch",
  );
});

test("linearSearch uses a loop (not Array methods)", () => {
  assert(
    src && src.includes("for") && !src.match(/\.indexOf|\.find\b|\.includes\b/),
    "linearSearch should use a loop, not built-in Array search methods",
  );
});

test("binarySearch uses numeric comparison (not localeCompare)", () => {
  assert(
    src && !src.includes("localeCompare") && (src.includes("<") || src.includes(">")),
    "binarySearch should compare numbers with < and >, not localeCompare",
  );
});

test("Both functions return correct results", () => {
  const result = checkBehavior(root, "tests/lib/searching.behavior.ts");
  assert(
    result.ok,
    "Behavioral tests failed — run `npx tsx tests/lib/searching.behavior.ts` to debug",
  );
});

console.log(`\n${pass} passed, ${fail} failed`);
if (fail === 0) {
  const code = Buffer.from("dnMwNXNlYXJjaA==", "base64").toString();
  console.log(`\nVerification code: ${code}`);
}
if (fail > 0) process.exit(1);
