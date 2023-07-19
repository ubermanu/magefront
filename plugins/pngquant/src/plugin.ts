import glob, { type Pattern } from 'fast-glob'
import path from 'node:path'
import PngQuant from 'pngquant'

export interface Options {
  src?: string | string[]
  ignore?: Pattern[]
  args?: string[]
}

/**
 * Optimize PNG files.
 *
 * @param {Options} options
 * @returns {function( any ): Promise<Awaited< any >[]>}
 */
export default (options: Options = {}) => {
  const { src, ignore, args = [] } = options

  const compress = (filename: string): void => {
    new PngQuant([...args, '--force', filename])
  }

  // @ts-ignore
  return async (buildContext) => {
    const files = await glob(src ?? '**/*.png', {
      ignore,
      cwd: buildContext.src,
    })

    await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(buildContext.src, file)

        try {
          compress(filePath)
        } catch (e) {
          console.error('PNGQUANT error', e)
        }
      })
    )
  }
}
