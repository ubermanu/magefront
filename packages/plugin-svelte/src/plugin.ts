import glob, { type Pattern } from 'fast-glob'
import type { Plugin } from 'magefront'
import fs from 'node:fs'
import path from 'node:path'
import { compile } from 'svelte/compiler'
import { type CompileOptions } from 'svelte/types/compiler/interfaces'

export interface Options {
  src?: string | string[]
  ignore?: Pattern[]
  compilerOptions?: CompileOptions
}

/** Transform `*.svelte` files to `*.js` files. */
export default (options?: Options): Plugin => {
  const { src, ignore, compilerOptions } = { ...options }

  return {
    name: 'svelte',
    async build(context) {
      const files = await glob(src ?? '**/*.svelte', {
        ignore: ignore ?? [],
        cwd: context.src,
      })

      await Promise.all(
        files.map(async (file) => {
          const filePath = path.join(context.src, file)
          const fileContent = await fs.promises.readFile(filePath)
          const output = compile(fileContent.toString(), compilerOptions ?? {})

          return fs.promises.writeFile(filePath.replace(/\.svelte$/, '.js'), output.js.code)
        })
      )
    },
  }
}
