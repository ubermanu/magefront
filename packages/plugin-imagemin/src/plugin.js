import glob from 'fast-glob'
import imagemin from 'imagemin'
import fs from 'node:fs/promises'
import path from 'node:path'

/**
 * Optimizes images using imagemin.
 *
 * @param {import('./plugin').Options} [options]
 * @returns {import('magefront').Plugin}
 */
export default (options) => ({
  name: 'imagemin',

  async build(context) {
    const { src, ignore, dest, plugins } = { ...options }

    const files = await glob(src ?? '**/*.{jpg,jpeg,png,gif,svg}', {
      cwd: context.cwd,
      ignore,
    })

    const result = await imagemin(
      files.map((file) => path.join(context.cwd, file)),
      {
        plugins: Array.from(plugins ?? []),
      }
    )

    context.logger.info(`Optimized ${result.length} images.`)

    // For each optimized image, write it to the destination.
    await Promise.all(
      result.map(async (file) => {
        // Remove the absolute context.cwd path from the file's source path.
        const sourcePath = path.relative(context.cwd, file.sourcePath)
        const filePath = path.join(context.cwd, dest ?? '', sourcePath)

        // Write the optimized image to the destination.
        await fs.writeFile(filePath, file.data, 'utf8')
      })
    )
  },
})
