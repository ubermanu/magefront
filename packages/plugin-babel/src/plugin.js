import babel from '@babel/core'
import glob from 'fast-glob'
import path from 'node:path'

/**
 * Transform your JS code with babel.
 *
 * @param {import('./plugin').Options} [options]
 * @returns {import('magefront').Plugin}
 */
export default (options) => {
  const { src, ignore, compilerOptions } = { ...options }

  if (!src) {
    throw new Error('The `src` option is required')
  }

  return {
    name: 'babel',

    async build(context) {
      const files = await glob(src, {
        ignore: ignore ?? [],
        cwd: context.cwd,
      })

      await Promise.all(
        files.map((file) => {
          const filePath = path.join(context.cwd, file)
          return babel.transformAsync(filePath, compilerOptions)
        })
      )
    },
  }
}
