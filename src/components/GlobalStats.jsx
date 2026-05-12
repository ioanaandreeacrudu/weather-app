/**
 * @file GlobalStats.jsx
 * @description Componentă pentru afișarea statisticilor meteorologice la nivel global.
 * @author Crudu Ioana Andreea
 * @contribution Implementarea design-ului pentru secțiunea Global Watch și gestionarea layout-ului responsive.
 */
export default function GlobalStats() {
  const cities = [
    { name: 'London', temp: '12°', icon: '☁️' },
    { name: 'New York', temp: '18°', icon: '☀️' },
    { name: 'Tokyo', temp: '22°', icon: '🌧️' }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 animate-fade-in">
      {cities.map(city => (
        <div key={city.name} className="bg-white/5 border border-white/10 backdrop-blur-md p-4 rounded-2xl flex items-center justify-between hover:bg-white/10 transition-all cursor-pointer group">
          <div>
            <span className="text-white/40 text-[10px] uppercase font-mono tracking-widest">Global Watch</span>
            <h4 className="text-white font-bold text-lg">{city.name}</h4>
          </div>
          <div className="text-right">
            <span className="text-2xl block group-hover:scale-110 transition-transform">{city.icon}</span>
            <span className="text-white/60 font-mono text-sm">{city.temp}</span>
          </div>
        </div>
      ))}
    </div>
  );
}