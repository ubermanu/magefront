import glob from 'fast-glob'
import path from 'path'
import fs from 'fs'
import dartSass from 'sass'

/**
 * Compile SCSS files to CSS.
 * You can use the `compiler` option to specify the sass compiler to use. (e.g. node-sass)
 *
 * @param {{src?: any, ignore?: any, sourcemaps?: boolean, compiler?: any, compilerOptions?: any}} options
 * @returns {function(*): Promise<Awaited<*>[]>}
 */
export default (options = {}) => {
  const { src, ignore, sourcemaps, compiler, compilerOptions } = options
  const sass = compiler ?? dartSass

  return async (themeConfig) => {
    const files = await glob(src || '**/!(_)*.scss', { ignore: ignore ?? [], cwd: themeConfig.src })

    return Promise.all(
      files.map(async (file) => {
        const filePath = path.join(themeConfig.src, file)

        return sass.render(
          {
            ...compilerOptions,
            file: filePath
          },
          (err, output) => {
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
