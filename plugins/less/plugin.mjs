import glob from 'fast-glob'
import path from 'path'
import fs from 'fs'
import less27 from 'less'
import magentoImport from './lib/magento-import-preprocessor.mjs'

/**
 * For all the `less` files in the `css` directory, compile them to CSS.
 *
 * @param {{src?: any, ignore?: any, sourcemaps?: boolean, compiler?: any, plugins?: [], lessOptions?: {}}} options
 * @returns {function(*): Promise<Awaited<*>[]>}
 */
export default (options = {}) => {
  const { src, ignore, compiler, sourcemaps, compilerOptions } = options
  const less = compiler ?? less27
  const plugins = options.plugins ?? []

  return async (themeConfig) => {
    // Add the default magento import plugin
    // Necessary to resolve the "//@magento_import" statements in the core styles
    plugins.unshift(magentoImport(themeConfig.modules))

    const files = await glob(src || '**/!(_)*.less', { ignore: ignore ?? [], cwd: themeConfig.src })

    return Promise.all(
      files.map(async (file) => {
        const filePath = path.join(themeConfig.src, file)
        const fileContent = await fs.promises.readFile(filePath, 'utf8')

        const output = await less
          .render(
            fileContent.toString(),
            {
              sourceMap: sourcemaps,
              plugins,
              ...compilerOptions,
              filename: path.resolve(filePath)
            },
            false
          )
          .catch((error) => {
            // TODO: Throw error and catch it with logger
            console.error(error)
          })
          .then((output) => output)

        const cssFilePath = filePath.replace(/\.less$/, '.css')

        if (output.css) {
          await fs.promises.writeFile(cssFilePath, output.css, 'utf8')
        }

        // TODO: Render the map alongside the CSS file
        if (output.map) {
          await fs.promises.writeFile(`${cssFilePath}.map`, output.map, 'utf8')
        }
      })
    )
  }
}
