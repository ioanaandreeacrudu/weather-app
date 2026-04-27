import { useState } from 'react';
import { fetchWeatherByCity } from './services/weatherService';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';

function App() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (city) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherByCity(city);
      setWeather(data);
    } catch (err) {
      setError(err.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-8 flex flex-col items-center gap-8">
      <header className="text-center animate-fade-in">
        <h1 className="text-6xl font-display font-bold text-white mb-2">Aether</h1>
        <p className="text-slate-400 font-body tracking-widest text-xs uppercase">Real-time Weather Intelligence</p>
      </header>

      <SearchBar onSearch={handleSearch} isLoading={loading} />

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-300 px-6 py-4 rounded-2xl">
          {error}
        </div>
      )}

      {weather && <WeatherCard weather={weather} />}
    </div>
  );
}

export default App;