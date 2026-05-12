/**
 * @file time.js
 * @description Modul de calcul și procesare a datelor meteorologice.
 * @author Vornicu Denisa Ștefania
 * @contribution Dezvoltarea algoritmilor de conversie și a logicii pentru recomandările de haine/accesorii.
 * ─────────────────────────────────────────────────────────────
 * Utility functions for formatting time values from the API.
 * ─────────────────────────────────────────────────────────────
 */

/**
 * Formats a Unix timestamp (UTC) adjusted by a timezone offset into
 * a human-readable local time string (HH:MM).
 *
 * @param {number} unixTimestamp - Seconds since epoch (UTC)
 * @param {number} timezoneOffsetSeconds - Timezone offset in seconds from UTC
 * @returns {string} Formatted time string, e.g. "06:23"
 */
export function formatLocalTime(unixTimestamp, timezoneOffsetSeconds) {
  // Calculate local time in milliseconds
  const localMs = (unixTimestamp + timezoneOffsetSeconds) * 1000;
  const date = new Date(localMs);

  // Use UTC getters because we've already applied the offset manually
  const hours   = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`;
}

/**
 * Returns the current day name and date string.
 *
 * @returns {string} e.g. "Monday, 15 April"
 */
export function getTodayLabel() {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day:     'numeric',
    month:   'long',
  }).format(new Date());
}