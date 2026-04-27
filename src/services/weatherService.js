/**
 * weatherService.js
 * ─────────────────────────────────────────────────────────────
 * RESPONSIBILITY: All communication with the OpenWeatherMap API.
 * UI components MUST NOT contain fetch/axios logic — they call
 * functions from this module only.
 *
 * Developer note (Team separation):
 *   → This file is owned by the "Logic" developer.
 *   → UI developers consume the exported functions only.
 * ─────────────────────────────────────────────────────────────
 */

import axios from 'axios';

// ─── Configuration ───────────────────────────────────────────
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * Axios instance pre-configured with the base URL and API key.
 * Using an instance keeps all API concerns in one place.
 */
const weatherAPI = axios.create({
  baseURL: BASE_URL,
  params: {
    appid: API_KEY,
    units: 'metric', // Always fetch in Celsius; conversion is done client-side
  },
});

// ─── Data Fetching ────────────────────────────────────────────

/**
 * Fetches current weather data for a given city name.
 *
 * @param {string} city - The name of the city (e.g. "London")
 * @returns {Promise<WeatherData>} Normalised weather data object
 * @throws Will throw an Error with a user-friendly message on failure
 */
export async function fetchWeatherByCity(city) {
  if (!city || city.trim() === '') {
    throw new Error('Please enter a city name.');
  }

  if (!API_KEY || API_KEY === 'your_api_key_here') {
    // ── Demo mode: return mock data so the app is usable without a key ──
    return getMockWeatherData(city);
  }

  try {
    const { data } = await weatherAPI.get('/weather', {
      params: { q: city.trim() },
    });
    return normaliseWeatherData(data);
  } catch (error) {
    // Translate HTTP / network errors into human-readable messages
    if (error.response) {
      const status = error.response.status;
      if (status === 404) throw new Error(`City "${city}" not found. Check the spelling and try again.`);
      if (status === 401) throw new Error('Invalid API key. Please check your .env configuration.');
      if (status === 429) throw new Error('Too many requests. Please wait a moment before trying again.');
      throw new Error(`Weather service error (${status}). Please try again.`);
    }
    if (error.request) {
      throw new Error('No response from weather service. Check your internet connection.');
    }
    throw new Error('An unexpected error occurred. Please try again.');
  }
}

// ─── Data Normalisation ───────────────────────────────────────

/**
 * Transforms the raw OpenWeatherMap API response into a clean,
 * predictable shape used throughout the application.
 *
 * @param {object} raw - Raw API response object
 * @returns {WeatherData}
 *
 * @typedef {object} WeatherData
 * @property {string}  cityName
 * @property {string}  country
 * @property {number}  tempC         - Temperature in Celsius
 * @property {number}  feelsLikeC    - Feels-like temperature in Celsius
 * @property {number}  humidity      - Humidity percentage (0-100)
 * @property {number}  windSpeed     - Wind speed in m/s
 * @property {number}  windDeg       - Wind direction in degrees (0-360)
 * @property {number}  pressure      - Atmospheric pressure in hPa
 * @property {number}  visibility    - Visibility in meters
 * @property {string}  description   - Human-readable weather description
 * @property {string}  icon          - OpenWeatherMap icon code
 * @property {string}  mainCondition - Main weather condition (e.g. "Rain")
 * @property {number}  sunrise       - Sunrise time as Unix timestamp (UTC)
 * @property {number}  sunset        - Sunset time as Unix timestamp (UTC)
 * @property {number}  timezone      - Timezone offset in seconds from UTC
 * @property {number}  clouds        - Cloud coverage percentage
 */
function normaliseWeatherData(raw) {
  return {
    cityName:      raw.name,
    country:       raw.sys.country,
    tempC:         Math.round(raw.main.temp),
    feelsLikeC:    Math.round(raw.main.feels_like),
    humidity:      raw.main.humidity,
    windSpeed:     raw.wind.speed,
    windDeg:       raw.wind.deg ?? 0,
    pressure:      raw.main.pressure,
    visibility:    raw.visibility,
    description:   raw.weather[0].description,
    icon:          raw.weather[0].icon,
    mainCondition: raw.weather[0].main,
    sunrise:       raw.sys.sunrise,
    sunset:        raw.sys.sunset,
    timezone:      raw.timezone,
    clouds:        raw.clouds?.all ?? 0,
  };
}

// ─── Mock Data (Demo / No API Key) ────────────────────────────

/**
 * Returns realistic mock data for demo purposes.
 * Triggered when no valid API key is configured.
 *
 * @param {string} city
 * @returns {WeatherData}
 */
function getMockWeatherData(city) {
  const now = Math.floor(Date.now() / 1000);
  return {
    cityName:      city.charAt(0).toUpperCase() + city.slice(1),
    country:       'RO',
    tempC:         18,
    feelsLikeC:    16,
    humidity:      62,
    windSpeed:     4.2,
    windDeg:       220,
    pressure:      1015,
    visibility:    10000,
    description:   'scattered clouds',
    icon:          '03d',
    mainCondition: 'Clouds',
    sunrise:       now - 3600 * 5,
    sunset:        now + 3600 * 5,
    timezone:      7200,
    clouds:        40,
    _isDemo:       true, // flag for UI to show demo badge
  };
}