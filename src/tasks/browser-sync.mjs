import bs from 'browser-sync'
import logger from '../logger.mjs'

// Current instance of BrowserSync
export let instance

export const browserSync = async (url) => {
  try {
    const u = new URL(url)
    const config = {
      proxy: u.hostname,
      port: u.port || 3000,
      ui: false,
      open: false,
      rewriteRules: [
        {
          match: '.' + u.hostname,
          replace: ''
        }
      ]
    }

    instance = bs.create()
    instance.init(config)
  } catch (e) {
    logger.error(e)
  }
}
