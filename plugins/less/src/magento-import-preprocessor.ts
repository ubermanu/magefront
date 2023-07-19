// Hacky way to import less type definitions
import 'less'

/** Replaces the commented `@magento_import` statements with the actual import statements for each enabled modules. */
export class preProcessor implements Less.PreProcessor {
  private modules: string[]

  constructor(modules: string[]) {
    this.modules = modules
  }

  process(src: string): string {
    return src.replace(/^\/\/@magento_import(.*);(.*)$/gm, (match, path) => {
      path = path.replace(/["']/g, '').trim()
      return this.modules.map((mod) => `@import (optional) '../${mod}/css/${path}';`).join('\n')
    })
  }
}

export default (modules: string[]): Less.Plugin => ({
  install: function (less: LessStatic, pluginManager: Less.PluginManager) {
    pluginManager.addPreProcessor(new preProcessor(modules), 1)
  },
})
