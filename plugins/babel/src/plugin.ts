import babel, { TransformOptions } from '@babel/core'
import glob, { Pattern } from 'fast-glob'
import path from 'path'

export interface Options {
  src?: string | string[]
  ignore?: Pattern[]
  compilerOptions?: TransformOptions
}

/**
 * Transform your JS code with babel.
 *
 * @param {Options} options
 * @returns {function( any ): Promise<Awaited< any >[]>}
 */
export default (options: Options = {}) => {
  const { src, ignore, compilerOptions } = options

  if (!src) {
    throw new Error('The `src` option is required')
  }

  // @ts-ignore
  return async (themeConfig) => {
    const files = await glob(src, {
      ignore: ignore ?? [],
      cwd: themeConfig.src,
    })

    return Promise.all(
      files.map((file) => {
        const filePath = path.join(themeConfig.src, file)
        return babel.transformAsync(filePath, compilerOptions)
      })
    )
  }
}
