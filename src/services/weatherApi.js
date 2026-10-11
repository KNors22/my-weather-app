import { getCoordinatesByCity } from '../utils/location';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const CURRENT_WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";

/**
 * Fetches data from an OpenWeather endpoint using the provided query params.
 *
 * @param {string} endpoint - The OpenWeather endpoint to request.
 * @param {Object.<string, string | number>} params - OpenWeather query parameters.
 * @returns {Promise<Object>} The parsed OpenWeather response.
 * @throws {Error} If the OpenWeather request fails.
 */
async function fetchOpenWeather(endpoint, params) {
  if (!API_KEY) {
    throw new Error('Missing OpenWeatherMap API key.');
  }

  const query = new URLSearchParams({
    ...params,
    appid: API_KEY,
  });

  const response = await fetch(`${endpoint}?${query}`);
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

  return getWeatherByCoordinates(coordinates.lat, coordinates.lon, units);
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
    return fetchOpenWeather(CURRENT_WEATHER_URL, {
      lat: lat.lat,
      lon: lat.lon,
      units: lat.units || units,
    });
  }

  return fetchOpenWeather(CURRENT_WEATHER_URL, {
    lat,
    lon,
    units,
  });
}

/**
 * Gets five-day forecast data for geographic coordinates.
 *
 * @param {number} lat - The latitude of the location.
 * @param {number} lon - The longitude of the location.
 * @param {string} [units="metric"] - The unit system for returned weather values.
 * @returns {Promise<Object>} The parsed forecast response.
 */
export function getForecastByCoordinates(lat, lon, units = "metric") {
  return fetchOpenWeather(FORECAST_URL, { lat, lon, units });
}

/**
 * Gets current weather and forecast data with one coordinate lookup.
 *
 * @param {string} city - The city name to search for.
 * @param {string} [units="metric"] - The unit system for returned weather values.
 * @returns {Promise<{
 *   weather: Object,
 *   forecast: Object,
 *   location: {name: string, state: string | undefined, country: string}
 * }>} Current weather, forecast, and canonical geocoding metadata.
 */
export async function getWeatherBundleByCity(city, units = "metric") {
  const coordinates = await getCoordinatesByCity(city, API_KEY);
  const bundle = await getWeatherBundleByCoordinates(
    coordinates.lat,
    coordinates.lon,
    units,
  );

  return {
    ...bundle,
    location: {
      name: coordinates.name,
      state: coordinates.state,
      country: coordinates.country,
    },
  };
}

/**
 * Gets current weather and forecast data for geographic coordinates.
 *
 * @param {number} lat - The latitude of the location.
 * @param {number} lon - The longitude of the location.
 * @param {string} [units="metric"] - The unit system for returned weather values.
 * @returns {Promise<{weather: Object, forecast: Object}>} Current and forecast data.
 */
export async function getWeatherBundleByCoordinates(
  lat,
  lon,
  units = "metric",
) {
  // Concurrent requests, faster than sequential requests
  const [weather, forecast] = await Promise.all([
    getWeatherByCoordinates(lat, lon, units),
    getForecastByCoordinates(lat, lon, units),
  ]);

  return { weather, forecast };
}
