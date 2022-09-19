import glob, { Pattern } from 'fast-glob'
import path from 'path'
import fs from 'fs'
import svgo, { OptimizeOptions } from 'svgo'

export interface Options {
  src?: string | string[]
  ignore?: Pattern[]
  optimizeOptions?: OptimizeOptions
}

/**
 * Optimize SVG files.
 *
 * @param {Options} options
 * @returns {function(*): Promise<Awaited<*>[]>}
 */
export default (options: Options = {}) => {
  const { src, ignore, optimizeOptions } = options

  // @ts-ignore
  return async (buildContext) => {
    const files = await glob(src ?? '**/*.svg', { ignore, cwd: buildContext.src })

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
