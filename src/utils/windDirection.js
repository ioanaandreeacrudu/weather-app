/**
 * windDirection.js
 * ─────────────────────────────────────────────────────────────
 * Utility functions for interpreting wind data.
 *
 * Pure functions — no side effects, easy to unit-test.
 * Developer note: Owned by the "Logic" developer.
 * ─────────────────────────────────────────────────────────────
 */

/**
 * Cardinal and intercardinal direction labels mapped to degree ranges.
 * Each entry covers a 45-degree arc centred on the named direction.
 */
const DIRECTIONS = [
  { label: 'N',   short: 'North',               min: 348.75, max: 360   },
  { label: 'N',   short: 'North',               min: 0,      max: 11.25  },
  { label: 'NNE', short: 'North-North-East',      min: 11.25,  max: 33.75  },
  { label: 'NE',  short: 'North-East',           min: 33.75,  max: 56.25  },
  { label: 'ENE', short: 'East-North-East',       min: 56.25,  max: 78.75  },
  { label: 'E',   short: 'East',                min: 78.75,  max: 101.25 },
  { label: 'ESE', short: 'East-South-East',        min: 101.25, max: 123.75 },
  { label: 'SE',  short: 'South-East',            min: 123.75, max: 146.25 },
  { label: 'SSE', short: 'South-South-East',        min: 146.25, max: 168.75 },
  { label: 'S',   short: 'South',                min: 168.75, max: 191.25 },
  { label: 'SSW', short: 'South-South-West',       min: 191.25, max: 213.75 },
  { label: 'SW',  short: 'South-West',           min: 213.75, max: 236.25 },
  { label: 'WSW', short: 'West-South-West',      min: 236.25, max: 258.75 },
  { label: 'W',   short: 'West',               min: 258.75, max: 281.25 },
  { label: 'WNW', short: 'West-North-West',     min: 281.25, max: 303.75 },
  { label: 'NW',  short: 'North-West',          min: 303.75, max: 326.25 },
  { label: 'NNW', short: 'North-North-Vest',     min: 326.25, max: 348.75 },
];

/**
 * Converts a wind bearing in degrees to a compass abbreviation (e.g. "NE").
 *
 * @param {number} degrees - Wind direction in degrees (0-360)
 * @returns {string} Compass abbreviation: N | NE | E | SE | S | SW | W | NW
 *
 * @example
 * degreesToCardinal(0)   // "N"
 * degreesToCardinal(90)  // "E"
 * degreesToCardinal(225) // "SW"
 */
export function degreesToCardinal(degrees) {
  // Normalise degrees to 0-360 range
  const normalised = ((degrees % 360) + 360) % 360;

  for (const dir of DIRECTIONS) {
    if (normalised >= dir.min && normalised < dir.max) {
      return dir.label;
    }
  }
  // Fallback (shouldn't be reached)
  return 'N';
}

/**
 * Converts degrees to a full compass direction name (e.g. "North-East").
 *
 * @param {number} degrees
 * @returns {string} Full direction name
 */
export function degreesToCardinalFull(degrees) {
  const normalised = ((degrees % 360) + 360) % 360;

  for (const dir of DIRECTIONS) {
    if (normalised >= dir.min && normalised < dir.max) {
      return dir.short;
    }
  }
  return 'North';
}

/**
 * Returns the Beaufort scale description for a given wind speed (m/s).
 *
 * @param {number} speedMs - Wind speed in metres per second
 * @returns {string} Beaufort description
 */
export function getWindDescription(speedMs) {
  if (speedMs < 0.3)  return 'Calm';
  if (speedMs < 1.6)  return 'Light air';
  if (speedMs < 3.4)  return 'Light breeze';
  if (speedMs < 5.5)  return 'Gentle breeze';
  if (speedMs < 8.0)  return 'Moderate breeze';
  if (speedMs < 10.8) return 'Fresh breeze';
  if (speedMs < 13.9) return 'Strong breeze';
  if (speedMs < 17.2) return 'Near gale';
  if (speedMs < 20.8) return 'Gale';
  if (speedMs < 24.5) return 'Strong gale';
  if (speedMs < 28.5) return 'Storm';
  return 'Violent storm';
}