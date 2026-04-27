/**
 * SearchBar.jsx
 * ─────────────────────────────────────────────────────────────
 * RESPONSIBILITY: City search input and submit button.
 *
 * Developer note (Team separation):
 *   → This file is owned by the "UI" developer.
 *   → It emits onSearch(cityName) — it does NOT call the API.
 * ─────────────────────────────────────────────────────────────
 */

import { useState } from 'react';

/**
 * SearchBar
 *
 * @param {object}   props
 * @param {function} props.onSearch   - Called with city name string when user submits
 * @param {boolean}  props.isLoading  - Disables input & button while fetching
 */
export default function SearchBar({ onSearch, isLoading }) {
  const [city, setCity] = useState('');

  /** Handle form submission (button click OR Enter key) */
  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = city.trim();
    if (trimmed) {
      onSearch(trimmed);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-xl mx-auto"
      aria-label="City weather search"
    >
      <div className="relative flex items-center gap-3">
        {/* ── Search Icon ── */}
        <div className="absolute left-4 text-white/40 pointer-events-none select-none">
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

        {/* ── Text Input ── */}
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter a city name…"
          disabled={isLoading}
          aria-label="City name"
          className="
            w-full pl-12 pr-4 py-4
            bg-white/10 backdrop-blur-md
            border border-white/20
            rounded-2xl
            font-body text-white placeholder-white/40
            text-base
            focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/40
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200
          "
        />

        {/* ── Submit Button ── */}
        <button
          type="submit"
          disabled={isLoading || !city.trim()}
          aria-label="Search"
          className="
            flex-shrink-0
            px-6 py-4
            bg-white text-gray-900
            font-body font-semibold text-sm
            rounded-2xl
            hover:bg-white/90
            active:scale-95
            disabled:opacity-40 disabled:cursor-not-allowed
            transition-all duration-200
            whitespace-nowrap
          "
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg
                className="w-4 h-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12" cy="12" r="10"
                  stroke="currentColor" strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              Fetching…
            </span>
          ) : (
            'Search'
          )}
        </button>
      </div>
    </form>
  );
}