import glob from 'fast-glob'
import less from 'less'
import fs from 'node:fs/promises'
import path from 'node:path'
import magentoImportPreprocessor from './magento-import-preprocessor.js'

/**
 * For all the `less` files in the `css` directory, compile them to CSS.
 *
 * @param {import('./plugin').Options} [options]
 * @returns {import('magefront').Plugin}
 */
export default (options) => ({
  name: 'less',

  async build(context) {
    const { src, ignore, sourcemaps, compilerOptions } = { ...options }
    const plugins = options?.plugins ?? []
    const magentoImport = options?.magentoImport ?? true

    // Add the default magento import plugin
    // Necessary to resolve the "//@magento_import" statements in the core styles
    if (magentoImport) {
      plugins.unshift(magentoImportPreprocessor(context.modules))
    }

    const files = await glob(src ?? '**/!(_)*.less', {
      ignore,
      cwd: context.src,
    })

    /**
     * @type {{
     *   render: (
     *     input: string,
     *     options: Less.Options,
     *     callback: boolean | Function
     *   ) => Promise<Less.RenderOutput>
     * }}
     */
    const _less = less

    context.logger.debug(
      `Using Less v${less.version.toString().replace(/,/g, '.')}`
    )

    await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(context.src, file)
        const fileContent = await fs.readFile(filePath, 'utf8')

        const output = await _less.render(
          fileContent.toString(),
          {
            sourceMap: {
              sourceMapFileInline: sourcemaps ?? false,
            },
            plugins,
            ...compilerOptions,
            filename: path.resolve(filePath),
          },
          false
        )

        const cssFilePath = filePath.replace(/\.less$/, '.css')

        if (output.css) {
          await fs.writeFile(cssFilePath, output.css, 'utf8')
        }

        // TODO: Render the map alongside the CSS file
        if (output.map) {
          await fs.writeFile(`${cssFilePath}.map`, output.map, 'utf8')
        }
      })
    )
  },
})

export { magentoImportPreprocessor }
