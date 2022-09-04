import glob from 'fast-glob'
import path from 'path'
import fs from 'fs'
import dartSass from 'sass'

/**
 * Compile SCSS files to CSS.
 * You can use the `compiler` option to specify the sass compiler to use. (e.g. node-sass)
 *
 * @param {{sourcemaps?: boolean, compiler?: any, any}} options
 * @return {(function(*): *)|*}
 */
export default (options = {}) => {
  return (themeConfig) => {
    const { sourcemaps, compiler } = options
    const sass = compiler ?? dartSass

    glob('**/!(_)*.scss', { cwd: themeConfig.src }).then((files) => {
      return Promise.all(
        files.map((file) => {
          const filePath = path.join(themeConfig.src, file)
          return sass.render(
            {
              file: filePath,
              ...options
            },
            (err, output) => {
              if (err) {
                console.error(err)
              } else {
                fs.writeFileSync(path.join(themeConfig.src, file).replace(/\.scss$/, '.css'), output.css, 'utf8')
              }
            }
          )
        })
      )
    })
  }
}
