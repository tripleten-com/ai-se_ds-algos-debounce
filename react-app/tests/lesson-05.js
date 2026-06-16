import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { checkCompiles, checkBuilds, checkBehavior, normalize } from "./lib/utils.js";

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

console.log("\nLesson 05: Debouncing\n");

const compiled = checkCompiles(root);
if (!compiled.ok) {
  console.log(
    "❌ TypeScript compilation failed — fix all type errors before running tests\n",
  );
  console.log(compiled.output);
  process.exit(1);
}
console.log("✅ Project compiles without type errors");

const built = checkBuilds(root);
if (!built.ok) {
  console.log("❌ Vite build failed — the app does not run without errors\n");
  console.log(built.output);
  process.exit(1);
}
console.log("✅ App builds and runs without errors\n");

const list = read("src/components/ProfileList/ProfileList.tsx");
const debounce = read("src/utils/debounce.ts");

test("ProfileList.tsx exists", () => {
  assert(list !== null, "src/components/ProfileList/ProfileList.tsx not found");
});

test("src/utils/debounce.ts exists", () => {
  assert(
    debounce !== null,
    "src/utils/debounce.ts not found — create this file and add the debounce function",
  );
});

test("debounce is imported in ProfileList.tsx", () => {
  assert(
    list && list.includes("debounce"),
    "debounce is not imported in ProfileList.tsx — import it from src/utils/debounce.ts",
  );
});

test("useRef is imported in ProfileList.tsx", () => {
  assert(
    list && list.includes("useRef"),
    "useRef is not imported — add it to the React import and use it to hold the debounced function",
  );
});

test("useState is used in ProfileList.tsx", () => {
  assert(
    list && list.includes("useState"),
    "useState is not used — add state for the search query and the displayed profiles",
  );
});

test("A search input is present in ProfileList.tsx", () => {
  assert(
    list && list.includes('type="search"') || list && list.includes("type='search'"),
    'No search input found — add an <input type="search" /> to ProfileList',
  );
});

test("Debouncing behavior is correct", () => {
  const result = checkBehavior(root, "tests/lib/lesson-05.behavior.test.tsx");
  assert(
    result.ok,
    "Behavioral tests failed — run `npm test -- tests/lib/lesson-05.behavior.test.tsx` for details",
  );
});

console.log(`\n${pass} passed, ${fail} failed`);
if (fail === 0) {
  const code = Buffer.from("dnMwNWRlYm91bmNl", "base64").toString();
  console.log(`\nVerification code: ${code}`);
}
if (fail > 0) process.exit(1);
