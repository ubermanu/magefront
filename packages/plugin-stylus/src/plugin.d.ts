import { Pattern } from 'fast-glob'
import { Plugin } from 'magefront'
import { RenderOptions } from 'stylus'

interface Options {
  src?: string | string[]
  ignore?: Pattern[]
  sourcemaps?: boolean
  compilerOptions?: RenderOptions
}

/** Transform Stylus files to CSS. */
declare const _default: (options?: Options) => Plugin

export { _default as default, type Options }
