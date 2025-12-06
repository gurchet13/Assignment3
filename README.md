# Weather App (OpenWeatherMap)

A simple web application that connects to the OpenWeatherMap API to display current weather and forecast data for a user-entered city.

## Features
- Search for weather by city name.
- Displays current temperature, conditions, and humidity.
- Shows a brief upcoming forecast.
- Built with  HTML, CSS, and JavaScript.

## Files Included
- index.html
- style.css
- script.js
- config.js
- .gitignore

  API key Setup

You need an API key to run this project:
1. Sign up for a free account at [OpenWeatherMap](https://openweathermap.org/).
2. Navigate to **My API keys**and generate a new key.
3. It may take 10-15 minutes for a new key to become active.*

## How to Run Locally
1. Create a file named `config.js` in the root folder (same folder as `script.js`).
2. Add the following line to that file, replacing the text with your actual key:
   ```javascript
   const WEATHER_API_KEY = "PASTE_YOUR_KEY_HERE";
