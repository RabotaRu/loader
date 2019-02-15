/**
 * @param {*} value
 * @returns {number}
 */
export function ensureNumber (value) {
  value = Number( value );

  return !Number.isNaN(value) ? value : 0;
}

/**
 * @param {number} number
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function clampNumber (number, min = -Infinity, max = Infinity) {
  if (min > max) {
    [ min, max ] = [ max, min ];
  }

  return Math.min(
    Math.max(ensureNumber(number), min),
    max
  );
}

/**
 * @param {number} delayMs
 * @returns {Promise<*>}
 */
export function delay (delayMs) {
  return new Promise(resolve => setTimeout(resolve, delayMs));
}
