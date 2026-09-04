const GEOCODING_API_URL = 'https://api.openweathermap.org/geo/1.0/direct';
const GEOCODING_RESULT_LIMIT = '1';

/**
 * Checks whether a coordinate input contains a non-empty value.
 *
 * @param {string | number | null | undefined} value - The coordinate input value.
 * @returns {boolean} True when the value is present; otherwise false.
 */
function hasCoordinateValue(value) {
  return value !== null && value !== undefined && String(value).trim() !== '';
}

/**
 * Validates whether a value is a valid latitude.
 *
 * @param {string | number} latitude - The latitude value to validate.
 * @returns {boolean} True when the latitude is between -90 and 90.
 */
export function isValidLatitude(latitude) {
  const numericLatitude = Number(latitude);

  return (
    hasCoordinateValue(latitude) &&
    Number.isFinite(numericLatitude) &&
    numericLatitude >= -90 &&
    numericLatitude <= 90
  );
}

/**
 * Validates whether a value is a valid longitude.
 *
 * @param {string | number} longitude - The longitude value to validate.
 * @returns {boolean} True when the longitude is between -180 and 180.
 */
export function isValidLongitude(longitude) {
  const numericLongitude = Number(longitude);

  return (
    hasCoordinateValue(longitude) &&
    Number.isFinite(numericLongitude) &&
    numericLongitude >= -180 &&
    numericLongitude <= 180
  );
}

/**
 * Converts a city name into geographic coordinates using OpenWeather geocoding.
 *
 * @param {string} city - The city name to look up.
 * @param {string} apiKey - The OpenWeather API key.
 * @returns {Promise<{
 *   lat: number,
 *   lon: number,
 *   name: string,
 *   state: string | undefined,
 *   country: string
 * }>} The first matching city result with coordinates and location metadata.
 * @throws {Error} If the city is empty, the API key is missing, or no city is found.
 */
export async function getCoordinatesByCity(city, apiKey) {
  const cityName = String(city || '').trim();

  if (!cityName) {
    throw new Error('Please enter a city.');
  }

  if (!apiKey) {
    throw new Error('Missing OpenWeatherMap API key.');
  }

  const query = new URLSearchParams({
    q: cityName,
    limit: GEOCODING_RESULT_LIMIT,
    appid: apiKey,
  });

  const response = await fetch(`${GEOCODING_API_URL}?${query}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Could not find that city.');
  }

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('Could not find that city.');
  }

  const [location] = data;

  return {
    lat: location.lat,
    lon: location.lon,
    name: location.name,
    country: location.country,
  };
}
