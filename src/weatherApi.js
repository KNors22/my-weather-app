const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

/**
 * Fetches current weather data from OpenWeather using the provided query params.
 *
 * @param {Object.<string, string | number>} params - OpenWeather query parameters.
 * @returns {Promise<Object>} The parsed weather data response.
 * @throws {Error} If the OpenWeather request fails.
 */
async function fetchWeather(params) {
  const query = new URLSearchParams({
    ...params,
    appid: API_KEY,
  });

  const response = await fetch(`${BASE_URL}?${query}`);

  if (!response.ok) {
    throw new Error("Could not find weather data.");
  }

  return response.json();
}

/**
 * Gets current weather data for a city name.
 *
 * @param {string} city - The city name to search for.
 * @param {string} [units="metric"] - The unit system for returned weather values.
 * @returns {Promise<Object>} The parsed weather data response.
 */
export function getWeatherByCity(city, units = "metric") {
  return fetchWeather({
    q: city,
    units,
  });
}

/**
 * Gets current weather data for geographic coordinates.
 *
 * @param {number} lat - The latitude of the location.
 * @param {number} lon - The longitude of the location.
 * @param {string} [units="metric"] - The unit system for returned weather values.
 * @returns {Promise<Object>} The parsed weather data response.
 */
export function getWeatherByCoordinates(lat, lon, units = "metric") {
  return fetchWeather({
    lat,
    lon,
    units,
  });
}
