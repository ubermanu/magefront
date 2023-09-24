import glob from 'fast-glob'
import fs from 'node:fs'
import path from 'node:path'
import stylus from 'stylus'

/**
 * Transform Stylus files to CSS.
 *
 * @param {import('./plugin').Options} [options]
 * @returns {import('magefront').Plugin}
 */
export default (options) => ({
  name: 'stylus',

  async build(context) {
    const { src, ignore, sourcemaps, compilerOptions } = { ...options }
    const files = await glob(src || '**/!(_)*.styl', {
      ignore: ignore ?? [],
      cwd: context.src,
    })

    await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(context.src, file)
        const fileContent = await fs.promises.readFile(filePath, 'utf8')

        const style = stylus(fileContent.toString(), {
          // TODO: the option is not recognized
          // sourcemap: sourcemaps,
          ...compilerOptions,
          filename: path.resolve(filePath),
        })

        style.render((err, css) => {
          if (err) {
            console.error(err)
          } else {
            const cssFilePath = filePath.replace(/\.styl$/, '.css')
            fs.writeFileSync(cssFilePath, css, 'utf8')

            if (sourcemaps) {
              // fs.writeFileSync(`${cssFilePath}.map`, JSON.stringify(style.sourcemap), 'utf8')
            }
          }
        })
      })
    )
  },
})
