const logs = ["info", "error", "info", "warning", "error", "critical", "info"];

const countries = [
  { country: "Germany", capital: "Berlin" },
  { country: "France", capital: "Paris" },
  { country: "Japan", capital: "Tokyo" },
  { country: "Brazil", capital: "Brasília" },
];

export const logLevels = new Set(logs);
console.log(logLevels.size);

export const capitalByCountry = new Map(
  countries.map((country) => [country.country, country.capital]),
);
console.log(capitalByCountry.get("Japan"));
