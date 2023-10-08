import glob from 'fast-glob'
import fs from 'node:fs/promises'
import path from 'node:path'
import { minify } from 'terser'

/**
 * Find all the `js` files in the preprocessed directory and minify them.
 *
 * @param {import('./plugin').Options} [options]
 * @returns {import('magefront').Plugin}
 */
export default (options) => ({
  name: 'terser',

  async build(context) {
    const { src, ignore, terserOptions } = { ...options }

    const files = await glob(src ?? '**/*.js', { ignore, cwd: context.cwd })

    await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(context.cwd, file)
        const fileContent = await fs.readFile(filePath)
        const { code } = await minify(
          fileContent.toString(),
          terserOptions || {}
        )
        if (code) {
          return fs.writeFile(filePath, code)
        }
      })
    )
  },
})
