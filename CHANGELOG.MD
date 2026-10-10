# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and follows [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
* Dark mode toggle for user interface customization.


## [1.1.0] 2026-10-10

### Added
* Display date and time of the current city.

[Full Changelog](https://github.com/knors22/my-weather-app/compare/v1.0.1...v1.1.0)


## [1.0.1] 2026-10-10

### Fixed
* Display 4-day forecast instead of 5-day for locations with a timezone of the next day (e.g. user in New York searching for a location in Sydney).

[Full Changelog](https://github.com/knors22/my-weather-app/compare/v1.0.0...v1.0.1)


## [1.0.0] 2026-10-10

### Changed
* Enhanced responsive layout for desktop, tablet, and mobile screens.
* Improved smooth transitions or animations for a more polished user experience.

[Full Changelog](https://github.com/knors22/my-weather-app/compare/v0.2.1...v1.0.0)


## [0.2.1] 2026-10-10

### Added
* `.env.example` file to provide a template for environment variable configuration.

[Full Changelog](https://github.com/knors22/my-weather-app/compare/v0.2.0...v0.2.1)


## [0.2.0] 2026-10-10

### Added
* Three-day and five-day weather forecast using OpenWeatherMap forecast data.
* Toggle for switching between forecast durations without additional API requests.
* Timezone-aware forecast grouping starting from the following day.
* Responsive forecast layout with subtle animations and reduced-motion support.
* Concurrent current-weather and forecast requests for faster loading.
* Single geocoding request per city search to avoid redundant API calls.

[Full Changelog](https://github.com/knors22/my-weather-app/compare/v0.1.1...v0.2.0)


## [0.1.1] 2026-09-04

### Added
* Location validation to ensure user input is valid before making API requests.
* Geocoding integration to convert city names into geographic coordinates for accurate weather data retrieval.

[Full Changelog](https://github.com/knors22/my-weather-app/compare/v0.1.0...v0.1.1)


## [0.1.0] 2026-09-03

### Added
* `App.jsx` to manage the main application structure and state, and CSS styling.
* Dynamic weather search by city name or geographic coordinates.
* Celsius and Fahrenheit unit toggle.
* Current weather display with temperature, humidity, wind speed, condition text, and weather icons.
* Initial error messages for invalid locations or failed requests.

[Full Changelog](https://github.com/knors22/my-weather-app/compare/v0.0.2...v0.1.0)


## [0.0.2] 2026-09-03

### Added
* Environment variable for the API key in `.env` file.
* API integration with OpenWeatherMap for fetching current weather by city name or geographic coordinates.

[Full Changelog](https://github.com/knors22/my-weather-app/compare/v0.0.1...v0.0.2)


## [0.0.1] 2026-09-03

### Added
* Initial project setup with React and Vite.
* README file with project description, features, technologies used, installation instructions, and usage guidelines.