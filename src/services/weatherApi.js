import { getCoordinatesByCity } from '../utils/location';

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
  if (!API_KEY) {
    throw new Error('Missing OpenWeatherMap API key.')
  }
  
  const query = new URLSearchParams({
    ...params,
    appid: API_KEY,
  });

  const response = await fetch(`${BASE_URL}?${query}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not find weather data.");
  }

  return data;
}

/**
 * Gets current weather data for a city name.
 *
 * @param {string} city - The city name to search for.
 * @param {string} [units="metric"] - The unit system for returned weather values.
 * @returns {Promise<Object>} The parsed weather data response.
 */
export async function getWeatherByCity(city, units = "metric") {
  const coordinates = await getCoordinatesByCity(city, API_KEY);

  return fetchWeather({
    lat: coordinates.lat,
    lon: coordinates.lon,
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
  if (typeof lat === 'object') {
    return fetchWeather({
      lat: lat.lat,
      lon: lat.lon,
      units: lat.units || units,
    });
  }

  return fetchWeather({
    lat,
    lon,
    units,
  });
}
