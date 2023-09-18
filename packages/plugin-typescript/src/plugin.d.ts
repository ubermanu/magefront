import { Pattern } from 'fast-glob'
import { Plugin } from 'magefront'
import { CompilerOptions } from 'typescript'

interface Options {
  src?: string | string[]
  ignore?: Pattern[]
  compilerOptions?: CompilerOptions
}
/** Transform TypeScript files to JavaScript. */
declare const _default: (options?: Options) => Plugin

export { _default as default, type Options }
