// Implement a leading-edge debounce.
//
// Unlike the trailing debounce in the lesson (which fires after the last call),
// this version fires immediately on the first call in a burst, then ignores
// further calls until the delay has passed.
//
// Example:
//   const fn = debounce(log, 300);
//   fn('a');  // fires immediately → logs 'a'
//   fn('b');  // ignored (within 300ms window)
//   fn('c');  // ignored (within 300ms window)
//   // ...300ms later...
//   fn('d');  // fires immediately → logs 'd'

export function debounce<T extends unknown[]>(
  fn: (...args: T) => void,
  delay: number,
): (...args: T) => void {
  // TODO: implement leading-edge debounce
  // Hint: use a timer ID to track the current delay window.
  // When the timer ID is null, the window is closed and the next call should fire.
  return (..._args: T) => {};
}
