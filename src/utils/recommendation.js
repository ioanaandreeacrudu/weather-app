/**
 * @file recommendation.js
 * @description Modul de calcul și procesare a datelor meteorologice.
 * @author Vornicu Denisa Ștefania
 * @contribution Dezvoltarea algoritmilor de conversie și a logicii pentru recomandările de haine/accesorii.
 * ─────────────────────────────────────────────────────────────
 * Smart recommendation engine.
 * Analyses weather conditions and produces actionable suggestions.
 * Pure functions — no side effects, easy to unit-test.
 * Developer note: Owned by the "Logic" developer.
 * ─────────────────────────────────────────────────────────────
 */

/**
 * @typedef {object} Recommendation
 * @property {string} icon    - Emoji icon
 * @property {string} text    - Short suggestion text
 * @property {string} color   - Tailwind background/border colour variant
 * @property {string} detail  - Optional longer explanation
 */

/**
 * Generates a list of smart recommendations based on weather conditions.
 *
 * @param {object} params
 * @param {number} params.tempC          - Temperature in Celsius
 * @param {string} params.mainCondition  - Main condition (e.g. "Rain", "Clear")
 * @param {string} params.description    - Detailed description
 * @param {number} params.windSpeed      - Wind speed in m/s
 * @param {number} params.humidity       - Humidity percentage
 * @param {number} params.clouds         - Cloud coverage percentage
 * @returns {Recommendation[]} Array of recommendation objects
 */
export function getRecommendations({ tempC, mainCondition, description, windSpeed, humidity, clouds }) {
  const recs = [];
  const condition = mainCondition?.toLowerCase() ?? '';
  const desc      = description?.toLowerCase() ?? '';

  // ── Precipitation ──────────────────────────────────────────
  if (condition === 'rain' || condition === 'drizzle' || desc.includes('rain') || desc.includes('drizzle')) {
    recs.push({
      icon: '☂️',
      text: 'Take an umbrella',
      color: 'blue',
      detail: 'Rain is expected. Keep dry!',
    });
  }

  if (condition === 'thunderstorm') {
    recs.push({
      icon: '⚡',
      text: 'Stay indoors if possible',
      color: 'yellow',
      detail: 'Thunderstorms can be dangerous. Avoid open areas.',
    });
  }

  if (condition === 'snow' || desc.includes('snow')) {
    recs.push({
      icon: '🧤',
      text: 'Dress for snow',
      color: 'indigo',
      detail: 'Wear warm, waterproof clothing and watch for icy surfaces.',
    });
  }

  // ── Temperature ────────────────────────────────────────────
  if (tempC <= 5) {
    recs.push({
      icon: '🧥',
      text: 'Wear a heavy coat',
      color: 'cyan',
      detail: "It's very cold outside. Bundle up well.",
    });
  } else if (tempC <= 15) {
    recs.push({
      icon: '🧣',
      text: 'Take a jacket',
      color: 'teal',
      detail: "It's cool today. A jacket or light coat is a good idea.",
    });
  } else if (tempC >= 30) {
    recs.push({
      icon: '🧴',
      text: 'Apply sunscreen',
      color: 'orange',
      detail: "It's hot! Stay hydrated and protect your skin.",
    });
  } else if (tempC >= 25 && condition === 'clear') {
    recs.push({
      icon: '😎',
      text: 'Nice weather today!',
      color: 'emerald',
      detail: 'Enjoy the sunshine. A great day to be outdoors.',
    });
  }

  // ── Wind ───────────────────────────────────────────────────
  if (windSpeed >= 10) {
    recs.push({
      icon: '💨',
      text: 'Strong winds today',
      color: 'slate',
      detail: 'Secure loose objects. Umbrellas may be ineffective.',
    });
  }

  // ── Humidity ───────────────────────────────────────────────
  if (humidity >= 80) {
    recs.push({
      icon: '💧',
      text: 'High humidity',
      color: 'sky',
      detail: 'It will feel muggy. Stay hydrated.',
    });
  }

  // ── Visibility ─────────────────────────────────────────────
  if (condition === 'fog' || condition === 'mist' || desc.includes('fog') || desc.includes('mist')) {
    recs.push({
      icon: '🌫️',
      text: 'Low visibility — drive carefully',
      color: 'gray',
      detail: 'Foggy conditions reduce road visibility. Use fog lights.',
    });
  }

  // ── Perfect weather fallback ───────────────────────────────
  if (recs.length === 0) {
    recs.push({
      icon: '✨',
      text: 'Conditions look fine!',
      color: 'emerald',
      detail: "No special precautions needed. Enjoy your day!",
    });
  }

  return recs;
}

/**
 * Maps a Tailwind colour name to full class strings for the recommendation card.
 *
 * @param {string} color - e.g. "blue", "emerald"
 * @returns {{ bg: string, border: string, text: string }}
 */
export function getRecommendationClasses(color) {
  const map = {
    blue:    { bg: 'bg-blue-500/10',    border: 'border-blue-500/30',    text: 'text-blue-300'    },
    yellow:  { bg: 'bg-yellow-500/10',  border: 'border-yellow-500/30',  text: 'text-yellow-300'  },
    indigo:  { bg: 'bg-indigo-500/10',  border: 'border-indigo-500/30',  text: 'text-indigo-300'  },
    cyan:    { bg: 'bg-cyan-500/10',    border: 'border-cyan-500/30',    text: 'text-cyan-300'    },
    teal:    { bg: 'bg-teal-500/10',    border: 'border-teal-500/30',    text: 'text-teal-300'    },
    orange:  { bg: 'bg-orange-500/10',  border: 'border-orange-500/30',  text: 'text-orange-300'  },
    emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-300' },
    slate:   { bg: 'bg-slate-500/10',   border: 'border-slate-500/30',   text: 'text-slate-300'   },
    sky:     { bg: 'bg-sky-500/10',     border: 'border-sky-500/30',     text: 'text-sky-300'     },
    gray:    { bg: 'bg-gray-500/10',    border: 'border-gray-500/30',    text: 'text-gray-300'    },
  };
  return map[color] ?? map.emerald;
}