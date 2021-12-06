import path from 'path'
import glob from 'fast-glob'
import fs from 'fs'
import less from 'less'
import magentoImport from './lib/magento-import-preprocessor.mjs'
import less23Compat from './lib/less-23-compat-preprocessor.mjs'

/**
 * For all the `less` files in the `css` directory, compile them to CSS.
 * TODO: Add some feedback to the user.
 *
 * @param options
 * @return {(function(*): void)|*}
 */
export default (options) => (themeConfig) => {
  // By default we load these two preprocessors,
  // so the core Magento 2 themes can be compiled without any configuration.
  const defaultOptions = {
    plugins: [magentoImport(themeConfig.modules), less23Compat()]
  }

  // Merge the default options with the user-provided options.
  options = Object.assign({}, defaultOptions, options || {})
  const { src, dest } = options

  glob
    .sync(path.join(themeConfig.src, src || 'web/css/!(_)*.less'))
    .forEach((file) => {
      const destPath = path.join(
        themeConfig.dest,
        dest || 'css',
        path.basename(file, '.less') + '.css'
      )

      const contents = fs.readFileSync(file, 'utf8')
      const opts = Object.assign({}, options, { filename: file })

      // Render the LESS file to CSS.
      less.render(contents, opts, (err, output) => {
        if (err) {
          throw new Error(err)
        } else {
          fs.mkdirSync(path.dirname(destPath), { recursive: true })
          fs.writeFileSync(destPath, output.css)
        }
      })
    })
}
