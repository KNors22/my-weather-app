# Weather Forecasting App

A responsive React weather application that combines OpenWeather current conditions, geocoding, and forecast data. Users can search by city, enter coordinates, or select a location on an interactive map.

## Live Demo

[View the Weather Forecasting App on Netlify](https://andreys-weather-app.netlify.app)

## Features

- Search for weather by city name or geographic coordinates.
- Select coordinates by clicking the interactive map.
- Preserve canonical city and country names from OpenWeather geocoding.
- Display current temperature, feels-like temperature, humidity, wind speed, pressure, visibility, condition, and weather icon.
- Show the searched location's current date, time, and GMT offset.
- Switch between three-day and five-day forecast views without making additional API requests.
- Aggregate OpenWeather's three-hour readings into timezone-aware daily high and low forecasts.
- Switch between metric and imperial units.
- Use light or dark mode with saved browser preferences and initial system-theme detection.
- Recenter the map after a successful search and label the marker with OpenWeather's weather-location name.
- Validate coordinate input and show errors for invalid locations, failed requests, or missing API configuration.
- Adapt the layout for desktop, tablet, and mobile screens.
- Respect reduced-motion preferences while providing subtle transitions and animations.

## Technologies

- React 19
- Vite 8
- JavaScript
- CSS3
- OpenWeather API
- Leaflet and React Leaflet
- OpenStreetMap tiles
- Fetch API

## Getting Started

### Prerequisites

- Node.js `20.19+` or `22.12+`
- npm
- An [OpenWeather API key](https://openweathermap.org/api)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/KNors22/my-weather-app.git
   cd my-weather-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create the local environment file from the provided template:

   ```bash
   cp .env.example .env
   ```

4. Add your OpenWeather API key to `.env`:

   ```env
   VITE_OPENWEATHER_API_KEY=your_api_key_here
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

Open the local URL printed by Vite, normally `http://localhost:5173`.

## Usage

### Search by city

Enter a city and select **Search**. The app geocodes the city once, then requests current conditions and forecast data concurrently using the resulting coordinates.

### Search by coordinates

Enter a latitude from `-90` to `90` and a longitude from `-180` to `180`, then select **Search**.

### Select a map location

Click the interactive map to populate the latitude and longitude fields. Select **Search** to request weather for that position. A map click alone does not make an API request.

### Forecast and units

Use the forecast control to switch between three and five days. The app fetches the forecast once per location and unit system, then changes the visible range locally. Changing units refreshes current conditions and forecast data for the existing coordinates.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Create a production build in `dist/`. |
| `npm run preview` | Preview the production build locally. |
| `npm run lint` | Run ESLint across the project. |

## API Integration

The application uses these OpenWeather endpoints:

- Direct Geocoding: `https://api.openweathermap.org/geo/1.0/direct`
- Current Weather: `https://api.openweathermap.org/data/2.5/weather`
- 5-Day / 3-Hour Forecast: `https://api.openweathermap.org/data/2.5/forecast`

City searches perform one geocoding request followed by concurrent current-weather and forecast requests. Coordinate and map searches skip geocoding. Forecast-duration changes do not make new requests.

The interactive map uses OpenStreetMap tiles and displays the required OpenStreetMap attribution.

## Project Structure

```text
my-weather-app/
├── src/
│   ├── components/
│   │   └── LocationMap.jsx    # Interactive Leaflet map
│   ├── services/
│   │   └── weatherApi.js      # OpenWeather request helpers
│   ├── utils/
│   │   ├── dateTime.js        # Location date, time, and GMT formatting
│   │   ├── forecast.js        # Daily forecast normalization and selection
│   │   └── location.js        # Coordinate validation and city geocoding
│   ├── App.jsx                # Application state and UI orchestration
│   ├── App.css                # Component, theme, map, and responsive styles
│   ├── index.css              # Global baseline styles
│   └── main.jsx               # React entry point
├── .env                       # Environment variables (e.g. API keys)
├── CHANGELOG.MD               # Version history
├── index.html                 # HTML entry point
├── package.json               # Dependencies and npm scripts
└── vite.config.js             # Vite configuration
```

## Deployment

The public application is hosted on Netlify:

[https://andreys-weather-app.netlify.app](https://andreys-weather-app.netlify.app)


## Author and Acknowledgements

- Author: Andrey Gonzalez
- Instructor: Martin Lee, Circuit Stream

## License

This project is licensed under the MIT License. See the LICENSE file for details.
