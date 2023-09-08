import glob, { type Pattern } from 'fast-glob'
import less27 from 'less'
import type { Plugin } from 'magefront'
import fs from 'node:fs/promises'
import path from 'node:path'
import magentoImportPreprocessor from './magento-import-preprocessor'

export interface Options {
  src?: string | string[]
  ignore?: Pattern[]
  sourcemaps?: boolean
  compiler?: any
  magentoImport?: boolean
  plugins?: any[]
  compilerOptions?: any
}

/** For all the `less` files in the `css` directory, compile them to CSS. */
export default (options?: Options): Plugin => {
  const { src, ignore, compiler, sourcemaps, compilerOptions } = { ...options }
  const less = compiler ?? less27
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
      files.map(async (file: string) => {
        const filePath = path.join(context.src, file)
        const fileContent = await fs.readFile(filePath, 'utf8')

        const output = await less
          .render(
            fileContent.toString(),
            {
              sourceMap: sourcemaps,
              plugins,
              ...compilerOptions,
              filename: path.resolve(filePath),
            },
            false
          )
          .catch((error: any) => {
            // TODO: Throw error and catch it with logger
            console.error(error)
          })
          .then((output: any) => output)

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
