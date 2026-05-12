/**
 * @file WeatherCard.jsx
 * @description Implementarea componentei reactive pentru interfața utilizator.
 * @author Crudu Ioana Andreea
 * @contribution Dezvoltarea UI/UX, gestionarea stării (state) și integrarea Tailwind CSS v4.
 * ─────────────────────────────────────────────────────────────
 * Funcționalități: 
 * - Conversie C/F (click pe grade sau buton)
 * - Ceas local sincronizat cu timezone-ul orașului
 * - Integrare imagini dinamice Wikipedia
 * - Sistem de Favorite (Local Storage)
 * - Recomandări AI bazate pe condiții
 * - Direcția vântului convertită în puncte cardinale (Cerință Proiect 11)
 * ─────────────────────────────────────────────────────────────
 */

import { useState, useEffect } from 'react';
import { celsiusToFahrenheit, getTempColorClass, getTempLabel } from '../utils/temperature.js';
import { formatLocalTime, getTodayLabel } from '../utils/time.js';
import { getRecommendations, getRecommendationClasses } from '../utils/recommendation.js';
import { fetchCityImage } from '../services/wikiService';
import { toggleFavorite, getFavorites } from '../utils/favorites';
import { degreesToCardinalFull } from "../utils/windDirection.js";

export default function WeatherCard({ weather }) {
  const [unit, setUnit] = useState('C');
  const [cityTime, setCityTime] = useState('');
  const [cityImg, setCityImg] = useState(null);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    // 1. Calculăm ora locală a orașului căutat folosind offset-ul de la API
    const updateTime = () => {
      const now = new Date();
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const targetTime = new Date(utc + (1000 * weather.timezone));
      setCityTime(targetTime.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: false 
      }));
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    
    // 2. Preluăm imaginea de pe Wikipedia pentru fundal
    fetchCityImage(weather.cityName)
      .then(img => setCityImg(img))
      .catch(() => setCityImg(null));

    // 3. Verificăm dacă orașul este deja la favorite
    setIsFav(getFavorites().includes(weather.cityName));

    return () => clearInterval(timer);
  }, [weather.cityName, weather.timezone]);

  // Calcule pentru afișare unități
  const displayTemp = unit === 'C' ? weather.tempC : celsiusToFahrenheit(weather.tempC);
  const displayFeels = unit === 'C' ? weather.feelsLikeC : celsiusToFahrenheit(weather.feelsLikeC);
  
  // Procesare date pentru UI
  const recommendations = getRecommendations(weather);
  const sunriseTime = formatLocalTime(weather.sunrise, weather.timezone);
  const sunsetTime = formatLocalTime(weather.sunset, weather.timezone);

  // Gestiune favorite
  const handleToggleFav = () => {
    toggleFavorite(weather.cityName);
    setIsFav(!isFav);
    window.dispatchEvent(new Event('favoritesUpdated'));
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-fade-in pb-12 px-4">
      
      {/* ── HERO SECTION: Imagine, Temperatură și Favorite ── */}
      <div className="relative h-[450px] w-full rounded-[3.5rem] overflow-hidden shadow-2xl group bg-slate-800">
        <div className="absolute inset-0">
          {cityImg ? (
            <img 
              src={cityImg} 
              className="w-full h-full object-cover opacity-60 transition-transform duration-1000 group-hover:scale-110" 
              alt={weather.cityName} 
            />
          ) : (
            <div className="w-full h-full animate-mesh" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        </div>

        <div className="absolute bottom-12 left-10 right-10 flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="text-left space-y-2">
            <div className="flex flex-wrap items-center gap-4">
               <h2 className="text-6xl md:text-7xl font-display font-bold text-white drop-shadow-lg flex items-center gap-4">
                 {weather.cityName}
                 <button 
                  onClick={handleToggleFav} 
                  className="text-3xl transition-transform hover:scale-125 active:scale-90 outline-none"
                 >
                    {isFav ? '⭐' : '☆'}
                 </button>
               </h2>
               <div className="px-5 py-1.5 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 text-white font-mono text-sm tracking-widest">
                 {cityTime}
               </div>
            </div>
            <p className="text-white/60 text-xl font-body uppercase tracking-[0.4em] ml-1">{weather.description}</p>
          </div>
          
          <div className="text-right flex flex-col items-end">
            <div 
              onClick={() => setUnit(unit === 'C' ? 'F' : 'C')}
              className={`text-[10rem] md:text-[12rem] font-display font-bold leading-[0.8] tracking-tighter drop-shadow-2xl cursor-pointer select-none transition-colors ${getTempColorClass(weather.tempC)}`}
            >
              {displayTemp}°
            </div>
            <div className="flex items-center gap-4 mt-6 mr-4">
              <span className="text-white/30 font-mono text-[10px] uppercase tracking-widest">Toggle Unit</span>
              <button 
                onClick={() => setUnit(unit === 'C' ? 'F' : 'C')} 
                className="px-4 py-1 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white/70 font-mono text-xs transition-all active:scale-95"
              >
                STATION: °{unit}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── DASHBOARD GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recomandări AI */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between px-4">
            <h3 className="text-white/40 font-mono text-[10px] uppercase tracking-[0.3em]">Weather analysis</h3>
            <span className="h-[1px] flex-1 bg-white/10 ml-4"></span>
          </div>
          
          {recommendations.map((rec, i) => {
            const colors = getRecommendationClasses(rec.color);
            return (
              <div 
                key={i} 
                className={`${colors.bg} ${colors.border} border p-7 rounded-[2.5rem] backdrop-blur-md transition-all hover:translate-x-2 group cursor-default`}
              >
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-4xl group-hover:animate-bounce">{rec.icon}</span>
                  <h4 className={`font-bold text-lg ${colors.text}`}>{rec.text}</h4>
                </div>
                <p className="text-sm text-white/50 leading-relaxed">{rec.detail}</p>
              </div>
            );
          })}
        </div>

        {/* Metrici Detaliate */}
        <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-4">
           <MetricBox label="Humidity" value={`${weather.humidity}%`} icon="💧" color="text-blue-400" />
           
           {/* MetricBox pentru Vânt actualizat cu direcție textuală */}
           <MetricBox 
              label="Wind Condition" 
              value={`${weather.windSpeed} m/s`} 
              subValue={degreesToCardinalFull(weather.windDeg)}
              windDeg={weather.windDeg} // Trimitem și gradele pentru rotație
              icon="💨" 
              color="text-indigo-400" 
           />

           <MetricBox label="Pressure" value={`${weather.pressure} hPa`} icon="⏲️" color="text-emerald-400" />
           <MetricBox label="Cloud Cover" value={`${weather.clouds}%`} icon="☁️" color="text-slate-400" />
           <MetricBox label="Sunrise" value={sunriseTime} icon="🌅" color="text-amber-400" />
           <MetricBox label="Sunset" value={sunsetTime} icon="🌇" color="text-orange-400" />
           
           <div className="col-span-2 md:col-span-3 bg-white/5 border border-white/5 p-6 rounded-[2.5rem] flex items-center justify-between px-10">
              <div className="flex flex-col">
                <span className="text-[10px] text-white/20 uppercase font-mono tracking-widest">Metadata</span>
                <span className="text-white/60 font-body tracking-tight">
                  Country: {weather.country} • Feels like {displayFeels}°{unit} • {getTempLabel(weather.tempC)}
                </span>
              </div>
              <div className="text-white/20 font-mono text-[10px]">
                {getTodayLabel()}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

/// Componentă internă pentru casetele de metrici

function MetricBox({ label, value, subValue, icon, color }) {
  return (
    <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] flex flex-col items-center justify-center text-center group hover:bg-white/10 transition-all backdrop-blur-xl border-t-white/20">
      
      {/* Main Icon */}
      <span className="text-4xl mb-4 group-hover:rotate-12 transition-transform duration-500">
        {icon}
      </span>

      {/* Main Value (e.g., 3.6 m/s) */}
      <div className={`text-3xl font-bold font-display tracking-tight ${color}`}>
        {value}
      </div>
      
      {/* Direction Text (e.g., WEST) */}
      {subValue && (
        <div className="text-white/60 text-xs font-medium mt-1 uppercase tracking-wider">
          {subValue}
        </div>
      )}
      
      {/* Bottom Label (e.g., WIND CONDITION) */}
      <div className="text-[10px] uppercase tracking-[0.2em] text-white/30 mt-2 font-mono">
        {label}
      </div>
    </div>
  );
}