import { logLevels, capitalByCountry } from '../../02-map-set/map-set.ts';

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

assert(
  logLevels.size === 4,
  `logLevels should have 4 entries, got ${logLevels.size}`,
);
assert(logLevels.has('info'), 'logLevels should contain "info"');
assert(logLevels.has('error'), 'logLevels should contain "error"');
assert(logLevels.has('warning'), 'logLevels should contain "warning"');
assert(logLevels.has('critical'), 'logLevels should contain "critical"');

assert(
  capitalByCountry.size === 4,
  `capitalByCountry should have 4 entries, got ${capitalByCountry.size}`,
);
assert(
  capitalByCountry.get('Japan') === 'Tokyo',
  'capitalByCountry.get("Japan") should be "Tokyo"',
);
assert(
  capitalByCountry.get('Germany') === 'Berlin',
  'capitalByCountry.get("Germany") should be "Berlin"',
);
assert(
  capitalByCountry.get('Spain') === undefined,
  'capitalByCountry.get("Spain") should be undefined',
);
