import type { BrowserSyncInstance, Options } from 'browser-sync'
import bs from 'browser-sync'

// Current instance of BrowserSync
export let instance: BrowserSyncInstance

export const browserSync = async (url: string) => {
  try {
    const u = new URL(url)
    const config: Options = {
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

    instance = bs.create()
    instance.init(config)
  } catch (e) {
    console.error(e)
  }
}
