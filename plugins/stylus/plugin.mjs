import glob from 'fast-glob'
import path from 'path'
import fs from 'fs'
import stylus from 'stylus'

/**
 * Transform Stylus files to CSS.
 *
 * @param {{sourcemaps?: boolean, any}} options
 * @return {(function(*): *)|*}
 */
export default (options = {}) => {
  return (themeConfig) => {
    const { sourcemaps } = options

    glob('**/!(_)*.styl', { cwd: themeConfig.src }).then((files) => {
      return Promise.all(
        files.map((file) => {
          const filePath = path.join(themeConfig.src, file)
          return stylus.render(
            fs.readFileSync(filePath, 'utf8').toString(),
            {
              filename: path.resolve(filePath),
              ...options
            },
            (err, output) => {
              if (err) {
                console.error(err)
              } else {
                fs.writeFileSync(path.join(themeConfig.src, file).replace(/\.styl$/, '.css'), output, 'utf8')
              }
            }
          )
        })
      )
    })
  }
}
