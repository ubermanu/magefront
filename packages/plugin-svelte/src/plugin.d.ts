import { Pattern } from 'fast-glob'
import { Plugin } from 'magefront'
import { CompileOptions } from 'svelte/types/compiler/interfaces'

export interface Options {
  src?: string | string[]
  ignore?: Pattern[]
  compilerOptions?: CompileOptions
}

export default function (options?: Options): Plugin
