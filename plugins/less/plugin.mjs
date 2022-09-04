import glob from 'fast-glob'
import path from 'path'
import fs from 'fs'
import less27 from 'less'
import magentoImport from './lib/magento-import-preprocessor.mjs'

/**
 * For all the `less` files in the `css` directory, compile them to CSS.
 * Allow custom options to be passed in via the `options` parameter.
 * https://lesscss.org/usage/#programmatic-usage
 * TODO: Implement support for `sourcemaps` option.
 *
 * @param {{sourcemaps?: boolean, compiler?: any, plugins?: [], any:*}} options
 * @return {(function(*): void)|*}
 */
export default (options = {}) => {
  return (themeConfig) => {
    let { sourcemaps, compiler } = options

    // Add the default magento import plugin
    options.plugins ??= []
    options.plugins.unshift(magentoImport(themeConfig.modules))

    compiler ??= less27

    glob('**/!(_)*.less', { cwd: themeConfig.src }).then((files) => {
      return Promise.all(
        files.map((file) => {
          const filePath = path.join(themeConfig.src, file)
          return compiler.render(
            fs.readFileSync(filePath, 'utf8').toString(),
            {
              filename: path.resolve(filePath), // <- here we go
              ...options
            },
            (err, output) => {
              if (err) {
                console.error(err)
              } else {
                fs.writeFileSync(path.join(themeConfig.src, file).replace(/\.less$/, '.css'), output.css, 'utf8')
              }
            }
          )
        })
      )
    })
  }
}
