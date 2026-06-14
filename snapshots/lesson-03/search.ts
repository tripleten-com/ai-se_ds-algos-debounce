export function linearSearch(items: number[], target: number): number {
  for (let i = 0; i < items.length; i++) {
    if (items[i] === target) {
      return i;
    }
  }
  return -1;
}

export function binarySearch(sortedItems: number[], target: number): number {
  let low = 0;
  let high = sortedItems[sortedItems.length - 1];

  while (low <= high) {
    const mid = Math.round((high + low) / 2);
    if (sortedItems[mid] === target) {
      return mid;
    } else if (sortedItems[mid] < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return -1;
}
