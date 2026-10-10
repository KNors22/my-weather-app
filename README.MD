# Weather Forecasting App

## Description

This project is a dynamic and visually appealing Weather Forecasting App built with React and the OpenWeatherMap API. The assignment focuses on using a JavaScript front-end framework, integrating external API data, managing React state, and presenting weather information in a modern responsive interface.

Users should be able to enter location information, such as a city name or geographic coordinates, and receive current weather data and forecast details from OpenWeatherMap.

## Features

* Dynamic weather search by city name or geographic coordinates.
* Current weather display with temperature, humidity, wind speed, condition text, and weather icons.
* Five-day weather forecast using OpenWeatherMap forecast data.
* Celsius and Fahrenheit unit toggle.
* Responsive layout for desktop, tablet, and mobile screens.
* Smooth transitions or animations for a more polished user experience.
* User-friendly error messages for invalid locations, failed requests, and missing API configuration.

## Technologies Used

* React
* Vite
* JavaScript
* HTML5
* CSS3
* OpenWeatherMap API
* Fetch API

## Installation

### Prerequisites

* Node.js
* npm
* OpenWeatherMap API key from https://openweathermap.org/api

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/KNors22/my-weather-app.git
   cd my-weather-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root and add your OpenWeatherMap API key:

   ```env
   VITE_OPENWEATHER_API_KEY=your_api_key_here
   ```

## Usage

Start the local development server:

```bash
npm run dev
```

Open the local URL shown in the terminal. By default, Vite usually serves the app at:

```text
http://localhost:5173
```

## Available Scripts

```bash
npm run dev
```

Runs the app locally in development mode.

```bash
npm run build
```

Builds the app for production.

```bash
npm run preview
```

Serves the production build locally for preview.

```bash
npm run lint
```

Runs ESLint against the project files.

## OpenWeatherMap API

The app is expected to use OpenWeatherMap endpoints such as:

* Current Weather Data: `https://api.openweathermap.org/data/2.5/weather`
* 5-Day / 3-Hour Forecast: `https://api.openweathermap.org/data/2.5/forecast`

Common request parameters include:

* `q={city name}`
* `lat={latitude}`
* `lon={longitude}`
* `appid={API key}`
* `units={metric|imperial}`

## Code Organization

The project uses a Vite React structure:

```text
my-weather-app/
├── public/             # Static public assets
├── src/                # React source code
│   ├── App.jsx         # Main application component
│   ├── App.css         # App-specific styles
│   ├── index.css       # Global styles
│   ├── main.jsx        # React entry point
│   └── weatherApi.js   # API integration logic for OpenWeatherMap
├── index.html          # HTML entry file used by Vite
├── package.json        # Scripts, dependencies, and project metadata
├── vite.config.js      # Vite configuration
├── .env                # Environment variables (e.g. API keys)
└── README.MD           # Project documentation
```

As the app is expanded, weather-specific UI and API logic can be organized into folders such as:

```text
src/
├── components/         # SearchBar, WeatherDisplay, Forecast, UnitToggle, ErrorMessage
├── services/           # OpenWeatherMap API request helpers
└── assets/             # Images, icons, and other visual assets
```

## Authors and Acknowledgements

* Author: Andrey Gonzalez
* Instructor: Martin Lee from Circuit Stream

## License
This project is licensed under the MIT License. See the LICENSE file for details.