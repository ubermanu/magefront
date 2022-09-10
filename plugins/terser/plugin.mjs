import glob from 'fast-glob'
import path from 'path'
import fs from 'fs'
import { minify } from 'terser'

/**
 * Find all the `js` files in the preprocessed directory and minify them.
 *
 * @param {{src?:string, terserOptions?:any}} options
 * @return {function}
 */
export default (options = {}) => {
  const { src, terserOptions } = options

  return async (themeConfig) => {
    const files = await glob(src || '**/*.js', { cwd: themeConfig.src })

    return Promise.all(
      files.map(async (file) => {
        const filePath = path.join(themeConfig.src, file)
        const { code } = await minify(fs.readFileSync(filePath, 'utf8').toString(), terserOptions || {})
        return fs.promises.writeFile(filePath, code, 'utf8')
      })
    )
  }
}
