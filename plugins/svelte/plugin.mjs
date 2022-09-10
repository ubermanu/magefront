import glob from 'fast-glob'
import path from 'path'
import fs from 'fs'
import { compile } from 'svelte/compiler'

/**
 * Transform `*.svelte` files to `*.js` files.
 *
 * @param {{src?:any, ignore?:any, compilerOptions?: any}} options
 * @returns {function(*): Promise<Awaited<*>[]>}
 */
export default (options = {}) => {
  const { src, ignore, compilerOptions } = options

  return async (themeConfig) => {
    const files = await glob(src || '**/*.svelte', { ignore: ignore ?? [], cwd: themeConfig.src })

    return Promise.all(
      files.map(async (file) => {
        const filePath = path.join(themeConfig.src, file)
        const fileContent = await fs.promises.readFile(filePath)
        const output = compile(fileContent.toString(), compilerOptions)

        return fs.promises.writeFile(filePath.replace(/\.svelte$/, '.js'), output.js.code)
      })
    )
  }
}
