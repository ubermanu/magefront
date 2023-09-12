import type { Plugin } from 'magefront'
import babel, { type Options as BabelOptions } from 'magefront-plugin-babel'

export interface Options extends BabelOptions {}

/** Transform `*.jsx` files to `*.js` files. */
export default (options?: Options): Plugin => {
  const { src, ignore, compilerOptions } = { ...options }

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

  return {
    ...babel({
      src,
      ignore,
      compilerOptions: compilerOptions ?? babelReactPreset,
    }),
    name: 'react',
  }
}
