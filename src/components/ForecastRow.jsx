export default function ForecastRow({ forecast }) {
  return (
    <div className="w-full animate-slide-up mt-8">
      <div className="flex items-center gap-3 mb-6 px-4">
        <span className="h-px flex-1 bg-white/10"></span>
        <h3 className="text-white/30 text-[10px] uppercase tracking-[0.4em] font-mono whitespace-nowrap">
          5-Day Outlook
        </h3>
        <span className="h-px flex-1 bg-white/10"></span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {forecast.map((day, index) => (
          <div 
            key={index}
            className="glass-vibrant p-6 rounded-[2.5rem] flex flex-col items-center gap-3 transition-all hover:-translate-y-2 hover:bg-white/10 group"
          >
            <span className="text-white/40 text-xs font-mono uppercase tracking-widest">{day.date}</span>
            <img 
              src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`} 
              className="w-16 h-16 drop-shadow-md group-hover:scale-110 transition-transform" 
              alt={day.condition} 
            />
            <div className="text-2xl font-bold text-white">{day.temp}°</div>
            <span className="text-[10px] text-white/20 uppercase tracking-tighter">{day.condition}</span>
          </div>
        ))}
      </div>
    </div>
  );
}