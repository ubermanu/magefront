import bs from 'browser-sync'
import console from 'node:console'
import { escapeJs } from '../magento/escaper.js'
import { escapeRegExp } from '../utils.js'

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
      cors: true,
      rewriteRules: [
        {
          match: new RegExp(escapeRegExp(u.hostname), 'g'),
          replace: 'localhost:' + 3000,
        },
        {
          match: new RegExp(escapeRegExp(escapeJs(u.hostname)), 'gi'),
          replace: escapeJs('localhost:' + 3000),
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
