import glob, { Pattern } from 'fast-glob'
import fs from 'fs'
import path from 'path'
import typescript, { CompilerOptions } from 'typescript'

export interface Options {
  src?: string | string[]
  ignore?: Pattern[]
  compilerOptions?: CompilerOptions
}

/**
 * Transform TypeScript files to JavaScript.
 *
 * @param {Options} options
 * @returns {function( any ): Promise<Awaited<unknown>[]>}
 */
export default (options: Options = {}) => {
  const { src, ignore, compilerOptions } = options

  // @ts-ignore
  return async (themeConfig) => {
    const files = await glob(src ?? '**/*.ts', {
      ignore: ignore ?? ['**/node_modules/**', '**/*.d.ts'],
      cwd: themeConfig.src,
    })

    return Promise.all(
      files.map(async (file) => {
        const filePath = path.join(themeConfig.src, file)
        const fileContent = await fs.promises.readFile(filePath)
        const output = typescript.transpile(fileContent.toString(), compilerOptions ?? {})

        return fs.promises.writeFile(filePath.replace(/\.ts$/, '.js'), output)
      })
    )
  }
}
