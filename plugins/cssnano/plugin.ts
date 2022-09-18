import postcss, { Options as PostcssOptions } from 'magefront-plugin-postcss'
import cssnano from 'cssnano'

export interface Options extends PostcssOptions {
  preset?: any
  configFile?: string
}

/**
 * @param {Options} options
 * @returns {function(*): Promise<Awaited<void>>}
 */
export default (options: Options = {}) => {
  const { src, ignore, preset, plugins } = options

  return postcss({
    src,
    ignore,
    plugins: [
      cssnano({
        preset: preset ?? 'default',
        plugins: plugins ?? []
      })
    ]
  })
}
