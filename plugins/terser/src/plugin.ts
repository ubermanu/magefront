import glob, { Pattern } from 'fast-glob'
import fs from 'fs'
import path from 'path'
import { minify } from 'terser'

export interface Options {
  src?: string | string[]
  ignore?: Pattern[]
  terserOptions?: any
}

/**
 * Find all the `js` files in the preprocessed directory and minify them.
 *
 * @param {Options} options
 * @returns {function( any ): Promise<Awaited<void>[]>}
 */
export default (options: Options = {}) => {
  const { src, ignore, terserOptions } = options

  // @ts-ignore
  return async (themeConfig) => {
    const files = await glob(src ?? '**/*.js', { ignore, cwd: themeConfig.src })

    return Promise.all(
      files.map(async (file: string) => {
        const filePath = path.join(themeConfig.src, file)
        const fileContent = await fs.promises.readFile(filePath)
        const { code } = await minify(fileContent.toString(), terserOptions || {})
        if (code) {
          return fs.promises.writeFile(filePath, code)
        }
      })
    )
  }
}
