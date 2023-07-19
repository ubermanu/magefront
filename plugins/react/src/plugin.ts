import babel, { Options as BabelOptions } from 'magefront-plugin-babel'

export interface Options extends BabelOptions {}

/**
 * Transform `*.jsx` files to `*.js` files.
 *
 * @param {Options} options
 * @returns {function( any ): Promise<Awaited<unknown>[]>}
 */
export default (options: Options = {}) => {
  // @ts-ignore
  const { src, ignore, compilerOptions } = options

  const babelReactPreset = {
    presets: [
      [
        '@babel/preset-react',
        {
          runtime: 'automatic',
        },
      ],
    ],
  }

  return babel({
    src,
    ignore,
    compilerOptions: compilerOptions ?? babelReactPreset,
  })
}
