import { Pattern } from 'fast-glob'
import { Plugin } from 'magefront'
import { Options as SassOptions } from 'sass'

interface Options {
  src?: string | string[]
  ignore?: Pattern[]
  sourcemaps?: boolean
  compilerOptions?: SassOptions<'async'>
}

/** Compile SCSS files to CSS. */
declare const _default: (options?: Options) => Plugin

export { _default as default, type Options }
