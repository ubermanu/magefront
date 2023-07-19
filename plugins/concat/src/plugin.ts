import glob, { Pattern } from 'fast-glob'
import fs from 'fs'
import path from 'node:path'

export interface Options {
  src: string | string[]
  ignore?: Pattern[]
  dest: string
  remove?: boolean
}

/**
 * Merge files into one.
 *
 * @param {Options} options
 * @returns {(function( any ): Promise<void>)| any}
 */
export default (options: Options) => {
  const { src, ignore, dest, remove } = options

  // @ts-ignore
  return async (buildContext) => {
    if (!src) {
      throw new Error('Missing "src" option')
    }

    if (!dest) {
      throw new Error('Missing "dest" option')
    }

    const files = await glob(src, { ignore, cwd: buildContext.src })

    const packed = await Promise.all(
      files.map((file: string) => {
        const filePath = path.join(buildContext.src, file)
        return fs.promises.readFile(filePath, 'utf8')
      })
    )

    // Write the merged file
    await fs.promises.writeFile(path.join(buildContext.src, dest), packed.join('\n'), 'utf8')

    // Delete the original files
    if (remove ?? true) {
      await Promise.all(
        files.map((file: string) => {
          const filePath = path.join(buildContext.src, file)
          return fs.promises.unlink(filePath)
        })
      )
    }
  }
}
