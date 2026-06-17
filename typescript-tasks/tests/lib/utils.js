import { execSync, spawnSync, spawn } from 'child_process';

// Runs fn() synchronously. If it takes longer than 1s, prints message to stdout.
// Uses a detached child process because setTimeout can't fire during a sync block.
export function withIndicator(message, fn) {
  const child = spawn(process.execPath, [
    '-e',
    `setTimeout(() => process.stdout.write(${JSON.stringify(message + '\n')}), 1000)`,
  ], { stdio: 'inherit' });
  child.unref();
  try {
    return fn();
  } finally {
    child.kill();
  }
}

export function normalize(content) {
  if (content === null) return null;
  return content.replace(/\s+/g, ' ').trim();
}

export function checkCompiles(root, { tsconfig = 'tsconfig.json' } = {}) {
  try {
    execSync(`npx tsc --noEmit --project ${tsconfig}`, { cwd: root, stdio: 'pipe' });
    return { ok: true, output: '' };
  } catch (err) {
    const output = err.stderr?.toString() || err.stdout?.toString() || '(no output)';
    return { ok: false, output };
  }
}

export function checkBehavior(root, testFile, { timeout = 8000 } = {}) {
  const proc = spawnSync('./node_modules/.bin/tsx', [testFile], {
    cwd: root,
    stdio: 'pipe',
    timeout,
    encoding: 'utf8',
  });

  if (proc.status === 0) {
    return { ok: true };
  }

  // On macOS, spawnSync timeout surfaces as proc.error.code === 'ETIMEDOUT'
  // rather than a non-null proc.signal
  const timedOut = proc.signal !== null || proc.error?.code === 'ETIMEDOUT';
  if (timedOut) {
    return { ok: false, timedOut: true, output: '' };
  }

  // The behavior tests throw new Error() on failure. Node's uncaught-exception
  // handler writes synchronously to stderr before exit, so the message is always
  // captured. Find the 'Error: ...' line and strip the 'Error: ' prefix.
  const errorLine = (proc.stderr ?? '').split('\n')
    .find((l) => l.includes('Assertion failed:'));
  const output = errorLine?.replace(/^Error:\s*/, '').trim()
    ?? (proc.stderr ?? '').trim()
    ?? '';

  return { ok: false, timedOut: false, output };
}
