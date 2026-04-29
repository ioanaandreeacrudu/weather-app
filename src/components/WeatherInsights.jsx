import { useState } from 'react';

const insights = [
  {
    tag: "Climate Fact",
    text: "Lightning is 5 times hotter than the surface of the Sun, reaching temperatures of approximately 30,000°C.",
    icon: "⚡"
  },
  {
    tag: "Record",
    text: "The largest recorded hailstone was 20 cm in diameter, similar in size to a volleyball.",
    icon: "🧊"
  },
  {
    tag: "Atmosphere",
    text: "The sky is not blue due to the reflection of the ocean, but because of how the atmosphere scatters sunlight.",
    icon: "🌌"
  },
  {
    tag: "Nature",
    text: "Crickets can be used to estimate the temperature outside by counting how many times they chirp in 15 seconds.",
    icon: "🦗"
  },
  {
    tag: "Extreme",
    text: "In Antarctica, there is a waterfall called 'The Blood Falls' which flows with salty water of a bright red color.",
    icon: "🩸"
  }
];

export default function WeatherInsights() {
  const [index, setIndex] = useState(0);

  const nextInsight = () => {
    setIndex((prevIndex) => (prevIndex + 1) % insights.length);
  };

  return (
    <div className="glass-vibrant p-8 rounded-[2.5rem] max-w-2xl w-full text-center space-y-6 animate-scale-in relative group">
      <div className="space-y-2">
        <span className="text-emerald-400 font-mono text-[10px] uppercase tracking-[0.3em] opacity-80">
          {insights[index].tag}
        </span>
        <div className="text-4xl">{insights[index].icon}</div>
      </div>

      <p className="text-white/80 font-body text-lg leading-relaxed min-h-[80px] flex items-center justify-center">
        "{insights[index].text}"
      </p>

      <div className="flex justify-center items-center gap-4 pt-4">
        {/* Indicatoare de progres */}
        <div className="flex gap-1.5">
          {insights.map((_, i) => (
            <div 
              key={i} 
              className={`h-1 rounded-full transition-all duration-300 ${i === index ? 'w-6 bg-emerald-400' : 'w-1.5 bg-white/10'}`}
            />
          ))}
        </div>
      </div>

      {/* Butonul Next */}
      <button 
        onClick={nextInsight}
        className="absolute right-6 bottom-6 bg-white/5 hover:bg-white/10 border border-white/10 p-3 rounded-2xl transition-all active:scale-90 group-hover:border-emerald-500/30"
      >
        <span className="text-white/60 group-hover:text-emerald-400 font-mono text-xs uppercase tracking-widest flex items-center gap-2">
          Next Insight <span>→</span>
        </span>
      </button>
    </div>
  );
}