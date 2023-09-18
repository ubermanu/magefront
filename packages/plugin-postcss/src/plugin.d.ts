import { Pattern } from 'fast-glob'
import { Plugin } from 'magefront'
import { AcceptedPlugin } from 'postcss'

interface Options {
  src?: string | string[]
  ignore?: Pattern[]
  plugins?: AcceptedPlugin[]
}
/** Transforms CSS files using PostCSS. */
declare const _default: (options?: Options) => Plugin

export { _default as default, type Options }
