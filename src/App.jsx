import { useState } from "react";
import "./App.css";
import {
  getWeatherBundleByCity,
  getWeatherBundleByCoordinates,
} from "./services/weatherApi";
import { normalizeForecast } from "./utils/forecast";
import { isValidLatitude, isValidLongitude } from "./utils/location";

const forecastDateFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: "short",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

/**
 * Formats a forecast date without applying the browser's timezone.
 *
 * @param {string} date - A date formatted as YYYY-MM-DD.
 * @returns {string} A localized weekday and date label.
 */
function formatForecastDate(date) {
  return forecastDateFormatter.format(new Date(`${date}T00:00:00Z`));
}

function App() {
  const [city, setCity] = useState("");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");

  const [units, setUnits] = useState("metric");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [forecastDays, setForecastDays] = useState(3);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /**
   * Runs a combined weather request and updates weather and forecast state.
   *
   * @param {Function} weatherRequest - Function that returns a weather data promise.
   */
  const fetchWeather = async (weatherRequest) => {
    setLoading(true);
    setError("");

    try {
      const data = await weatherRequest();
      setWeather(data.weather);
      setForecast(normalizeForecast(data.forecast));
    } catch (err) {
      setWeather(null);
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

    await fetchWeather(() =>
      getWeatherBundleByCoordinates(
        weather.coord.lat,
        weather.coord.lon,
        newUnits,
      ),
    );
  };

  const temperatureUnit = units === "metric" ? "°C" : "°F";
  const windUnit = units === "metric" ? "m/s" : "mph";

  return (
    <main className="app">
      <div className="weather-container">
        <header>
          <h1>Weather App</h1>
          <p>Check the current weather anywhere in the world.</p>
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
                  {weather.name}, {weather.sys.country}
                </h2>

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

            {forecast.length > 0 && (
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
                  {forecast.slice(0, forecastDays).map((day, index) => (
                    <article
                      className="forecast-day"
                      key={day.date}
                      style={{ animationDelay: `${index * 45}ms` }}
                    >
                      <time dateTime={day.date}>
                        {formatForecastDate(day.date)}
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
