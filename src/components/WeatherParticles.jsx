/**
 * @file WeatherParticles.jsx
 * @description Sistem de particule pentru redarea vizuală a condițiilor atmosferice.
 * @author Vornicu Denisa Ștefania
 * @contribution [CONTRIBUȚIE SUPLIMENTARĂ] Dezvoltarea efectelor vizuale dinamice (ploaie, zăpadă, ceață) pentru o experiență imersivă.
 */
import React from 'react';

export default function WeatherParticles({ weather }) {
  if (!weather) return null;

  // ─── LOGICA DE TIMP ──────────────────────────────────────────
  const isNight = () => {
    const now = Math.floor(Date.now() / 1000);
    // Folosim timestamp-urile primite de la API
    const { sunrise, sunset } = weather;
    return now < sunrise || now > sunset;
  };

  const night = isNight();
  const condition = weather.mainCondition; // 'Clear', 'Clouds', 'Rain', 'Snow'

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      
      {/* 1. EFECTE DE NOAPTE (Stele) */}
      {night && (
        <div className="absolute inset-0 z-0">
          {[...Array(40)].map((_, i) => (
            <div 
              key={i} 
              className="absolute bg-white rounded-full animate-pulse opacity-40"
              style={{
                width: Math.random() * 3 + 'px',
                height: Math.random() * 3 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                animationDelay: Math.random() * 5 + 's',
                boxShadow: '0 0 8px white'
              }}
            />
          ))}
        </div>
      )}

      {/* 2. SOARELE (Ziua pe cer senin) */}
       {!night && condition === 'Clear' && (
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-yellow-400/20 rounded-full blur-[130px] animate-pulse-slow opacity-60" />
       )}

      {/* 3. NORII (Ziua pe cer înnorat) */}
       {condition === 'Clouds' && (
       <div className="absolute inset-0">
      {/* Nor mare, mai opac */}
       <div className="absolute top-20 left-[-20%] w-[500px] h-40 bg-white/30 blur-[100px] animate-float-x opacity-40" />
     {/* Nor secundar */}
       <div className="absolute top-60 right-[-20%] w-[600px] h-48 bg-white/20 blur-[120px] animate-float-x-reverse opacity-30" />
       </div>
     )}

      {/* 4. PLOAIE / ZĂPADĂ (Logica existentă) */}
      {condition === 'Rain' && (
        <div className="rain-container">
        </div>
      )}

      {/* Overlay de întunecare pentru noapte */}
      <div className={`absolute inset-0 transition-colors duration-1000 ${
        night ? 'bg-slate-950/30' : 'bg-transparent'
      }`} />
    </div>
  );
}