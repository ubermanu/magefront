import glob, { Pattern } from 'fast-glob'
import path from 'path'
import fs from 'fs'
// @ts-ignore
import pngquant from 'pngquant'

export interface Options {
  src?: string | string[]
  ignore?: Pattern[]
  args?: Array<string | number>
}

/**
 * Optimize PNG files.
 *
 * @param {Options} options
 * @returns {function(*): Promise<Awaited<*>[]>}
 */
export default (options: Options = {}) => {
  const { src, ignore, args } = options

  // @ts-ignore
  return async (buildContext) => {
    const files = await glob(src ?? '**/*.png', { ignore, cwd: buildContext.src })

    await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(buildContext.src, file)
        const fileContent = await fs.promises.readFile(filePath)
        const result = await pngquant(args)(fileContent)

        if (result) {
          return fs.promises.writeFile(filePath, result)
        } else {
          console.error('PNGQUANT error', result)
        }
      })
    )
  }
}
