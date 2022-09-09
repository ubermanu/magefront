import glob from 'fast-glob'
import path from 'path'
import fs from 'fs'
import { minify } from 'terser'

/**
 * @param {{}} options
 * @return {function}
 */
export default (options = {}) => {
  return async (themeConfig) => {
    const files = await glob('**/*.{js,mjs,cjs}', { cwd: themeConfig.src })

    return Promise.all(
      files.map(async (file) => {
        const filePath = path.join(themeConfig.src, file)
        const { code } = await minify(fs.readFileSync(filePath, 'utf8').toString(), options)
        fs.writeFileSync(filePath, code, 'utf8')
      })
    )
  }
}
