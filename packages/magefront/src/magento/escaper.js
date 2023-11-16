/**
 * Escape string for use in JavaScript.
 *
 * @param {string} str
 * @returns {string}
 */
export function escapeJs(str) {
  if (typeof str !== 'string') {
    // In JavaScript, convert to string if not already
    str = String(str)
  }

  if (str === '' || /^\d+$/.test(str)) {
    return str
  }

  return str.replace(/[^a-z0-9,._]/gi, function (match) {
    let chr = match
    if (chr.length !== 1) {
      // Convert multi-byte character to Unicode escape sequence
      chr = encodeURIComponent(chr).replace(/%/g, '')
    }
    return (
      '\\u' + ('0000' + chr.charCodeAt(0).toString(16)).slice(-4).toUpperCase()
    )
  })
}
