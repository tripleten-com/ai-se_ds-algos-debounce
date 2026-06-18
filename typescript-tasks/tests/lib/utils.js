import { execSync, spawnSync, spawn } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

// ============================================================
// TEST RUNNER
// ============================================================

let pass = 0;
let fail = 0;

const GREY = '\x1b[90m';
const RESET = '\x1b[0m';

function grey(text) {
  if (!process.stdout.isTTY) return text;
  return `${GREY}${text}${RESET}`;
}

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
    const code = Buffer.from(encodedCode, 'base64').toString();
    console.log(`\nVerification code: ${code}`);
  } else {
    process.exit(1);
  }
}

// ============================================================
// GATES
// ============================================================

/**
 * Runs TypeScript compilation. Shows the result but does not block subsequent
 * tests, so students can see behavioral feedback even when there are type errors.
 */
export function runCompileGate(root, { tsconfig = 'tsconfig.json' } = {}) {
  const compiled = withIndicator('Checking TypeScript...', () =>
    checkCompiles(root, { tsconfig }),
  );
  if (compiled.ok) {
    console.log('✅ Project compiles without type errors');
    pass++;
  } else {
    console.log('❌ Project compiles without type errors — fix TypeScript errors\n');
    const indented = compiled.output
      .split('\n')
      .map((line) => (line ? '  ' + line : line))
      .join('\n');
    console.log(indented);
    fail++;
  }
  console.log('');
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
  return content.replace(/\s+/g, ' ').trim();
}

/**
 * Type-checks the project with TypeScript.
 */
export function checkCompiles(root, { tsconfig = 'tsconfig.json' } = {}) {
  const tsc = join(root, 'node_modules/.bin/tsc');
  if (!existsSync(tsc)) {
    return { ok: false, output: 'TypeScript not installed — run `npm install` from the typescript-tasks folder' };
  }
  try {
    execSync(`"${tsc}" --noEmit --project ${tsconfig}`, { cwd: root, stdio: 'pipe' });
    return { ok: true, output: '' };
  } catch (err) {
    const output = err.stderr?.toString() || err.stdout?.toString() || '(no output)';
    return { ok: false, output };
  }
}

/**
 * Runs a tsx behavior test file and returns whether it passed. On failure,
 * captures the assertion message from stderr.
 */
export function checkBehavior(root, testFile, { timeout = 8000 } = {}) {
  const tsx = join(root, 'node_modules/.bin/tsx');
  if (!existsSync(tsx)) {
    return { ok: false, timedOut: false, output: 'tsx not installed — run `npm install` from the typescript-tasks folder' };
  }
  const proc = spawnSync(tsx, [testFile], {
    cwd: root,
    stdio: 'pipe',
    timeout,
    encoding: 'utf8',
  });

  if (proc.status === 0) {
    return { ok: true };
  }

  // On macOS, spawnSync timeout surfaces as proc.error.code === 'ETIMEDOUT'
  // rather than a non-null proc.signal.
  const timedOut = proc.signal !== null || proc.error?.code === 'ETIMEDOUT';
  if (timedOut) {
    return { ok: false, timedOut: true, output: '' };
  }

  // tsx prints source context before the actual error line, so anchor the
  // search to lines that start with "Error: Assertion failed:".
  const errorLine = (proc.stderr ?? '')
    .split('\n')
    .find((l) => l.trimStart().startsWith('Error: Assertion failed:'));
  const output =
    errorLine?.replace(/^Error:\s*/, '').trim() ??
    (proc.stderr ?? '').trim() ??
    '';

  return { ok: false, timedOut: false, output };
}

// ============================================================
// HELPERS
// ============================================================

/**
 * Runs fn() synchronously. If it takes longer than 1s, prints a progress
 * message to stdout. Uses a detached child process because setTimeout can't
 * fire during a sync block.
 */
export function withIndicator(message, fn) {
  const child = spawn(
    process.execPath,
    ['-e', `setTimeout(() => process.stdout.write(${JSON.stringify(message + '\n')}), 1000)`],
    { stdio: 'inherit' },
  );
  child.unref();
  try {
    return fn();
  } finally {
    child.kill();
  }
}
