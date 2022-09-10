import glob from 'fast-glob'
import path from 'path'
import fs from 'fs'
import typescript from 'typescript'

/**
 * Transform TypeScript files to JavaScript.
 *
 * @param {{src?:any, ignore?:any, compilerOptions?: {}}} options
 * @returns {function(*): Promise<Awaited<unknown>[]>}
 */
export default (options = {}) => {
  const { src, ignore, compilerOptions } = options

  return async (themeConfig) => {
    const files = await glob(src ?? '**/*.ts', {
      ignore: ignore ?? ['**/node_modules/**', '**/*.d.ts'],
      cwd: themeConfig.src
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
