import glob from 'fast-glob'
import path from 'path'
import fs from 'fs'
import { minify } from 'terser'

/**
 * Find all the `js` files in the preprocessed directory and minify them.
 *
 * @param {{src?:string, ignore?:any, terserOptions?:any}} options
 * @returns {function(*): Promise<Awaited<void>[]>}
 */
export default (options = {}) => {
  const { src, ignore, terserOptions } = options

  return async (themeConfig) => {
    const files = await glob(src || '**/*.js', { ignore: ignore || [], cwd: themeConfig.src })

    return Promise.all(
      files.map(async (file) => {
        const filePath = path.join(themeConfig.src, file)
        const { code } = await minify(fs.readFileSync(filePath, 'utf8').toString(), terserOptions || {})
        return fs.promises.writeFile(filePath, code, 'utf8')
      })
    )
  }
}
