import { useState, useEffect } from 'react';
import { fetchWeatherByCity } from '../services/weatherService';

const KEY_CITIES = [
  { name: 'London', region: 'Europa' }, { name: 'Bucharest', region: 'Europa' },
  { name: 'Iasi', region: 'Europa' }, { name: 'Paris', region: 'Europa' },
  { name: 'New York', region: 'USA' }, { name: 'Miami', region: 'USA' },
  { name: 'Tokyo', region: 'Asia' }, { name: 'Dubai', region: 'Asia' },
  { name: 'Sydney', region: 'Australia' }
];

export default function WeatherExplorer() {
  const [activeFilter, setActiveFilter] = useState('Clear'); // Default: Însorit
  const [cityData, setCityData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Încărcăm datele pentru toate orașele la montarea componentei
  useEffect(() => {
    const loadAll = async () => {
      try {
        const results = await Promise.all(
          KEY_CITIES.map(async city => {
            const data = await fetchWeatherByCity(city.name);
            return { ...data, region: city.region };
          })
        );
        setCityData(results);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    loadAll();
  }, []);

  const filteredCities = cityData.filter(city => city.mainCondition === activeFilter);

  if (loading) return <div className="text-white/20 animate-pulse">Scanning global atmosphere...</div>;

  return (
    <div className="w-full space-y-6">
      {/* Selector de Vreme */}
      <div className="flex justify-center gap-4">
        {[
          { id: 'Clear', label: 'Sunny', icon: '☀️' },
          { id: 'Rain', label: 'Rainy', icon: '🌧️' },
          { id: 'Snow', label: 'Snowy', icon: '❄️' },
          { id: 'Clouds', label: 'Cloudy', icon: '☁️' }
        ].map(filter => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-6 py-3 rounded-full transition-all border ${
              activeFilter === filter.id 
              ? 'bg-emerald-500 border-emerald-400 text-slate-900 shadow-lg shadow-emerald-500/20 scale-105' 
              : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
            }`}
          >
            {filter.icon} {filter.label}
          </button>
        ))}
      </div>

      {/* Rezultate pe Continente */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['Europa', 'USA', 'Asia'].map(region => (
          <div key={region} className="glass-vibrant p-6 rounded-[2rem] border-white/5">
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-emerald-400 mb-4 font-mono">{region}</h4>
            <div className="space-y-3">
              {filteredCities.filter(c => c.region === region).length > 0 ? (
                filteredCities.filter(c => c.region === region).map(city => (
                  <div key={city.cityName} className="flex justify-between items-center group cursor-default">
                    <span className="text-white/80 group-hover:text-white transition-colors">{city.cityName}</span>
                    <span className="font-bold text-emerald-400">{city.tempC}°</span>
                  </div>
                ))
              ) : (
                <span className="text-white/10 text-xs italic">No location found</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}