import { execSync } from "child_process";

// ============================================================
// TEST RUNNER
// ============================================================

let pass = 0;
let fail = 0;

export function test(label, fn) {
  try {
    fn();
    console.log(`✅ ${label}`);
    pass++;
  } catch (err) {
    console.log(`❌ ${label} — ${err.message}`);
    fail++;
  }
}

export function assert(condition, message) {
  if (!condition) throw new Error(message);
}

/** Increments the pass counter (for custom test display). */
export function incrementPass() {
  pass++;
}

/** Increments the fail counter (for custom test display). */
export function incrementFail() {
  fail++;
}

/**
 * Prints pass/fail totals. When everything passed, decodes and prints the
 * lesson's verification code. Exits nonzero on any failure.
 */
export function summary(encodedCode) {
  console.log(`\n${pass} passed, ${fail} failed`);
  if (fail === 0) {
    const code = Buffer.from(encodedCode, "base64").toString();
    console.log(`\nVerification code: ${code}`);
  } else {
    process.exit(1);
  }
}

// ============================================================
// GATES
// ============================================================

/**
 * Runs the compile and build gates against the client app. Shows results but
 * does not block subsequent tests, so students can see behavioral feedback
 * even when there are type or build issues.
 */
export function runGates(client) {
  const built = checkBuilds(client);
  if (built.ok) {
    console.log("✅ App builds and runs without errors");
    pass++;
  } else {
    console.log("❌ App builds and runs without errors — Vite build failed\n");
    const indented = built.output
      .split("\n")
      .map((line) => (line ? "  " + line : line))
      .join("\n");
    console.log(indented);
    fail++;
  }

  const compiled = checkCompiles(client);
  if (compiled.ok) {
    console.log("✅ Project compiles without type errors\n");
    pass++;
  } else {
    console.log(
      "❌ Project compiles without type errors — fix TypeScript errors\n",
    );
    const indented = compiled.output
      .split("\n")
      .map((line) => (line ? "  " + line : line))
      .join("\n");
    console.log(indented);
    fail++;
  }
}

// ============================================================
// CHECKS
// ============================================================

/**
 * Collapses all whitespace sequences to a single space and trims the result.
 * Call this on every file read so that formatting differences don't affect
 * string matching in tests.
 */
export function normalize(content) {
  if (content === null) return null;
  return content.replace(/\s+/g, " ").trim();
}

/**
 * Type-checks the client app with TypeScript. Unused-code checks are disabled
 * because editors surface them as faded hints rather than red errors, and
 * students shouldn't fail for leftover unused variables.
 */
export function checkCompiles(client) {
  try {
    execSync(
      "npx tsc -p tsconfig.app.json --noEmit --noUnusedLocals false --noUnusedParameters false",
      { cwd: client, stdio: "pipe" },
    );
    return { ok: true, output: "" };
  } catch (err) {
    const output =
      err.stderr?.toString() || err.stdout?.toString() || "(no output)";
    return { ok: false, output };
  }
}

/**
 * Runs `vite build` to verify the app bundles without errors.
 */
export function checkBuilds(client) {
  try {
    execSync("npx vite build", { cwd: client, stdio: "pipe" });
    return { ok: true, output: "" };
  } catch (err) {
    const output =
      err.stderr?.toString() || err.stdout?.toString() || "(no output)";
    return { ok: false, output };
  }
}

/**
 * Runs a vitest test file and returns individual test results with friendly
 * names. `testFile` is relative to the client directory. On failure, includes
 * a message with the exact command to run for the full vitest output.
 */
export function checkBehavior(client, testFile) {
  let output = "";
  let ok = false;
  try {
    output = execSync(`npx vitest run --reporter=verbose ${testFile}`, {
      cwd: client,
      stdio: "pipe",
      encoding: "utf8",
    });
    ok = true;
  } catch (err) {
    output = err.stdout?.toString() || "";
    ok = false;
  }

  // Extract individual test results: "✓ path > suite > test name" or "× path > suite > test name"
  const testMatches = output.match(/^\s*[✓×✗]\s+.+$/gm) || [];
  const tests = testMatches.map((match) => {
    const passed = match.trim().startsWith("✓");
    // Extract just the final test name after the last ">"
    const name = match.split(">").pop().trim();
    return { name, passed };
  });

  return {
    ok,
    tests,
    message: !ok
      ? `\n  Run \`npx vitest run ${testFile}\` for the full output.\n  To save to a file: \`NO_COLOR=1 npx vitest run ${testFile} > results.txt\``
      : undefined,
  };
}
