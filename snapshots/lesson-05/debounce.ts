export function debounceTrailing<T extends unknown[]>(
  fn: (...args: T) => void,
  delay: number,
): (...args: T) => void {
  let timerId: ReturnType<typeof setTimeout> | null = null;

  return (...args: T) => {
    if (timerId !== null) clearTimeout(timerId);
    timerId = setTimeout(() => {
      fn(...args);
      timerId = null;
    }, delay);
  };
}

// Copy your debounce implementation here from the previous task.
// Rename it debounceLeading
export function debounceLeading<T extends unknown[]>(
  fn: (...args: T) => void,
  delay: number,
): (...args: T) => void {
  let timerId: ReturnType<typeof setTimeout> | null = null;

  return (...args: T) => {
    if (timerId === null) fn(...args);
    if (timerId !== null) clearTimeout(timerId);

    timerId = setTimeout(() => {
      timerId = null;
    }, delay);
  };
}
