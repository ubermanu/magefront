import babel from '@babel/core'
import glob from 'fast-glob'
import path from 'node:path'

/**
 * Transform your JS code with babel.
 *
 * @param {import('types').Options} [options]
 * @returns {import('magefront').Plugin}
 */
export default (options) => {
  const { src, ignore, compilerOptions } = { ...options }

  if (!src) {
    throw new Error('The `src` option is required')
  }

  return async (context) => {
    const files = await glob(src, {
      ignore: ignore ?? [],
      cwd: context.src,
    })

    await Promise.all(
      files.map((file) => {
        const filePath = path.join(context.src, file)
        return babel.transformAsync(filePath, compilerOptions)
      })
    )
  }
}
