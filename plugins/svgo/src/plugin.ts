import glob, { type Pattern } from 'fast-glob'
import type { Plugin } from 'magefront'
import fs from 'node:fs/promises'
import path from 'node:path'
import svgo, { type OptimizeOptions } from 'svgo'

export interface Options {
  src?: string | string[]
  ignore?: Pattern[]
  optimizeOptions?: OptimizeOptions
}

/** Optimize SVG files. */
export default (options?: Options): Plugin => {
  const { src, ignore, optimizeOptions } = { ...options }

  return async (context) => {
    const files = await glob(src ?? '**/*.svg', {
      ignore,
      cwd: context.src,
    })

    await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(context.src, file)
        const fileContent = await fs.readFile(filePath)
        const result = await svgo.optimize(fileContent.toString(), optimizeOptions)

        if ('data' in result) {
          await fs.writeFile(filePath, result.data)
        } else {
          console.error('SVGO error', result)
        }
      })
    )
  }
}
