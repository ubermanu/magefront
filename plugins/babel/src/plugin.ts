import babel, { type TransformOptions } from '@babel/core'
import glob, { type Pattern } from 'fast-glob'
import type { Plugin } from 'magefront'
import path from 'node:path'

export interface Options {
  src?: string | string[]
  ignore?: Pattern[]
  compilerOptions?: TransformOptions
}

/** Transform your JS code with babel. */
export default (options?: Options): Plugin => {
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
