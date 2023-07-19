import glob, { type Pattern } from 'fast-glob'
import fs from 'fs'
import path from 'node:path'
import stylus, { type RenderOptions } from 'stylus'

export interface Options {
  src?: string | string[]
  ignore?: Pattern[]
  sourcemaps?: boolean
  compilerOptions?: RenderOptions
}

/**
 * Transform Stylus files to CSS.
 *
 * @param {Options} options
 * @returns {function( any ): Promise<Awaited< any >[]>}
 */
export default (options: Options = {}) => {
  const { src, ignore, sourcemaps, compilerOptions } = options

  // @ts-ignore
  return async (themeConfig) => {
    const files = await glob(src || '**/!(_)*.styl', {
      ignore: ignore ?? [],
      cwd: themeConfig.src,
    })

    return Promise.all(
      files.map(async (file) => {
        const filePath = path.join(themeConfig.src, file)
        const fileContent = await fs.promises.readFile(filePath, 'utf8')

        const style = stylus(fileContent.toString(), {
          // @ts-ignore TODO: the option is not recognized
          sourcemap: sourcemaps,
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
  }
}
