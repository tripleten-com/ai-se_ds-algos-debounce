import { debounce } from "../../04-debouncing/debounce.ts";

function assert(condition: boolean, message: string): void {
  if (!condition) {
    console.error(`  Assertion failed: ${message}`);
    process.exit(1);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Leading-edge debounce fires immediately on the first call, then blocks
// further calls until the delay has passed.

const calls: string[] = [];
const fn = debounce((arg: string) => calls.push(arg), 50);

fn("a"); // Should fire immediately
fn("b"); // Should be blocked
fn("c"); // Should be blocked

assert(
  calls.length === 1,
  `should fire once immediately, got ${calls.length} calls`,
);
assert(calls[0] === "a", `first call should be "a", got "${calls[0]}"`);

await sleep(80); // Wait for the delay window to close

fn("d"); // Should fire immediately again
assert(
  calls.length === 2,
  `should have fired twice total, got ${calls.length} calls`,
);
assert(calls[1] === "d", `second call should be "d", got "${calls[1]}"`);

fn("e"); // Should be blocked again
fn("f"); // Should be blocked again

await sleep(20); // Still within the window
assert(calls.length === 2, `calls within the window should still be blocked`);

await sleep(50); // Window closes
fn("g"); // Should fire immediately
assert(
  calls.length === 3,
  `third call after window closes should fire, got ${calls.length} calls`,
);
assert(calls[2] === "g", `third call should be "g", got "${calls[2]}"`);
