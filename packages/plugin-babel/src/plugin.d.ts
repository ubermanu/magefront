import { TransformOptions } from '@babel/core'
import { Pattern } from 'fast-glob'
import { Plugin } from 'magefront'

export interface Options {
  src?: string | string[]
  ignore?: Pattern[]
  compilerOptions?: TransformOptions
}

export default function (options?: Options): Plugin
