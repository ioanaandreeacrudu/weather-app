import { useState } from 'react';
import { fetchWeatherByCity, fetchForecast } from './services/weatherService';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import FavoritesBar from './components/FavoritesBar'; 
import GlobalStats from './components/GlobalStats';
import WeatherInsights from './components/WeatherInsights';
import WeatherParticles from './components/WeatherParticles';
import ForecastRow from './components/ForecastRow';

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
      // Lansăm ambele cereri în paralel pentru performanță optimă
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
      {weather && <WeatherParticles condition={weather.mainCondition} />}

      {/* 2. HEADER - Logotip tipografic interactiv */}
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
            Back to Home
          </button>
        )}

        {/* Listă Favorite (Container subtil) */}
        <div className="w-full bg-white/[0.02] border border-white/[0.05] p-6 rounded-[2.5rem] backdrop-blur-sm animate-scale-in">
           <FavoritesBar onSelectCity={handleSearch} currentCity={weather?.cityName} />
        </div>

        {/* Mesaje de eroare */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-300 px-8 py-4 rounded-3xl animate-shake">
            {error}
          </div>
        )}

        {/* DASHBOARD REZULTATE (Weather actual + Prognoză) */}
        {weather && (
          <div className="w-full space-y-8 animate-fade-in">
            <WeatherCard weather={weather} />
            {forecast && <ForecastRow forecast={forecast} />}
          </div>
        )}

        {/* LANDING PAGE (Global Stats + Insights) */}
        {!weather && !loading && !error && (
          <div className="w-full space-y-12 animate-slide-up flex flex-col items-center">
            <GlobalStats />
            <WeatherInsights />
            
            <div className="opacity-20 text-[10px] font-mono uppercase tracking-[0.5em] mt-10">
              Precision Monitoring System / Powered by Open Weather API  
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;