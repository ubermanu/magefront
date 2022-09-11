import babel from 'magefront-plugin-babel'

/**
 * Transform `*.jsx` files to `*.js` files.
 *
 * @param {{src?:any, ignore?:any, compilerOptions?: {}}} options
 * @returns {function(*): Promise<Awaited<unknown>[]>}
 */
export default (options = {}) => {
  const { src, ignore, compilerOptions } = options

  const babelReactPreset = {
    presets: [
      [
        '@babel/preset-react',
        {
          runtime: 'automatic'
        }
      ]
    ]
  }

  return babel({ src, ignore, compilerOptions: compilerOptions ?? babelReactPreset })
}
