import { useEffect, useLayoutEffect, useState } from "react";
import "./App.css";
import {
  getWeatherBundleByCity,
  getWeatherBundleByCoordinates,
} from "./services/weatherApi";
import { formatLocationDateTime } from "./utils/dateTime";
import { normalizeForecast, selectForecastDays } from "./utils/forecast";
import { isValidLatitude, isValidLongitude } from "./utils/location";

const THEME_STORAGE_KEY = "weather-app-theme";

/**
 * Gets the saved theme or falls back to the operating-system preference.
 *
 * @returns {boolean} True when dark mode should be enabled.
 */
function getInitialDarkMode() {
  try {
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

    if (savedTheme === "dark") return true;
    if (savedTheme === "light") return false;
  } catch {
    // Local storage can be unavailable in privacy-restricted browser contexts.
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

const forecastDateFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: "short",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

const forecastMonthDayFormatter = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

/**
 * Formats a forecast date without applying the browser's timezone.
 *
 * @param {string} date - A date formatted as YYYY-MM-DD.
 * @param {boolean} isToday - Whether the date is current in the searched location.
 * @returns {string} A localized weekday and date label.
 */
function formatForecastDate(date, isToday) {
  const forecastDate = new Date(`${date}T00:00:00Z`);

  if (isToday) {
    return `Today, ${forecastMonthDayFormatter.format(forecastDate)}`;
  }

  return forecastDateFormatter.format(forecastDate);
}

function App() {
  const [city, setCity] = useState("");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");

  const [units, setUnits] = useState("metric");
  const [weather, setWeather] = useState(null);
  const [displayLocation, setDisplayLocation] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [forecastDays, setForecastDays] = useState(3);
  const [currentTime, setCurrentTime] = useState(() => Date.now());
  const [isDarkMode, setIsDarkMode] = useState(getInitialDarkMode);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useLayoutEffect(() => {
    const theme = isDarkMode ? "dark" : "light";
    document.documentElement.dataset.theme = theme;

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // The selected theme still applies when persistence is unavailable.
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (!weather) return undefined;

    const clockInterval = window.setInterval(() => {
      setCurrentTime(Date.now());
    }, 30_000);

    return () => window.clearInterval(clockInterval);
  }, [weather]);

  /**
   * Runs a combined weather request and updates weather and forecast state.
   *
   * @param {Function} weatherRequest - Function that returns a weather data promise.
   * @param {boolean} [preserveLocation=false] - Keep the existing display location.
   */
  const fetchWeather = async (weatherRequest, preserveLocation = false) => {
    setLoading(true);
    setError("");

    try {
      const data = await weatherRequest();
      setWeather(data.weather);
      setForecast(normalizeForecast(data.forecast));
      setCurrentTime(Date.now());

      if (!preserveLocation) {
        setDisplayLocation(data.location || {
          name: data.weather.name,
          country: data.weather.sys.country,
        });
      }
    } catch (err) {
      setWeather(null);
      setDisplayLocation(null);
      setForecast([]);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles the city search form submission.
   *
   * @param {React.<HTMLFormElement>} event - The form submit event.
   */
  const searchByCity = async (event) => {
    event.preventDefault();

    if (!city.trim()) {
      setError("Please enter a city.");
      return;
    }

    await fetchWeather(() => getWeatherBundleByCity(city, units));
  };


  /**
   * Handles the coordinate search form submission.
   *
   * @param {React.<HTMLFormElement>} event - The form submit event.
   */
  const searchByCoordinates = async (event) => {
    event.preventDefault();

    // Input validation
    if (!isValidLatitude(lat) || !isValidLongitude(lon)) {
      setError("Please enter both valid latitude and longitude.");
      return;
    }

    await fetchWeather(() =>
      getWeatherBundleByCoordinates(lat, lon, units),
    );
  };
  
  /**
   * Updates the selected unit system and refreshes existing weather data.
   *
   * @param {string} newUnits - The unit system to use for weather data.
   * @returns {Promise<void>}
   */
  const changeUnits = async (newUnits) => {
    if (newUnits === units) return;

    setUnits(newUnits);

    if (!weather) return;

    await fetchWeather(
      () =>
        getWeatherBundleByCoordinates(
          weather.coord.lat,
          weather.coord.lon,
          newUnits,
        ),
      true,
    );
  };

  const temperatureUnit = units === "metric" ? "°C" : "°F";
  const windUnit = units === "metric" ? "m/s" : "mph";
  const visibleForecast = selectForecastDays(forecast, forecastDays);

  return (
    <main className="app">
      <div className="weather-container">
        <header className="app-header">
          <div>
            <h1>Weather App</h1>
            <p>Check the current weather anywhere in the world.</p>
          </div>

          <label className="theme-control">
            <span>Dark mode</span>
            <input
              type="checkbox"
              checked={isDarkMode}
              onChange={(event) => setIsDarkMode(event.target.checked)}
            />
            <span className="theme-switch" aria-hidden="true" />
          </label>
        </header>

        <section className="search-section">
          {/* City Search */}
          <form onSubmit={searchByCity} className="search-form">
            <label htmlFor="city">Search by city</label>

            <div className="input-row">
              <input
                id="city"
                type="text"
                placeholder="e.g. Montreal"
                value={city}
                onChange={(event) => setCity(event.target.value)}
              />

              <button type="submit">Search</button>
            </div>
          </form>

          <div className="divider">
            <span>OR</span>
          </div>

          {/* Coordinate Search */}
          <form
            onSubmit={searchByCoordinates}
            className="coordinates-form"
          >
            <label>Search by coordinates</label>

            <div className="coordinate-inputs">
              <input
                type="number"
                step="any"
                placeholder="Latitude"
                value={lat}
                onChange={(event) => setLat(event.target.value)}
              />

              <input
                type="number"
                step="any"
                placeholder="Longitude"
                value={lon}
                onChange={(event) => setLon(event.target.value)}
              />

              <button type="submit">Search</button>
            </div>
          </form>

          {/* Units */}
          <div className="units">
            <span>Units:</span>

            <button
              className={units === "metric" ? "active" : ""}
              onClick={() => changeUnits("metric")}
            >
              Metric
            </button>

            <button
              className={units === "imperial" ? "active" : ""}
              onClick={() => changeUnits("imperial")}
            >
              Imperial
            </button>
          </div>
        </section>

        {/* Loading */}
        {loading && (
          <div className="message">
            Loading weather...
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {/* Weather */}
        {weather && !loading && (
          <section className="weather-card">
            <div className="weather-header">
              <div>
                <h2>
                  {displayLocation?.name || weather.name},{" "}
                  {displayLocation?.country || weather.sys.country}
                </h2>

                <p className="location-date-time">
                  <time dateTime={new Date(currentTime).toISOString()}>
                    {formatLocationDateTime(currentTime, weather.timezone)}
                  </time>
                </p>

                <p className="description">
                  {weather.weather[0].description}
                </p>
              </div>

              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
              />
            </div>

            <div className="temperature">
              {Math.round(weather.main.temp)}
              {temperatureUnit}
            </div>

            <p className="feels-like">
              Feels like{" "}
              {Math.round(weather.main.feels_like)}
              {temperatureUnit}
            </p>

            <div className="weather-details">
              {/* Humidity */}
              <div className="detail">
                <span className="detail-icon">💧</span>

                <div>
                  <span className="detail-label">
                    Humidity
                  </span>

                  <strong>
                    {weather.main.humidity}%
                  </strong>
                </div>
              </div>

              {/* Wind */}
              <div className="detail">
                <span className="detail-icon">💨</span>

                <div>
                  <span className="detail-label">
                    Wind
                  </span>

                  <strong>
                    {Math.round(weather.wind.speed)}{" "}
                    {windUnit}
                  </strong>
                </div>
              </div>

              {/* Pressure */}
              <div className="detail">
                <span className="detail-icon">🌡️</span>

                <div>
                  <span className="detail-label">
                    Pressure
                  </span>

                  <strong>
                    {weather.main.pressure} hPa
                  </strong>
                </div>
              </div>

              {/* Visibility */}
              <div className="detail">
                <span className="detail-icon">👁️</span>

                <div>
                  <span className="detail-label">
                    Visibility
                  </span>

                  <strong>
                    {(weather.visibility / 1000).toFixed(1)} km
                  </strong>
                </div>
              </div>
            </div>

            {visibleForecast.length > 0 && (
              <section
                className="forecast-section"
                aria-labelledby="forecast-heading"
              >
                <div className="forecast-header">
                  <h3 id="forecast-heading">Forecast</h3>

                  <div
                    className="forecast-toggle"
                    role="group"
                    aria-label="Forecast duration"
                  >
                    <button
                      type="button"
                      className={forecastDays === 3 ? "active" : ""}
                      aria-pressed={forecastDays === 3}
                      onClick={() => setForecastDays(3)}
                    >
                      3-Day
                    </button>

                    <button
                      type="button"
                      className={forecastDays === 5 ? "active" : ""}
                      aria-pressed={forecastDays === 5}
                      onClick={() => setForecastDays(5)}
                    >
                      5-Day
                    </button>
                  </div>
                </div>

                <div className="forecast-grid">
                  {visibleForecast.map((day, index) => (
                    <article
                      className="forecast-day"
                      key={day.date}
                      style={{ animationDelay: `${index * 45}ms` }}
                    >
                      <time dateTime={day.date}>
                        {formatForecastDate(day.date, day.isToday)}
                      </time>

                      {day.icon && (
                        <img
                          src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                          alt={day.description}
                        />
                      )}

                      <p>{day.description}</p>

                      <div className="forecast-temperatures">
                        <span>
                          <small>High</small>
                          <strong>
                            {Math.round(day.max)}{temperatureUnit}
                          </strong>
                        </span>

                        <span>
                          <small>Low</small>
                          <strong>
                            {Math.round(day.min)}{temperatureUnit}
                          </strong>
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </section>
        )}

        {/* Empty State */}
        {!weather && !loading && !error && (
          <div className="empty-state">
            <span>🌤️</span>

            <h2>Search for a location</h2>

            <p>
              Enter a city or coordinates to see the current
              weather.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

export default App;
