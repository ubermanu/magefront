import glob, { type Pattern } from 'fast-glob'
import type { Plugin } from 'magefront'
import fs from 'node:fs/promises'
import path from 'node:path'
import { compileAsync, type Options as SassOptions } from 'sass'

export interface Options {
  src?: string | string[]
  ignore?: Pattern[]
  sourcemaps?: boolean
  compilerOptions?: SassOptions<'async'>
}

/**
 * Compile SCSS files to CSS.
 *
 * Note: This plugin is not compatible with node-sass because it has been deprecated.
 */
export default (options: Options = {}): Plugin => {
  const { src, ignore, sourcemaps, compilerOptions } = { ...options }

  return async (context) => {
    const files = await glob(src ?? '**/!(_)*.scss', {
      ignore: ignore ?? [],
      cwd: context.src,
    })

    await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(context.src, file)
        const output = await compileAsync(filePath, compilerOptions)

        const cssFilePath = filePath.replace(/\.scss$/, '.css')
        await fs.writeFile(cssFilePath, output.css, 'utf8')

        // TODO: The map is always null?
        if (sourcemaps && output.sourceMap) {
          await fs.writeFile(`${cssFilePath}.map`, JSON.stringify(output.sourceMap), 'utf8')
        }
      })
    )
  }
}
