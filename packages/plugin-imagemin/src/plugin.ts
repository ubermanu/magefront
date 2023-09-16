import glob, { type Pattern } from 'fast-glob'
import type { Plugin as ImageMinPlugin } from 'imagemin'
import imagemin from 'imagemin'
import type { Plugin } from 'magefront'
import fs from 'node:fs/promises'
import path from 'node:path'

export interface Options {
  src?: string | string[]
  ignore?: Pattern[]
  dest?: string
  plugins?: ImageMinPlugin[]
}

/** Optimizes images using imagemin. */
export default (options?: Options): Plugin => {
  const { src, ignore, dest, plugins = [] } = { ...options }

  return async (context) => {
    const files = await glob(src ?? '**/*.{jpg,jpeg,png,gif,svg}', {
      cwd: context.src,
      ignore,
    })

    const result = await imagemin(
      files.map((file) => path.join(context.src, file)),
      {
        plugins,
      }
    )

    context.logger.info(`Optimized ${result.length} images.`)

    // For each optimized image, write it to the destination.
    await Promise.all(
      result.map(async (file) => {
        // Remove the absolute context.src path from the file's source path.
        const sourcePath = path.relative(context.src, file.sourcePath)
        const filePath = path.join(context.src, dest ?? '', sourcePath)

        // Write the optimized image to the destination.
        await fs.writeFile(filePath, file.data, 'utf8')
      })
    )
  }
}
