import path from 'node:path'

/**
 * Replaces the commented `@magento_import` statements with the actual import
 * statements for each enabled modules.
 *
 * @implements {Less.PreProcessor}
 */
export class preProcessor {
  /** @type {string[]} */
  modules

  /** @type {string} */
  baseDir

  /**
   * @param {string[]} modules
   * @param {string} [baseDir]
   */
  constructor(modules, baseDir = '') {
    this.modules = modules
    this.baseDir = baseDir
  }

  /**
   * @param {string} src
   * @param {Less.PreProcessorExtraInfo} [_extra]
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  process(src, _extra) {
    return src.replace(
      /^\/\/@magento_import\s(\([\w\s,]*\))?(.*)\s?;.*$/gm,
      (_match, options, target) => {
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

        target = target.replace(/["']/g, '').trim()

        // If the path contains a module name, we just need to target it.
        if (target.includes('::')) {
          const [mod, file] = target.split('::')
          const filename = path.join(this.baseDir, mod, 'css', file)
          return `@import (${params.join(', ')}) '${filename}';`
        }

        return this.modules
          .map((mod) => {
            const filename = path.join(this.baseDir, mod, 'css', target)
            return `@import (${params.join(', ')}) '${filename}';`
          })
          .join('\n')
      }
    )
  }
}

/**
 * @param {string[]} modules
 * @param {string} baseDir
 * @returns {Less.Plugin}
 */
export default (modules, baseDir) => ({
  install: function (_less, pluginManager) {
    pluginManager.addPreProcessor(new preProcessor(modules, baseDir), 1)
  },
})
