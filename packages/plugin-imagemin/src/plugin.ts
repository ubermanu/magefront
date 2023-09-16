import glob, { type Pattern } from 'fast-glob'
import type { Plugin as ImageMinPlugin } from 'imagemin'
import imagemin from 'imagemin'
import type { Plugin } from 'magefront'
import * as path from 'path'

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

    await imagemin(files, {
      destination: path.join(context.src, dest ?? ''),
      plugins,
    })
  }
}
