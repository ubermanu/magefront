import glob, { type Pattern } from 'fast-glob'
import type { Plugin } from 'magefront'
import fs from 'node:fs/promises'
import path from 'node:path'
import typescript, { type CompilerOptions } from 'typescript'

export interface Options {
  src?: string | string[]
  ignore?: Pattern[]
  compilerOptions?: CompilerOptions
}

/** Transform TypeScript files to JavaScript. */
export default (options?: Options): Plugin => {
  const { src, ignore, compilerOptions } = { ...options }

  return async (context) => {
    const files = await glob(src ?? '**/*.ts', {
      ignore: ignore ?? ['**/node_modules/**', '**/*.d.ts'],
      cwd: context.src,
    })

    await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(context.src, file)
        const fileContent = await fs.readFile(filePath)
        const output = typescript.transpile(fileContent.toString(), compilerOptions ?? {})

        return fs.writeFile(filePath.replace(/\.ts$/, '.js'), output)
      })
    )
  }
}
