/**
 * @file App.jsx
 * @description Implementarea componentei reactive pentru interfața utilizator.
 * @author Crudu Ioana Andreea
 * @contribution Dezvoltarea UI/UX, gestionarea stării (state) și integrarea Tailwind CSS v4.
 */

import { useState } from 'react';
import { fetchWeatherByCity, fetchForecast } from './services/weatherService';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import FavoritesBar from './components/FavoritesBar'; 
import GlobalStats from './components/GlobalStats';
import WeatherInsights from './components/WeatherInsights';
import WeatherParticles from './components/WeatherParticles';
import ForecastRow from './components/ForecastRow';
import WeatherExplorer from './components/WeatherExplorer';

function App() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Resetează starea aplicației pentru a reveni la pagina de start.
   */
  const handleBack = () => {
    setWeather(null);
    setForecast(null);
    setError(null);
  };

  const handleSearch = async (city) => {
    setLoading(true);
    setError(null);
    try {
      const [weatherData, forecastData] = await Promise.all([
        fetchWeatherByCity(city),
        fetchForecast(city)
      ]);
      
      setWeather(weatherData);
      setForecast(forecastData);
    } catch (err) {
      setError(err.message);
      setWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center p-4 md:p-8 overflow-x-hidden">
      {/* 1. FUNDAL ȘI EFECTE ATMOSFERICE */}
      <div className="animate-mesh" />
      <div className="weather-overlay" />
      {/* Transmitem tot obiectul weather pentru a detecta zi/noapte (sunrise/sunset) */}
      {weather && <WeatherParticles weather={weather} />}

      {/* 2. HEADER - Logotip tipografic bicolor */}
      <header className="text-center z-10 mb-8 animate-fade-in flex flex-col items-center">
        <h1 
          onClick={handleBack}
          className="text-7xl font-display font-bold mb-2 drop-shadow-2xl cursor-pointer hover:scale-105 transition-transform active:scale-95 select-none"
          title="Reset Dashboard"
        >
          <span className="text-white/40">de</span>
          <span className="bg-gradient-to-br from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Vreme
          </span>
        </h1>
        <p className="text-emerald-400 font-mono tracking-[0.5em] text-[10px] uppercase opacity-80">
          Meteorological Friend
        </p>
      </header>

      {/* 3. CONȚINUT DINAMIC */}
      <div className="w-full max-w-5xl z-10 space-y-8 flex flex-col items-center">
        
        {/* Bara de căutare Glassmorphism */}
        <SearchBar onSearch={handleSearch} isLoading={loading} />
        
        {/* Buton "Back" discret - Apare doar în pagina de rezultate */}
        {weather && (
          <button 
            onClick={handleBack}
            className="flex items-center gap-2 text-white/30 hover:text-white font-mono text-[10px] uppercase tracking-[0.2em] transition-all group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> 
            Back Home
          </button>
        )}

        {/* Listă Favorite */}
        <div className="w-full bg-white/[0.02] border border-white/[0.05] p-6 rounded-[2.5rem] backdrop-blur-sm animate-scale-in">
           <FavoritesBar onSelectCity={handleSearch} currentCity={weather?.cityName} />
        </div>

        {/* Mesaje de eroare */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-300 px-8 py-4 rounded-3xl animate-shake">
            {error}
          </div>
        )}

        {/* DASHBOARD REZULTATE */}
        {weather && (
          <div className="w-full space-y-8 animate-fade-in">
            <WeatherCard weather={weather} />
            {forecast && <ForecastRow forecast={forecast} />}
          </div>
        )}

        {/* LANDING PAGE - Aranjament vertical (Stacked) */}
        {!weather && !loading && !error && (
          <div className="w-full space-y-16 animate-slide-up flex flex-col items-center">
            
            {/* SECȚIUNEA 1: Global Weather Explorer */}
            <div className="w-full space-y-8 flex flex-col items-center">
              <div className="text-center">
                <h2 className="text-2xl font-display text-white mb-2">Global Weather Explorer</h2>
                <p className="text-white/30 text-[10px] uppercase tracking-[0.3em] font-mono">
                  Select the desired atmosphere on the globe
                </p>
              </div>
              <WeatherExplorer onSelectCity={handleSearch} />
            </div>

            {/* SEPARATOR MODERN CU INDICATOR LIVE */}
            <div className="w-full flex items-center gap-4 py-8 animate-fade-in">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-emerald-500/10 to-emerald-500/30" />
              
              <div className="flex flex-col items-center gap-2 px-6">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <h3 className="text-white font-display text-xl md:text-2xl tracking-[0.2em] font-bold uppercase">
                    Live <span className="text-emerald-400">Global</span> Watch
                  </h3>
                </div>
                <p className="text-white/40 text-sm font-mono tracking-widest uppercase">
                  Worldwide Meteorological Network
                </p>
              </div>

              <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-emerald-500/10 to-emerald-500/30" />
            </div>

            {/* SECȚIUNEA 2: Global Watch (Orașe cheie) */}
            <div className="w-full flex flex-col items-center">
               <GlobalStats />
            </div>

            {/* SECȚIUNEA 3: Climate Insights (Facts) */}
            <div className="w-full max-w-3xl flex flex-col items-center">
               <WeatherInsights />
            </div>
            
            {/* Footer / Branding */}
            <div className="opacity-20 text-[10px] font-mono uppercase tracking-[0.5em] mt-10 text-center">
              Precision Monitoring System / Powered by Open Weather API  
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;