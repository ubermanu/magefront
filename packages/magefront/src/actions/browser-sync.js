import bs from 'browser-sync'
import console from 'node:console'

// Current instance of BrowserSync
// TODO: Move this into the ActionContext
/** @type {import('browser-sync').BrowserSyncInstance | null} */
export let instance = null

/**
 * Run a BrowserSync proxy instance.
 *
 * @param {string} url
 * @returns {Promise<void>}
 */
export const browserSync = async (url) => {
  try {
    const u = new URL(url)

    /** @type {import('browser-sync').Options} */
    const config = {
      proxy: u.hostname,
      port: 3000,
      ui: false,
      open: false,
      rewriteRules: [
        {
          match: new RegExp(u.hostname.replace(/\./g, '\\.'), 'g'),
          replace: 'localhost:' + 3000,
        },
      ],
    }

    instance = bs.create('magefront')
    instance.init(config)
  } catch (e) {
    // TODO: Use logger
    console.error(e)
  }
}
