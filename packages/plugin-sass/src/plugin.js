import glob from 'fast-glob'
import fs from 'node:fs/promises'
import path from 'node:path'
import { compileAsync } from 'sass'
/**
 * Compile SCSS files to CSS.
 *
 * Note: This plugin is not compatible with node-sass because it has been deprecated.
 *
 * @param {import('types').Options} [options]
 * @returns {import('magefront').Plugin}
 */
export default (options) => ({
  name: 'sass',

  async build(context) {
    const { src, ignore, sourcemaps, compilerOptions } = { ...options }

    const files = await glob(src ?? '**/!(_)*.scss', {
      ignore: ignore ?? [],
      cwd: context.src,
    })

    await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(context.src, file)
        const output = await compileAsync(filePath, compilerOptions)

        const cssFilePath = filePath.replace(/\.scss$/, '.css')
        await fs.writeFile(cssFilePath, output.css, 'utf8')

        // TODO: The map is always null?
        if (sourcemaps && output.sourceMap) {
          await fs.writeFile(`${cssFilePath}.map`, JSON.stringify(output.sourceMap), 'utf8')
        }
      })
    )
  },
})
