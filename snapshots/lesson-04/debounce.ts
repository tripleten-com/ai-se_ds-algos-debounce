export function debounce<T extends unknown[]>(
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
