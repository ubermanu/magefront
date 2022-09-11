import bs, { BrowserSyncInstance, Options } from 'browser-sync'

// Current instance of BrowserSync
export let instance: BrowserSyncInstance

export const browserSync = async (url: string) => {
  try {
    const u = new URL(url)
    const config: Options = {
      proxy: u.hostname,
      port: +u.port || 3000,
      ui: false,
      open: false,
      rewriteRules: [
        {
          match: new RegExp('.' + u.hostname),
          replace: ''
        }
      ]
    }

    instance = bs.create()
    instance.init(config)
  } catch (e) {
    console.error(e)
  }
}
