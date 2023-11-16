/**
 * Check if value is an array
 *
 * @param {any} value
 * @returns {value is any[]}
 */
export const isArray = (value) => Array.isArray(value)

/**
 * Check if value is an object
 *
 * @param {any} value
 * @returns {value is Record<string, any>}
 */
export const isObject = (value) =>
  typeof value === 'object' && value !== null && !isArray(value)

/**
 * Escapes a string to be used as a regular expression.
 *
 * @param {string} str
 * @returns {string}
 */
export function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
