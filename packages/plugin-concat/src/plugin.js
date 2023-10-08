import glob from 'fast-glob'
import fs from 'node:fs/promises'
import path from 'node:path'

/**
 * Merges multiple files into one.
 *
 * @param {import('./plugin').Options} [options]
 * @returns {import('magefront').Plugin}
 */
export default (options) => {
  const { src, ignore, dest, remove = true } = { ...options }

  return {
    name: 'concat',
    async build(context) {
      if (!src) {
        throw new Error('Missing "src" option')
      }

      if (!dest) {
        throw new Error('Missing "dest" option')
      }

      const files = await glob(src, { ignore, cwd: context.cwd })

      const packed = await Promise.all(
        files.map((file) => {
          const filePath = path.join(context.cwd, file)
          return fs.readFile(filePath, 'utf8')
        })
      )

      // Delete the original files
      if (remove ?? true) {
        await Promise.all(
          files.map((file) => {
            const filePath = path.join(context.cwd, file)
            return fs.unlink(filePath)
          })
        )
      }

      // Write the merged file (after deleting the original files)
      await fs.writeFile(
        path.join(context.cwd, dest),
        packed.join('\n'),
        'utf8'
      )
    },
  }
}
