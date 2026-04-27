import { useState, useEffect } from 'react';
import { celsiusToFahrenheit, getTempColorClass, getTempLabel } from '../utils/temperature.js';
import { degreesToCardinal, degreesToCardinalFull, getWindDescription } from '../utils/windDirection.js';
import { formatLocalTime, getTodayLabel } from '../utils/time.js';
import { getRecommendations, getRecommendationClasses } from '../utils/recommendation.js';

export default function WeatherCard({ weather }) {
  const [unit, setUnit] = useState('C');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Ceas Live pentru un look de Dashboard profesional
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const tempC = weather.tempC;
  const tempF = celsiusToFahrenheit(tempC);
  const displayTemp = unit === 'C' ? tempC : tempF;
  const unitSymbol = unit === 'C' ? '°C' : '°F';
  
  const recommendations = getRecommendations({
    tempC: weather.tempC,
    mainCondition: weather.mainCondition,
    description: weather.description,
    windSpeed: weather.windSpeed,
    humidity: weather.humidity,
    clouds: weather.clouds
  });

  return (
    <div className="w-full max-w-7xl mx-auto animate-fade-in space-y-6">
      
      {/* ── TOP BAR: Locație și Ceas ── */}
      <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/10 pb-4 gap-4">
        <div>
          <h2 className="font-display text-5xl font-bold text-white tracking-tight">
            {weather.cityName} <span className="text-2xl font-body font-light text-white/40">{weather.country}</span>
          </h2>
          <p className="text-emerald-400 font-mono text-sm mt-1">● Station Active — Data Synced</p>
        </div>
        <div className="text-right">
          <p className="font-mono text-3xl text-white/80">{currentTime.toLocaleTimeString()}</p>
          <p className="text-white/40 text-sm uppercase tracking-widest">{getTodayLabel()}</p>
        </div>
      </div>

      {/* ── MAIN DASHBOARD GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* PANEL 1: Starea Curentă (Large Hero) */}
        <div className="lg:col-span-4 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-[2rem] p-8 flex flex-col justify-between min-h-[400px] relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <button 
              onClick={() => setUnit(u => u === 'C' ? 'F' : 'C')}
              className="mb-8 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-xs font-mono transition-all"
            >
              UNIT: {unitSymbol} (SWITCH)
            </button>
            <div className={`font-display text-[8rem] font-bold leading-none tracking-tighter ${getTempColorClass(tempC)}`}>
              {displayTemp}°
            </div>
            <p className="text-2xl font-body text-white/80 mt-2 capitalize">{weather.description}</p>
            <p className="text-white/40 mt-1">Real feel: {unit === 'C' ? weather.feelsLikeC : celsiusToFahrenheit(weather.feelsLikeC)}° · {getTempLabel(tempC)}</p>
          </div>
          <img 
            src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`} 
            className="absolute -right-10 -bottom-10 w-64 h-64 opacity-50 blur-sm animate-float" 
            alt="weather icon"
          />
        </div>

        {/* PANEL 2: Statistici Detaliate (Grid) */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-4">
          <DetailCard label="Wind Speed" value={`${weather.windSpeed} m/s`} subValue={getWindDescription(weather.windSpeed)} icon="💨" />
          <DetailCard label="Direction" value={degreesToCardinal(weather.windDeg)} subValue={`${weather.windDeg}° ${degreesToCardinalFull(weather.windDeg)}`} icon="🧭" />
          <DetailCard label="Humidity" value={`${weather.humidity}%`} subValue={weather.humidity > 60 ? 'High' : 'Optimal'} icon="💧" />
          <DetailCard label="Visibility" value={`${(weather.visibility / 1000).toFixed(1)} km`} subValue="Horizontal range" icon="👁️" />
          <DetailCard label="Sunrise" value={formatLocalTime(weather.sunrise, weather.timezone)} subValue="AM Start" icon="🌅" />
          <DetailCard label="Sunset" value={formatLocalTime(weather.sunset, weather.timezone)} subValue="PM End" icon="🌇" />
        </div>

        {/* PANEL 3: Smart AI Insights (Recommendations) */}
        <div className="lg:col-span-3 space-y-4">
          <h3 className="font-mono text-xs uppercase tracking-widest text-white/40 ml-2">Smart Insights</h3>
          {recommendations.map((rec, i) => {
            const colors = getRecommendationClasses(rec.color);
            return (
              <div key={i} className={`p-5 rounded-3xl border ${colors.bg} ${colors.border} transition-all hover:scale-[1.02] cursor-default`}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{rec.icon}</span>
                  <h4 className={`font-bold text-sm ${colors.text}`}>{rec.text}</h4>
                </div>
                <p className="text-xs text-white/50 leading-relaxed">{rec.detail}</p>
              </div>
            );
          })}
        </div>

      </div>

      {/* ── FOOTER: Alte detalii ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-60">
        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center font-mono text-[10px]">
          BAROMETRIC PRESSURE: {weather.pressure} hPa
        </div>
        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center font-mono text-[10px]">
          CLOUD COVERAGE: {weather.clouds}%
        </div>
        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center font-mono text-[10px]">
          TIMEZONE OFFSET: UTC {weather.timezone / 3600 >= 0 ? '+' : ''}{weather.timezone / 3600}h
        </div>
      </div>
    </div>
  );
}

function DetailCard({ label, value, subValue, icon }) {
  return (
    <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] hover:bg-white/10 transition-colors group">
      <div className="flex justify-between items-start mb-4">
        <span className="text-white/30 font-mono text-[10px] uppercase tracking-tighter">{label}</span>
        <span className="text-xl group-hover:scale-110 transition-transform">{icon}</span>
      </div>
      <div className="text-2xl font-bold text-white font-display">{value}</div>
      <div className="text-xs text-white/30 font-body">{subValue}</div>
    </div>
  );
}