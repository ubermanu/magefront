import glob, { type Pattern } from 'fast-glob'
import fs from 'fs'
import path from 'node:path'
import svgo, { type OptimizeOptions } from 'svgo'

export interface Options {
  src?: string | string[]
  ignore?: Pattern[]
  optimizeOptions?: OptimizeOptions
}

/**
 * Optimize SVG files.
 *
 * @param {Options} options
 * @returns {function( any ): Promise<Awaited< any >[]>}
 */
export default (options: Options = {}) => {
  const { src, ignore, optimizeOptions } = options

  // @ts-ignore
  return async (buildContext) => {
    const files = await glob(src ?? '**/*.svg', {
      ignore,
      cwd: buildContext.src,
    })

    await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(buildContext.src, file)
        const fileContent = await fs.promises.readFile(filePath)
        const result = await svgo.optimize(fileContent.toString(), optimizeOptions)

        if ('data' in result) {
          await fs.promises.writeFile(filePath, result.data)
        } else {
          console.error('SVGO error', result)
        }
      })
    )
  }
}
