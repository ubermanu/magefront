import glob, { type Pattern } from 'fast-glob'
import type { Plugin } from 'magefront'
import path from 'node:path'
// @ts-ignore
import PngQuant from 'pngquant'

export interface Options {
  src?: string | string[]
  ignore?: Pattern[]
  args?: string[]
}

/** Optimize PNG files. */
export default (options?: Options): Plugin => {
  const { src, ignore, args = [] } = { ...options }

  const compress = (filename: string): void => {
    new PngQuant([...args, '--force', filename])
  }

  return async (context) => {
    const files = await glob(src ?? '**/*.png', {
      ignore,
      cwd: context.src,
    })

    await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(context.src, file)

        try {
          compress(filePath)
        } catch (e) {
          console.error('PNGQUANT error', e)
        }
      })
    )
  }
}
