class preProcessor {
  constructor(modules) {
    this.modules = modules
  }

  // Replace the magento imports with the actual modules
  process(src, extra) {
    return src.replace(/^\/\/@magento_import(.*);(.*)$/gm, (match, path) => {
      path = path.replace(/["']/g, '').trim()
      return this.modules
        .map((mod) => `@import (optional) '../../${mod}/web/css/${path}';`)
        .join('\n')
    })
  }
}

export default (modules) => ({
  install: function (less, pluginManager) {
    pluginManager.addPreProcessor(new preProcessor(modules))
  }
})
