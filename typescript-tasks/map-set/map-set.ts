const logs = ["info", "error", "info", "warning", "error", "critical", "info"];

const countries = [
  { country: "Germany", capital: "Berlin" },
  { country: "France", capital: "Paris" },
  { country: "Japan", capital: "Tokyo" },
  { country: "Brazil", capital: "Brasília" },
];

// TODO: Use a Set to collect all unique log levels from logs.
// Export it as logLevels.
export const logLevels = new Set<string>();

// TODO: Use a Map to build a country → capital lookup from capitals.
// The value should be the capital string, not the whole object.
// Export it as capitalByCountry.
export const capitalByCountry = new Map<string, string>();
