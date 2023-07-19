import glob, { type Pattern } from 'fast-glob'
import type { Plugin } from 'magefront'
import fs from 'node:fs/promises'
import path from 'node:path'
import { minify } from 'terser'

export interface Options {
  src?: string | string[]
  ignore?: Pattern[]
  terserOptions?: any
}

/** Find all the `js` files in the preprocessed directory and minify them. */
export default (options?: Options): Plugin => {
  const { src, ignore, terserOptions } = { ...options }

  return async (context) => {
    const files = await glob(src ?? '**/*.js', { ignore, cwd: context.src })

    await Promise.all(
      files.map(async (file: string) => {
        const filePath = path.join(context.src, file)
        const fileContent = await fs.readFile(filePath)
        const { code } = await minify(fileContent.toString(), terserOptions || {})
        if (code) {
          return fs.writeFile(filePath, code)
        }
      })
    )
  }
}
