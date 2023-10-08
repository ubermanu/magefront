import glob from 'fast-glob'
import * as lightningcss from 'lightningcss'
import fs from 'node:fs/promises'
import path from 'node:path'

/**
 * @param {import('./plugin').Options} [options]
 * @returns {import('magefront').Plugin}
 */
export default (options) => ({
  name: 'lightningcss',

  async build(context) {
    const { src, ignore, minify, sourcemap } = { ...options }

    const files = await glob(src ?? '**/!(_)*.css', {
      ignore: ignore ?? [],
      cwd: context.cwd,
    })

    await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(context.cwd, file)
        const fileContent = await fs.readFile(filePath)

        const { code, map, warnings } = lightningcss.transform({
          filename: filePath,
          code: fileContent,
          minify: minify,
          sourceMap: sourcemap,
          projectRoot: context.cwd,
        })

        warnings.forEach((warn) => {
          context.logger.warn(warn)
        })

        if (map) {
          await fs.writeFile(`${filePath}.map`, map)
        }

        return fs.writeFile(filePath, code)
      })
    )
  },
})
