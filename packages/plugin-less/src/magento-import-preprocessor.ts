/** Replaces the commented `@magento_import` statements with the actual import statements for each enabled modules. */
export class preProcessor implements Less.PreProcessor {
  private modules: string[]

  constructor(modules: string[]) {
    this.modules = modules
  }

  process(src: string): string {
    return src.replace(/^\/\/@magento_import\s(\([\w\s,]*\))?(.*)\s?;.*$/gm, (match, options, path) => {
      const params: string[] = []

      if (options) {
        options = options.trim().replace(/^\(/, '').replace(/\)$/, '')
        options = options.split(',').map((p: string) => p.trim())
        params.push(...options)
      }

      if (!params.includes('optional')) {
        params.unshift('optional')
      }

      path = path.replace(/["']/g, '').trim()

      return this.modules.map((mod) => `@import (${params.join(', ')}) '../${mod}/css/${path}';`).join('\n')
    })
  }
}

export default (modules: string[]): Less.Plugin => ({
  install: function (less: LessStatic, pluginManager: Less.PluginManager) {
    pluginManager.addPreProcessor(new preProcessor(modules), 1)
  },
})
