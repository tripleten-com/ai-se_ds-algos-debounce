const logs = ["info", "error", "info", "warning", "error", "critical", "info"];

const countries = [
  { country: "Germany", capital: "Berlin" },
  { country: "France", capital: "Paris" },
  { country: "Japan", capital: "Tokyo" },
  { country: "Brazil", capital: "Brasília" },
];

// TODO: Use a Set to collect all unique log levels
// Export it as a logLevels const
export const logLevels = new Set(logs);
console.log(logLevels.size);

// TODO: Use a Map to build a country → capital lookup from the countries array.
// Export it as a capitalByCountry const
export const capitalByCountry = new Map(
  countries.map((country) => [country.country, country.capital]),
);
console.log(capitalByCountry.get("Japan"));
