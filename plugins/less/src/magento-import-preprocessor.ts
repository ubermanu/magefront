/**
 * Replaces the commented `@magento_import` statements with the actual import statements for each enabled modules.
 *
 * @type {import('less').PreProcessor}
 */
export class preProcessor {
  private modules: string[]

  /** @param {string[]} modules */
  constructor(modules: string[]) {
    this.modules = modules
  }

  /**
   * @param {string} src
   * @returns {string}
   */
  process(src: string): string {
    return src.replace(/^\/\/@magento_import(.*);(.*)$/gm, (match, path) => {
      path = path.replace(/["']/g, '').trim()
      return this.modules.map((mod) => `@import (optional) '../${mod}/css/${path}';`).join('\n')
    })
  }
}

/**
 * @param {string[]} modules
 * @returns {import('less').Plugin}
 */
export default (modules: string[]) => ({
  // @ts-ignore
  install: function (less: LessStatic, pluginManager) {
    pluginManager.addPreProcessor(new preProcessor(modules), 1)
  },
})
