import glob from 'fast-glob'
import path from 'path'
import babel from '@babel/core'

/**
 * Transform your JS code with babel.
 *
 * @param {{src:string, ignore?:any, compilerOptions?:any}} options
 * @returns {function(*): Promise<Awaited<*>[]>}
 */
export default (options = {}) => {
  const { src, ignore, compilerOptions } = options

  if (!src) {
    throw new Error('The `src` option is required')
  }

  return async (themeConfig) => {
    const files = await glob(src, { ignore: ignore ?? [], cwd: themeConfig.src })

    return Promise.all(
      files.map((file) => {
        const filePath = path.join(themeConfig.src, file)
        return babel.transformFile(filePath, compilerOptions)
      })
    )
  }
}
