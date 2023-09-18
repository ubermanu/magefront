import { Pattern } from 'fast-glob'
import { Plugin } from 'magefront'
import { MinifyOptions } from 'terser'

interface Options {
  src?: string | string[]
  ignore?: Pattern[]
  terserOptions?: MinifyOptions
}
/** Find all the `js` files in the preprocessed directory and minify them. */
declare const _default: (options?: Options) => Plugin

export { _default as default, type Options }
