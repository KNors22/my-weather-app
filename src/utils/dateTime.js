const locationDateFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

/**
 * Formats a timezone offset using GMT notation.
 *
 * @param {number} timezoneOffset - Offset from UTC in seconds.
 * @returns {string} An offset such as GMT+1 or GMT-4:30.
 */
function formatGmtOffset(timezoneOffset) {
  const totalMinutes = Math.round(Math.abs(timezoneOffset) / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const sign = timezoneOffset >= 0 ? "+" : "-";
  const minuteSuffix = minutes > 0 ? `:${String(minutes).padStart(2, "0")}` : "";

  return `GMT${sign}${hours}${minuteSuffix}`;
}

/**
 * Formats the current date and time for a location using its UTC offset.
 *
 * @param {number} timestamp - Current Unix time in milliseconds.
 * @param {number} timezoneOffset - Location offset from UTC in seconds.
 * @returns {string} The formatted local date, time, and GMT offset.
 */
export function formatLocationDateTime(timestamp, timezoneOffset) {
  const numericTimestamp = Number(timestamp);
  const numericOffset = Number(timezoneOffset);

  if (!Number.isFinite(numericTimestamp) || !Number.isFinite(numericOffset)) {
    return "";
  }

  const locationDate = new Date(numericTimestamp + numericOffset * 1000);
  const hours = locationDate.getUTCHours();
  const minutes = String(locationDate.getUTCMinutes()).padStart(2, "0");
  const twelveHour = hours % 12 || 12;
  const period = hours < 12 ? "a.m." : "p.m.";
  const date = locationDateFormatter.format(locationDate);

  return `${twelveHour}:${minutes}${period} ${date} (${formatGmtOffset(numericOffset)})`;
}
