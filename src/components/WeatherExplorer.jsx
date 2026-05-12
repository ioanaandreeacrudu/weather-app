/**
 * @file WeatherExplorer.jsx
 * @description Implementarea componentei reactive pentru interfața utilizator.
 * @author Crudu Ioana Andreea
 * @contribution Dezvoltarea UI/UX, gestionarea stării (state) și integrarea Tailwind CSS v4.
 */

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
  const [activeFilter, setActiveFilter] = useState('Clear');
  const [cityData, setCityData] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="text-white/20 animate-pulse text-center py-10">Scanning global atmosphere...</div>;

  return (
    <div className="w-full space-y-8 px-4 md:px-0">
      
      {/* 1. Selector de Vreme - Optimizat pentru Mobile Scroll */}
      <div className="flex justify-start md:justify-center overflow-x-auto no-scrollbar gap-3 pb-4 -mx-4 px-4 snap-x">
        {[
          { id: 'Clear', label: 'Sunny', icon: '☀️' },
          { id: 'Rain', label: 'Rainy', icon: '🌧️' },
          { id: 'Snow', label: 'Snowy', icon: '❄️' },
          { id: 'Clouds', label: 'Cloudy', icon: '☁️' }
        ].map(filter => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-6 py-4 rounded-[2rem] transition-all border whitespace-nowrap snap-center flex items-center gap-3 ${
              activeFilter === filter.id 
              ? 'bg-emerald-500 border-emerald-400 text-slate-900 shadow-lg shadow-emerald-500/20 scale-100' 
              : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
            }`}
          >
            <span className="text-xl">{filter.icon}</span>
            <span className="font-bold text-sm uppercase tracking-wider">{filter.label}</span>
          </button>
        ))}
      </div>

      {/* 2. Rezultate pe Continente - Grid complet responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {['Europa', 'USA', 'Asia'].map(region => (
          <div key={region} className="glass-vibrant p-8 rounded-[2.5rem] border border-white/5 flex flex-col h-full">
            <h4 className="text-[10px] uppercase tracking-[0.4em] text-emerald-400 mb-6 font-mono font-bold">
              {region}
            </h4>
            
            <div className="space-y-4 flex-1">
              {filteredCities.filter(c => c.region === region).length > 0 ? (
                filteredCities.filter(c => c.region === region).map(city => (
                  <div key={city.cityName} className="flex justify-between items-center group cursor-default border-b border-white/[0.03] pb-2 last:border-0">
                    <span className="text-white/80 group-hover:text-white transition-colors text-base">
                      {city.cityName}
                    </span>
                    <span className="font-bold text-emerald-400 font-mono">
                      {city.tempC}°
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center py-4 bg-white/[0.02] rounded-2xl border border-dashed border-white/10">
                   <span className="text-white/20 text-[10px] uppercase tracking-widest italic">No location found</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}