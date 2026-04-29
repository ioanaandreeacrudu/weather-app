/**
 * SearchBar.jsx
 * ─────────────────────────────────────────────────────────────
 * RESPONSIBILITY: City search input with glassmorphism style.
 * Matches the updated dashboard aesthetic.
 * ─────────────────────────────────────────────────────────────
 */

import { useState } from 'react';

export default function SearchBar({ onSearch, isLoading }) {
  const [city, setCity] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = city.trim();
    if (trimmed) {
      onSearch(trimmed);
      // Opțional: setCity(''); // Curăță input-ul după căutare
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto z-20 animate-fade-in"
      aria-label="City weather search"
    >
      <div className="relative flex items-center group">
        {/* ── Search Icon (Stânga) ── */}
        <div className="absolute left-6 text-white/30 pointer-events-none transition-colors group-focus-within:text-emerald-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
          </svg>
        </div>

        {/* ── Text Input (Ultra Glass) ── */}
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Caută un oraș (ex: Iasi, Londra)..."
          disabled={isLoading}
          className="
            w-full pl-14 pr-36 py-5
            bg-white/[0.03] backdrop-blur-xl
            border border-white/10
            rounded-[2.5rem]
            font-body text-white placeholder-white/20
            text-base
            focus:outline-none focus:bg-white/[0.07] 
            focus:border-emerald-500/30 focus:ring-4 focus:ring-emerald-500/5
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-300
          "
        />

        {/* ── Submit Button (Floating Right) ── */}
        <div className="absolute right-2">
          <button
            type="submit"
            disabled={isLoading || !city.trim()}
            className="
              px-8 py-3.5
              bg-emerald-500 hover:bg-emerald-400
              text-slate-950 font-bold text-sm
              rounded-[2rem]
              shadow-lg shadow-emerald-500/20
              active:scale-95
              disabled:opacity-40 disabled:grayscale disabled:cursor-not-allowed
              transition-all duration-300
              whitespace-nowrap
              flex items-center gap-2
            "
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Căutare...</span>
              </>
            ) : (
              'Căutare'
            )}
          </button>
        </div>
      </div>
    </form>
  );
}