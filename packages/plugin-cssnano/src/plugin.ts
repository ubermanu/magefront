import cssnano from 'cssnano'
import type { Plugin } from 'magefront'
import postcss, { type Options as PostcssOptions } from 'magefront-plugin-postcss'

export interface Options extends PostcssOptions {
  preset?: any
  configFile?: string
}

/** Minifies CSS files. */
export default (options?: Options): Plugin => {
  const { src, ignore, preset, plugins } = { ...options }

  return {
    ...postcss({
      src,
      ignore,
      plugins: [
        cssnano({
          preset: preset ?? 'default',
          plugins,
        }),
      ],
    }),
    name: 'cssnano',
  }
}
