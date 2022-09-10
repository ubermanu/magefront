import glob from 'fast-glob'
import path from 'path'
import fs from 'fs'
import stylus from 'stylus'

/**
 * Transform Stylus files to CSS.
 *
 * @param {{src?:any, ignore?:any, sourcemaps?:boolean, compilerOptions?:any}} options
 * @returns {function(*): Promise<Awaited<*>[]>}
 */
export default (options = {}) => {
  const { src, ignore, sourcemaps, compilerOptions } = options

  return async (themeConfig) => {
    const files = await glob(src || '**/!(_)*.styl', { ignore: ignore ?? [], cwd: themeConfig.src })

    return Promise.all(
      files.map(async (file) => {
        const filePath = path.join(themeConfig.src, file)
        const fileContent = await fs.promises.readFile(filePath, 'utf8')

        const style = stylus(fileContent.toString(), {
          sourcemap: sourcemaps,
          ...compilerOptions,
          filename: path.resolve(filePath)
        })

        style.render((err, css) => {
          if (err) {
            console.error(err)
          } else {
            const cssFilePath = filePath.replace(/\.styl$/, '.css')
            fs.writeFileSync(cssFilePath, css, 'utf8')

            if (sourcemaps) {
              fs.writeFileSync(`${cssFilePath}.map`, JSON.stringify(style.sourcemap), 'utf8')
            }
          }
        })
      })
    )
  }
}
