const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

function formatRelativeTime(date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now - new Date(date)) / 1000);

  const units = [
    { limit: 60, unit: "second" },
    { limit: 3600, unit: "minute", divisor: 60 },
    { limit: 86400, unit: "hour", divisor: 3600 },
    { limit: 604800, unit: "day", divisor: 86400 },
    { limit: 2592000, unit: "week", divisor: 604800 },
    { limit: 31536000, unit: "month", divisor: 2592000 },
    { limit: Infinity, unit: "year", divisor: 31536000 },
  ];

  const diff = Math.abs(diffInSeconds);
  //   console.log({ date, now, diffInSeconds, units, diff });
  const { unit, divisor } = units.find(({ limit }) => diff < limit);
  return rtf
    .format(-Math.floor(diff / (divisor || 1)), unit)
    .replace(/^./, (match) => match.toUpperCase()); //capitalize the first letter
}

export { formatRelativeTime };
