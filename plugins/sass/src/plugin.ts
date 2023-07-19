import glob, { Pattern } from 'fast-glob'
import fs from 'fs'
import path from 'path'
import dartSass, { Options as RenderOptions, SassException, Result as SassResult } from 'sass'

export interface Options {
  src?: string | string[]
  ignore?: Pattern[]
  sourcemaps?: boolean
  compiler?: any
  compilerOptions?: RenderOptions
}

/**
 * Compile SCSS files to CSS. You can use the `compiler` option to specify the sass compiler to use. (e.g. node-sass)
 *
 * @param {Options} options
 * @returns {function( any ): Promise<Awaited< any >[]>}
 */
export default (options: Options = {}) => {
  const { src, ignore, sourcemaps, compiler, compilerOptions } = options
  const sass = compiler ?? dartSass

  // @ts-ignore
  return async (themeConfig) => {
    const files = await glob(src ?? '**/!(_)*.scss', {
      ignore: ignore ?? [],
      cwd: themeConfig.src,
    })

    return Promise.all(
      files.map(async (file) => {
        const filePath = path.join(themeConfig.src, file)

        return sass.render(
          {
            ...compilerOptions,
            file: filePath,
          },
          (err: SassException, output: SassResult) => {
            if (err) {
              console.error(err)
            } else {
              const cssFilePath = filePath.replace(/\.scss$/, '.css')
              fs.writeFileSync(cssFilePath, output.css, 'utf8')

              // TODO: The map is always null?
              if (sourcemaps && output.map) {
                fs.writeFileSync(`${cssFilePath}.map`, JSON.stringify(output.map), 'utf8')
              }
            }
          }
        )
      })
    )
  }
}
