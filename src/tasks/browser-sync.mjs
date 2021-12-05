import bs from 'browser-sync'

// Current instance of BrowserSync
export let instance

// TODO: Sanitize the url
export const browserSync = async (url) => {
  const config = {
    proxy: url,
    port: 3000,
    rewriteRules: [
      {
        match: '.' + url,
        replace: ''
      }
    ],
    ui: {
      port: 3001
    }
  }

  instance = bs.create()
  instance.init(config)
}
