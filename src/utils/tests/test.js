/**
 * utils.test.js
 * ─────────────────────────────────────────────────────────────
 * Basic unit tests for pure utility functions.
 * Run with: node src/utils/__tests__/utils.test.js
 *
 * No test framework required — pure Node.js assertions.
 * ─────────────────────────────────────────────────────────────
 */

import assert from 'assert';
import { degreesToCardinal, getWindDescription } from '../windDirection.js';
import { celsiusToFahrenheit, fahrenheitToCelsius } from '../temperature.js';
import { getRecommendations } from '../recommendation.js';

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ PASS  ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ FAIL  ${name}`);
    console.error(`         ${err.message}`);
    failed++;
  }
}

// ─── Wind Direction Tests ─────────────────────────────────────
console.log('\n📍 windDirection.js');

test('0° → N', () => assert.strictEqual(degreesToCardinal(0), 'N'));
test('45° → NE', () => assert.strictEqual(degreesToCardinal(45), 'NE'));
test('90° → E', () => assert.strictEqual(degreesToCardinal(90), 'E'));
test('135° → SE', () => assert.strictEqual(degreesToCardinal(135), 'SE'));
test('180° → S', () => assert.strictEqual(degreesToCardinal(180), 'S'));
test('225° → SW', () => assert.strictEqual(degreesToCardinal(225), 'SW'));
test('270° → W', () => assert.strictEqual(degreesToCardinal(270), 'W'));
test('315° → NW', () => assert.strictEqual(degreesToCardinal(315), 'NW'));
test('360° → N (wraps)', () => assert.strictEqual(degreesToCardinal(360), 'N'));
test('Negative degrees normalise (-90 → W)', () => assert.strictEqual(degreesToCardinal(-90), 'W'));
test('0.5 m/s → Light air', () => assert.strictEqual(getWindDescription(0.5), 'Light air'));
test('15 m/s → Near gale', () => assert.strictEqual(getWindDescription(15), 'Near gale'));

// ─── Temperature Tests ────────────────────────────────────────
console.log('\n🌡️  temperature.js');

test('0°C → 32°F', () => assert.strictEqual(celsiusToFahrenheit(0), 32));
test('100°C → 212°F', () => assert.strictEqual(celsiusToFahrenheit(100), 212));
test('-40°C → -40°F', () => assert.strictEqual(celsiusToFahrenheit(-40), -40));
test('20°C → 68°F', () => assert.strictEqual(celsiusToFahrenheit(20), 68));
test('32°F → 0°C', () => assert.strictEqual(fahrenheitToCelsius(32), 0));
test('212°F → 100°C', () => assert.strictEqual(fahrenheitToCelsius(212), 100));

// ─── Recommendation Tests ─────────────────────────────────────
console.log('\n🤖 recommendation.js');

test('Rain condition → umbrella recommendation', () => {
  const recs = getRecommendations({ tempC: 15, mainCondition: 'Rain', description: 'light rain', windSpeed: 3, humidity: 80, clouds: 90 });
  assert.ok(recs.some(r => r.text.toLowerCase().includes('umbrella')), 'Expected umbrella suggestion');
});

test('Low temp → coat recommendation', () => {
  const recs = getRecommendations({ tempC: 3, mainCondition: 'Clear', description: 'clear sky', windSpeed: 2, humidity: 50, clouds: 0 });
  assert.ok(recs.some(r => r.text.toLowerCase().includes('coat')), 'Expected coat suggestion');
});

test('Hot clear day → sunscreen or nice weather', () => {
  const recs = getRecommendations({ tempC: 32, mainCondition: 'Clear', description: 'clear sky', windSpeed: 1, humidity: 40, clouds: 0 });
  assert.ok(recs.some(r => r.text.toLowerCase().includes('sunscreen') || r.text.toLowerCase().includes('nice')), 'Expected hot weather suggestion');
});

test('Mild conditions → no-alarm recommendation', () => {
  const recs = getRecommendations({ tempC: 20, mainCondition: 'Clouds', description: 'few clouds', windSpeed: 2, humidity: 55, clouds: 30 });
  assert.ok(recs.length > 0, 'Expected at least one recommendation');
});

// ─── Summary ──────────────────────────────────────────────────
console.log(`\n─────────────────────────────────`);
console.log(`Results: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  console.error('⚠️  Some tests failed!');
  process.exit(1);
} else {
  console.log('✅ All tests passed!');
}