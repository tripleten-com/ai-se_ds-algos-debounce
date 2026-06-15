import { execSync } from 'child_process';

export function normalize(content) {
  if (content === null) return null;
  return content.replace(/\s+/g, ' ').trim();
}

export function checkCompiles(root) {
  try {
    execSync('npx tsc --noEmit', { cwd: root, stdio: 'pipe' });
    return { ok: true, output: '' };
  } catch (err) {
    const output = err.stderr?.toString() || err.stdout?.toString() || '(no output)';
    return { ok: false, output };
  }
}

export function checkBehavior(root, testFile) {
  try {
    execSync(`npx tsx ${testFile}`, { cwd: root, stdio: 'pipe' });
    return { ok: true };
  } catch {
    return { ok: false };
  }
}
