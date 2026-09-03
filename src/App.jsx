import { useState } from "react";
import "./App.css";
import { getWeatherByCity, getWeatherByCoordinates } from './weatherApi';

function App() {
  const [city, setCity] = useState("");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");

  const [units, setUnits] = useState("metric");
  const [weather, setWeather] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /**
   * Runs a weather request and updates loading, weather, and error state.
   *
   * @param {Function} weatherRequest - Function that returns a weather data promise.
   */
  const fetchWeather = async (weatherRequest) => {
    setLoading(true);
    setError("");

    try {
      const data = await weatherRequest();
      setWeather(data);
    } catch (err) {
      setWeather(null);
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

    await fetchWeather(() => getWeatherByCity(city, units));
  };


  /**
   * Handles the coordinate search form submission.
   *
   * @param {React.<HTMLFormElement>} event - The form submit event.
   */
  const searchByCoordinates = async (event) => {
    event.preventDefault();

    if (!lat || !lon) {
      setError("Please enter both latitude and longitude.");
      return;
    }

    await fetchWeather(() => getWeatherByCoordinates({ lat, lon, units }));
  };
  
  /**
   * Updates the selected unit system and refreshes existing weather data.
   *
   * @param {string} newUnits - The unit system to use for weather data.
   * @returns {Promise<void>}
   */
  const changeUnits = async (newUnits) => {
    setUnits(newUnits);

    // Refresh weather using the new unit system 
    if (!weather) return;

    await fetchWeather(() =>
      getWeatherByCoordinates(
        weather.coord.lat, 
        weather.coord.lon, 
        newUnits 
      )
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
