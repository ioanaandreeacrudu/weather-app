/**
 * temperature.js
 * ─────────────────────────────────────────────────────────────
 * Utility functions for temperature conversion and formatting.
 *
 * Pure functions — no side effects, easy to unit-test.
 * Developer note: Owned by the "Logic" developer.
 * ─────────────────────────────────────────────────────────────
 */

/**
 * Converts Celsius to Fahrenheit.
 * Formula: (°C × 9/5) + 32
 *
 * @param {number} celsius
 * @returns {number} Temperature in Fahrenheit (rounded to nearest integer)
 */
export function celsiusToFahrenheit(celsius) {
  return Math.round((celsius * 9) / 5 + 32);
}

/**
 * Converts Fahrenheit to Celsius.
 * Formula: (°F − 32) × 5/9
 *
 * @param {number} fahrenheit
 * @returns {number} Temperature in Celsius (rounded to nearest integer)
 */
export function fahrenheitToCelsius(fahrenheit) {
  return Math.round(((fahrenheit - 32) * 5) / 9);
}

/**
 * Returns a colour class name based on temperature (Celsius).
 * Used to visually communicate hot/cold conditions.
 *
 * @param {number} tempC
 * @returns {string} Tailwind text-colour class
 */
export function getTempColorClass(tempC) {
  if (tempC <= 0)   return 'text-blue-300';
  if (tempC <= 10)  return 'text-cyan-300';
  if (tempC <= 20)  return 'text-emerald-300';
  if (tempC <= 30)  return 'text-amber-300';
  return                   'text-rose-400';
}

/**
 * Returns a human-readable temperature range label.
 *
 * @param {number} tempC
 * @returns {string}
 */
export function getTempLabel(tempC) {
  if (tempC <= 0)   return 'Freezing';
  if (tempC <= 10)  return 'Cold';
  if (tempC <= 18)  return 'Cool';
  if (tempC <= 25)  return 'Comfortable';
  if (tempC <= 32)  return 'Warm';
  return                   'Hot';
}