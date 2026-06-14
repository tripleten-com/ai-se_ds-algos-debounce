export function debounce<T extends unknown[]>(
  fn: (...args: T) => void,
  delay: number,
): (...args: T) => void {
  let timerId: ReturnType<typeof setTimeout> | null = null;

  return (...args: T) => {
    // 1. If there is no active timer, call fn immediately.
    // 2. If there is an existing timer, clear it.
    // 3. Start a new timer with timerId = setTimeout(...)
    // 4. In the timer's callback, set timerId to null
  };
}
