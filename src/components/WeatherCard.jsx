/**
 * WeatherCard.jsx
 * ─────────────────────────────────────────────────────────────
 * RESPONSIBILITY: Display all weather metrics for a city.
 * ─────────────────────────────────────────────────────────────
 */

import { useState } from 'react';
import { celsiusToFahrenheit, getTempColorClass, getTempLabel } from '../utils/temperature.js';
import { degreesToCardinal, degreesToCardinalFull, getWindDescription } from '../utils/windDirection.js';
import { formatLocalTime, getTodayLabel } from '../utils/time.js';
import { getRecommendations, getRecommendationClasses } from '../utils/recommendation.js';

/**
 * WeatherCard
 *
 * @param {object} props
 * @param {import('../services/weatherService').WeatherData} props.weather
 */
export default function WeatherCard({ weather }) {
  // Toggle between Celsius and Fahrenheit
  const [unit, setUnit] = useState('C');

  const tempC = weather.tempC;
  const tempF = celsiusToFahrenheit(tempC);
  const feelsC = weather.feelsLikeC;
  const feelsF = celsiusToFahrenheit(feelsC);

  const displayTemp = unit === 'C' ? tempC : tempF;
  const displayFeels = unit === 'C' ? feelsC : feelsF;
  const unitSymbol = unit === 'C' ? '°C' : '°F';

  const iconUrl = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;
  const sunrise = formatLocalTime(weather.sunrise, weather.timezone);
  const sunset = formatLocalTime(weather.sunset, weather.timezone);
  const windDir = degreesToCardinal(weather.windDeg);
  const windFull = degreesToCardinalFull(weather.windDeg);
  const windDesc = getWindDescription(weather.windSpeed);
  const tempColor = getTempColorClass(tempC);
  const tempLabel = getTempLabel(tempC);

  // Analiză pentru recomandări inteligente
  const recommendations = getRecommendations({
    tempC: weather.tempC,
    mainCondition: weather.mainCondition,
    description: weather.description,
    windSpeed: weather.windSpeed,
    humidity: weather.humidity,
    clouds: weather.clouds
  });

  return (
    <div className="animate-scale-in w-full max-w-xl mx-auto space-y-4">

      {/* ── Demo badge ── */}
      {weather._isDemo && (
        <div className="mb-3 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse-soft" />
            Demo mode — add your API key in .env
          </span>
        </div>
      )}

      {/* ── Main card ── */}
      <div className="
        relative overflow-hidden
        bg-white/10 backdrop-blur-md
        border border-white/20
        rounded-3xl p-6
        shadow-2xl
      ">

        {/* ── Header: city + date ── */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="font-display text-3xl font-bold text-white leading-tight">
              {weather.cityName}
              <span className="ml-2 font-body text-base font-normal text-white/50">
                {weather.country}
              </span>
            </h2>
            <p className="font-body text-sm text-white/50 mt-0.5">{getTodayLabel()}</p>
          </div>

          {/* Unit toggle button */}
          <button
            onClick={() => setUnit(u => u === 'C' ? 'F' : 'C')}
            aria-label={`Switch to °${unit === 'C' ? 'F' : 'C'}`}
            className="
              flex items-center gap-1
              px-3 py-1.5
              bg-white/10 hover:bg-white/20
              border border-white/20
              rounded-xl
              font-mono text-sm text-white/70 hover:text-white
              transition-all duration-200
            "
          >
            <span className={unit === 'C' ? 'text-white font-semibold' : 'text-white/40'}>°C</span>
            <span className="text-white/30">|</span>
            <span className={unit === 'F' ? 'text-white font-semibold' : 'text-white/40'}>°F</span>
          </button>
        </div>

        {/* ── Temperature + Icon ── */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className={`font-display text-7xl font-bold leading-none ${tempColor} tabular-nums`}>
              {displayTemp}
              <span className="text-3xl align-top mt-3 inline-block">{unitSymbol}</span>
            </div>
            <p className="font-body text-white/60 mt-1 capitalize text-sm">
              {weather.description}
            </p>
            <p className="font-body text-white/40 text-xs mt-0.5">
              Feels like {displayFeels}{unitSymbol} · {tempLabel}
            </p>
          </div>

          {/* Weather icon */}
          <div className="animate-float">
            <img
              src={iconUrl}
              alt={weather.description}
              className="w-24 h-24 drop-shadow-lg"
              loading="lazy"
            />
          </div>
        </div>

        {/* ── Metric grid ── */}
        <div className="grid grid-cols-2 gap-3">
          <MetricTile label="Humidity" value={`${weather.humidity}%`} icon="💧" />
          <MetricTile label="Pressure" value={`${weather.pressure} hPa`} icon="🔵" />
          <MetricTile label="Visibility" value={`${(weather.visibility / 1000).toFixed(1)} km`} icon="👁️" />
          <MetricTile label="Cloud cover" value={`${weather.clouds}%`} icon="☁️" />

          {/* Wind tile */}
          <div className="col-span-2 bg-white/5 border border-white/10 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-body text-xs text-white/40 uppercase tracking-wider mb-1">Wind</div>
                <div className="font-mono text-lg text-white font-semibold">
                  {weather.windSpeed} m/s
                </div>
                <div className="font-body text-xs text-white/50 mt-0.5">{windDesc}</div>
              </div>
              <div className="text-right">
                <div className="font-display text-4xl text-white/80">{windDir}</div>
                <div className="font-body text-xs text-white/40">{windFull}</div>
              </div>
            </div>
          </div>

          <MetricTile label="Sunrise" value={sunrise} icon="🌅" />
          <MetricTile label="Sunset" value={sunset} icon="🌇" />
        </div>
      </div>

      {/* ── Recommendations Section ── */}
      <div className="grid grid-cols-1 gap-2">
        {recommendations.map((rec, index) => {
          const classes = getRecommendationClasses(rec.color);
          return (
            <div 
              key={index} 
              className={`flex items-center gap-4 p-4 rounded-2xl border animate-slide-up ${classes.bg} ${classes.border}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <span className="text-2xl">{rec.icon}</span>
              <div>
                <h4 className={`font-bold text-sm ${classes.text}`}>{rec.text}</h4>
                <p className="text-xs text-white/60 leading-tight">{rec.detail}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * MetricTile — small reusable stat card inside WeatherCard.
 */
function MetricTile({ label, value, icon }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
      <div className="font-body text-xs text-white/40 uppercase tracking-wider mb-1">{label}</div>
      <div className="flex items-center justify-between">
        <div className="font-mono text-base text-white font-semibold">{value}</div>
        <span className="text-lg opacity-70">{icon}</span>
      </div>
    </div>
  );
}