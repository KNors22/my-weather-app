const MAX_FORECAST_DAYS = 5;
const NOON_IN_MINUTES = 12 * 60;

/**
 * Converts a Unix timestamp to a Date shifted to the location's local time.
 * UTC getters must be used with the returned Date to avoid applying the browser timezone.
 *
 * @param {number} timestamp - Unix timestamp in seconds.
 * @param {number} timezoneOffset - Location offset from UTC in seconds.
 * @returns {Date} A Date shifted to the location's local time.
 */
function toLocationDate(timestamp, timezoneOffset) {
  return new Date((timestamp + timezoneOffset) * 1000);
}

/**
 * Creates a sortable calendar date key from a shifted Date.
 *
 * @param {Date} date - A Date representing the location's shifted local time.
 * @returns {string} A date formatted as YYYY-MM-DD.
 */
function getDateKey(date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/**
 * Converts OpenWeather's three-hour readings into daily forecast summaries.
 *
 * @param {Object} forecastData - OpenWeather five-day forecast response.
 * @param {number} [now=Date.now()] - Current time in milliseconds, injectable for tests.
 * @returns {Array<{
 *   date: string,
 *   timestamp: number,
 *   min: number,
 *   max: number,
 *   icon: string,
 *   description: string
 * }>} Up to five daily forecasts beginning tomorrow.
 */
export function normalizeForecast(forecastData, now = Date.now()) {
  const timezoneOffset = Number(forecastData?.city?.timezone) || 0;
  const currentTimestamp = Math.floor(now / 1000);
  const today = getDateKey(toLocationDate(currentTimestamp, timezoneOffset));
  const dailyGroups = new Map();

  for (const reading of forecastData?.list || []) {
    const timestamp = Number(reading?.dt);
    const minimum = Number(reading?.main?.temp_min);
    const maximum = Number(reading?.main?.temp_max);

    if (
      !Number.isFinite(timestamp) ||
      !Number.isFinite(minimum) ||
      !Number.isFinite(maximum)
    ) {
      continue;
    }

    const localDate = toLocationDate(timestamp, timezoneOffset);
    const date = getDateKey(localDate);

    if (date <= today) {
      continue;
    }

    const minutesFromMidnight =
      localDate.getUTCHours() * 60 + localDate.getUTCMinutes();
    const distanceFromNoon = Math.abs(minutesFromMidnight - NOON_IN_MINUTES);
    const group = dailyGroups.get(date) || {
      min: minimum,
      max: maximum,
      representative: reading,
      representativeDistance: distanceFromNoon,
    };

    group.min = Math.min(group.min, minimum);
    group.max = Math.max(group.max, maximum);

    if (distanceFromNoon < group.representativeDistance) {
      group.representative = reading;
      group.representativeDistance = distanceFromNoon;
    }

    dailyGroups.set(date, group);
  }

  return [...dailyGroups.entries()]
    .sort(([firstDate], [secondDate]) => firstDate.localeCompare(secondDate))
    .slice(0, MAX_FORECAST_DAYS)
    .map(([date, group]) => ({
      date,
      timestamp: group.representative.dt,
      min: group.min,
      max: group.max,
      icon: group.representative.weather?.[0]?.icon || "",
      description:
        group.representative.weather?.[0]?.description || "Forecast unavailable",
    }));
}
