/**
 * Replaces the commented `@magento_import` statements with
 * the actual import statements for each enabled modules.
 */
class preProcessor {
  constructor(modules) {
    this.modules = modules
  }

  process(src) {
    return src.replace(/^\/\/@magento_import(.*);(.*)$/gm, (match, path) => {
      path = path.replace(/["']/g, '').trim()
      return this.modules.map((mod) => `@import (optional) '../../${mod}/web/css/${path}';`).join('\n')
    })
  }
}

export default (modules) => ({
  install: function (less, pluginManager) {
    pluginManager.addPreProcessor(new preProcessor(modules))
  }
})
