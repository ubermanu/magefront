import { Pattern } from 'fast-glob'
import { Plugin } from 'magefront'
import { CompilerOptions } from 'typescript'

export interface Options {
  src?: string | string[]
  ignore?: Pattern[]
  compilerOptions?: CompilerOptions
}

export default function (options?: Options): Plugin
