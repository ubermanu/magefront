import glob, { Pattern } from 'fast-glob'
import fs from 'fs'
import path from 'path'
import { compile } from 'svelte/compiler'
import { CompileOptions } from 'svelte/types/compiler'

export interface Options {
  src?: string | string[]
  ignore?: Pattern[]
  compilerOptions?: CompileOptions
}

/**
 * Transform `*.svelte` files to `*.js` files.
 *
 * @param {Options} options
 * @returns {function( any ): Promise<Awaited< any >[]>}
 */
export default (options: Options = {}) => {
  const { src, ignore, compilerOptions } = options

  // @ts-ignore
  return async (themeConfig) => {
    const files = await glob(src ?? '**/*.svelte', {
      ignore: ignore ?? [],
      cwd: themeConfig.src,
    })

    return Promise.all(
      files.map(async (file) => {
        const filePath = path.join(themeConfig.src, file)
        const fileContent = await fs.promises.readFile(filePath)
        const output = compile(fileContent.toString(), compilerOptions ?? {})

        return fs.promises.writeFile(filePath.replace(/\.svelte$/, '.js'), output.js.code)
      })
    )
  }
}
