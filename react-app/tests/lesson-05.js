import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import {
  test,
  assert,
  normalize,
  runGates,
  checkBehavior,
  incrementPass,
  incrementFail,
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

console.log("\nLesson 05: Debouncing\n");

runGates(root);

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
    (list && list.includes('type="search"')) ||
      (list && list.includes("type='search'")),
    'No search input found — add an <input type="search" /> to ProfileList',
  );
});

{
  const behaviorHints = {
    "renders all 8 profiles on mount":
      "Make sure ProfileList renders from the profiles array on initial load",
    "filters profiles by name after the debounce delay fires":
      "The debounced function should filter profiles by name and call setDisplayedProfiles",
    "filter is case-insensitive":
      "Use .toLowerCase() on both the query and profile name before comparing",
    "partial matches are included in results":
      "Use .includes() rather than strict equality so partial matches work",
    "clearing the search restores all profiles":
      "When the query is empty, reset displayedProfiles to the full profiles array",
  };

  const result = checkBehavior(root, "tests/lib/lesson-05.behavior.test.tsx");
  if (result.tests.length > 0) {
    const headingIcon = result.ok ? "✅" : "❌";
    console.log(`${headingIcon} Behavior tests`);
    result.tests.forEach((t) => {
      const icon = t.passed ? "✅" : "❌";
      const hint = t.passed ? "" : ` — ${behaviorHints[t.name] || ""}`;
      console.log(`  ${icon} ${t.name}${hint}`);
      if (t.passed) incrementPass();
      else incrementFail();
    });
    if (!result.ok && result.message) {
      console.log(result.message);
    }
  } else if (!result.ok) {
    console.log("❌ Behavior tests");
    if (result.message) console.log(result.message);
    incrementFail();
  }
}

summary("azdwLXdnajU=");
