import glob from 'fast-glob'
import path from 'path'
import babel from '@babel/core'

/**
 * Transform your JS code with babel.
 *
 * @param {{src:string, ignore?:array}|{}} options
 * @returns {(function(*): void)|*}
 */
export default (options = {}) => {
  return (themeConfig) => {
    options = options || {}
    const { src, ignore } = options

    if (!src) {
      throw new Error('The `src` option is required')
    }

    glob(src, { ignore: ignore ?? [], cwd: themeConfig.src }).then((files) => {
      return Promise.all(
        files.map((file) => {
          const filePath = path.join(themeConfig.src, file)
          return babel.transformFileAsync(filePath, options)
        })
      )
    })
  }
}
