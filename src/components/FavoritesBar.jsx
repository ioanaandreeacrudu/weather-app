import { useEffect, useState } from 'react';
import { getFavorites } from '../utils/favorites';

export default function FavoritesBar({ onSelectCity, currentCity }) {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    setFavorites(getFavorites());
    const handleUpdate = () => setFavorites(getFavorites());
    window.addEventListener('favoritesUpdated', handleUpdate);
    return () => window.removeEventListener('favoritesUpdated', handleUpdate);
  }, []);

  return (
    <div className="w-full animate-fade-in">
      <div className="flex flex-col gap-3">
        {/* Label discret */}
        <div className="flex items-center gap-2 px-2">
          <span className={`h-1 w-1 rounded-full animate-pulse ${favorites.length > 0 ? 'bg-emerald-400' : 'bg-white/20'}`}></span>
          <h3 className="text-white/30 text-[10px] uppercase tracking-[0.3em] font-mono">
            Pinned Locations
          </h3>
        </div>

        {/* Container Dinamic: Butoane sau Mesaj Empty State */}
        <div className="flex flex-wrap gap-2 min-h-[46px] items-center">
          {favorites.length > 0 ? (
            favorites.map(city => (
              <button
                key={city}
                onClick={() => onSelectCity(city)}
                className={`
                  px-6 py-2.5 rounded-2xl transition-all duration-500 flex items-center gap-3 group
                  backdrop-blur-md border
                  ${currentCity === city 
                    ? 'bg-white/10 border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.1)] text-white scale-105' 
                    : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10 hover:border-white/20 hover:text-white'}
                `}
              >
                <span className={`text-xs transition-colors ${currentCity === city ? 'text-yellow-400' : 'text-white/20 group-hover:text-yellow-400'}`}>
                  ★
                </span>
                <span className="text-sm font-medium tracking-wide">{city}</span>
              </button>
            ))
          ) : (
            <div className="flex items-center gap-3 px-4 py-2 bg-white/[0.02] border border-dashed border-white/10 rounded-2xl animate-pulse">
              <span className="text-white/10 text-xs">☆</span>
              <p className="text-[10px] text-white/20 font-mono uppercase tracking-widest">
                No cities pinned. Search and click the star icon to save your favorites.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}