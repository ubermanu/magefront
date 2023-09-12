import glob, { type Pattern } from 'fast-glob'
import type { Plugin } from 'magefront'
import fs from 'node:fs/promises'
import path from 'node:path'
import svgo, { type Config } from 'svgo'

export interface Options {
  src?: string | string[]
  ignore?: Pattern[]
  optimizeOptions?: Config
}

/** Optimize SVG files. */
export default (options?: Options): Plugin => {
  const { src, ignore, optimizeOptions } = { ...options }

  return {
    name: 'svgo',
    async build(context) {
      const files = await glob(src ?? '**/*.svg', {
        ignore,
        cwd: context.src,
      })

      await Promise.all(
        files.map(async (file) => {
          const filePath = path.join(context.src, file)
          const fileContent = await fs.readFile(filePath)
          const result = svgo.optimize(fileContent.toString(), optimizeOptions)

          if ('data' in result) {
            await fs.writeFile(filePath, result.data)
          } else {
            console.error('SVGO error', result)
          }
        })
      )
    },
  }
}
