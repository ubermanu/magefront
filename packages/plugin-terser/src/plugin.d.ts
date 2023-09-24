import { Pattern } from 'fast-glob'
import { Plugin } from 'magefront'
import { MinifyOptions } from 'terser'

export interface Options {
  src?: string | string[]
  ignore?: Pattern[]
  terserOptions?: MinifyOptions
}

export default function (options?: Options): Plugin
