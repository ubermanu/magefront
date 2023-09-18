import { Pattern } from 'fast-glob'
import { Plugin } from 'magefront'
import { CompileOptions } from 'svelte/types/compiler/interfaces'

interface Options {
  src?: string | string[]
  ignore?: Pattern[]
  compilerOptions?: CompileOptions
}
/** Transform `*.svelte` files to `*.js` files. */
declare const _default: (options?: Options) => Plugin

export { _default as default, type Options }
