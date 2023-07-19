import cssnano from 'cssnano'
import postcss, { Options as PostcssOptions } from 'magefront-plugin-postcss'

export interface Options extends PostcssOptions {
  preset?: any
  configFile?: string
}

/**
 * @param {Options} options
 * @returns {function( any ): Promise<Awaited<void>>}
 */
export default (options: Options = {}) => {
  const { src, ignore, preset, plugins } = options

  return postcss({
    src,
    ignore,
    plugins: [
      cssnano({
        preset: preset ?? 'default',
        plugins,
      }),
    ],
  })
}
