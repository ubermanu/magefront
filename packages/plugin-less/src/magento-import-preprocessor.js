/**
 * Replaces the commented `@magento_import` statements with the actual import
 * statements for each enabled modules.
 *
 * @implements {Less.PreProcessor}
 */
export class preProcessor {
  /** @type {string[]} */
  modules

  /** @param {string[]} modules */
  constructor(modules) {
    this.modules = modules
  }

  /**
   * @param {string} src
   * @param {Less.PreProcessorExtraInfo} [_extra]
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  process(src, _extra) {
    return src.replace(
      /^\/\/@magento_import\s(\([\w\s,]*\))?(.*)\s?;.*$/gm,
      (_match, options, path) => {
        /** @type {string[]} */
        const params = []

        if (options) {
          options = options.trim().replace(/^\(/, '').replace(/\)$/, '')
          options = options
            .split(',')
            .map((/** @type {string} */ p) => p.trim())
          params.push(...options)
        }

        if (!params.includes('optional')) {
          params.unshift('optional')
        }

        path = path.replace(/["']/g, '').trim()

        return this.modules
          .map(
            (mod) => `@import (${params.join(', ')}) '../${mod}/css/${path}';`
          )
          .join('\n')
      }
    )
  }
}

/**
 * @param {string[]} modules
 * @returns {Less.Plugin}
 */
export default (modules) => ({
  install: function (_less, pluginManager) {
    pluginManager.addPreProcessor(new preProcessor(modules), 1)
  },
})
