/**
 * @file weatherService.js
 * @description Modul de integrare cu OpenWeatherMap API pentru preluarea datelor meteo în timp real.
 * @author Crudu Ioana Andreea
 * @contribution Implementarea cererilor asincrone și gestionarea erorilor de rețea/oraș inexistent.
 * RESPONSIBILITY: All communication with the OpenWeatherMap API.
 * Includes: Current Weather & 5-Day Forecast.
 * ─────────────────────────────────────────────────────────────
 */

import axios from 'axios';

// ─── Configuration ───────────────────────────────────────────
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * Axios instance pre-configured with the base URL and API key.
 */
const weatherAPI = axios.create({
  baseURL: BASE_URL,
  params: {
    appid: API_KEY,
    units: 'metric', 
  },
});

// ─── Data Fetching ────────────────────────────────────────────

/**
 * Fetches current weather data for a given city.
 */
export async function fetchWeatherByCity(city) {
  if (!city || city.trim() === '') {
    throw new Error('Te rugăm să introduci numele unui oraș.');
  }

  if (!API_KEY || API_KEY === 'api_key_here') {
    return getMockWeatherData(city);
  }

  try {
    const { data } = await weatherAPI.get('/weather', {
      params: { q: city.trim() },
    });
    return normaliseWeatherData(data);
  } catch (error) {
    handleApiError(error, city);
  }
}

/**
 * Fetches 5-day forecast data for a given city.
 */
export async function fetchForecast(city) {
  if (!API_KEY || API_KEY === 'api_key_here') {
    return getMockForecastData();
  }

  try {
    const { data } = await weatherAPI.get('/forecast', {
      params: { q: city.trim() },
    });

    // API-ul returnează date la fiecare 3 ore (40 de intrări).
    // Filtrăm pentru a lua doar o prognoză pe zi (ora 12:00:00).
    return data.list
      .filter(item => item.dt_txt.includes("12:00:00"))
      .map(item => ({
        date: new Date(item.dt * 1000).toLocaleDateString('ro-RO', { weekday: 'short' }),
        temp: Math.round(item.main.temp),
        icon: item.weather[0].icon,
        condition: item.weather[0].main
      }));
  } catch (error) {
    console.error("Forecast Error:", error);
    return []; // Returnăm un array gol în caz de eroare la prognoză pentru a nu bloca aplicația
  }
}

// ─── Helper Functions ─────────────────────────────────────────

function handleApiError(error, city) {
  if (error.response) {
    const status = error.response.status;
    if (status === 404) throw new Error(`Orașul "${city}" nu a fost găsit.`);
    if (status === 401) throw new Error('API Key invalid.');
    if (status === 429) throw new Error('Prea multe cereri. Revino mai târziu.');
    throw new Error(`Eroare service (${status}).`);
  }
  throw new Error('Eroare de conexiune la internet.');
}

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

// ─── Mock Data (Demo Mode) ────────────────────────────────────

function getMockWeatherData(city) {
  const now = Math.floor(Date.now() / 1000);
  return {
    cityName: city.charAt(0).toUpperCase() + city.slice(1),
    country: 'RO',
    tempC: 18,
    feelsLikeC: 16,
    humidity: 62,
    windSpeed: 4.2,
    pressure: 1015,
    description: 'scattered clouds',
    icon: '03d',
    mainCondition: 'Clouds',
    sunrise: now - 3600 * 5,
    sunset: now + 3600 * 5,
    timezone: 7200,
    clouds: 40,
    _isDemo: true,
  };
}

function getMockForecastData() {
  return [
    { date: 'Tommorow', temp: 20, icon: '01d', condition: 'Clear' },
    { date: 'Monday', temp: 19, icon: '02d', condition: 'Clouds' },
    { date: 'Tuesday', temp: 15, icon: '10d', condition: 'Rain' },
    { date: 'Wednesday', temp: 17, icon: '04d', condition: 'Clouds' },
    { date: 'Thursday', temp: 22, icon: '01d', condition: 'Clear' },
  ];
}

/**
 * Convertește gradele vântului în text conform cerinței.
 * Acoperă cele 16 direcții cardinale.
 */
export const getWindDirectionText = (deg) => {
  const directions = [
    "Nord", "Nord-Nord-Est", "Nord-Est", "Est-Nord-Est",
    "Est", "Est-Sud-Est", "Sud-Est", "Sud-Sud-Est",
    "Sud", "Sud-Sud-Vest", "Sud-Vest", "Vest-Sud-Vest",
    "Vest", "Vest-Nord-Vest", "Nord-Vest", "Nord-Nord-Vest"
  ];
  
  // Împărțim 360 grade la 16 sectoare de 22.5 grade
  const index = Math.round((deg % 360) / 22.5) % 16;
  return directions[index];
};