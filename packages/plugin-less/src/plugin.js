import glob from 'fast-glob'
import less27 from 'less'
import fs from 'node:fs/promises'
import path from 'node:path'
import magentoImportPreprocessor from './magento-import-preprocessor'

/**
 * For all the `less` files in the `css` directory, compile them to CSS.
 *
 * @param {import('types').Options} [options]
 * @returns {import('magefront').Plugin}
 */
export default (options) => {
  const { src, ignore, compiler, sourcemaps, compilerOptions } = { ...options }

  const plugins = options?.plugins ?? []
  const magentoImport = options?.magentoImport ?? true

  return async (context) => {
    // Add the default magento import plugin
    // Necessary to resolve the "//@magento_import" statements in the core styles
    if (magentoImport) {
      plugins.unshift(magentoImportPreprocessor(context.modules))
    }

    const files = await glob(src ?? '**/!(_)*.less', {
      ignore,
      cwd: context.src,
    })

    await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(context.src, file)
        const fileContent = await fs.readFile(filePath, 'utf8')

        /** @type {{ render: (input: string, options: Less.Options, callback: boolean | Function) => Promise<Less.RenderOutput> }} */
        const less = compiler ?? less27

        const output = await less.render(
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
  }
}

export { magentoImportPreprocessor }
