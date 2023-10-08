import { Pattern } from 'fast-glob'
import { Plugin } from 'magefront'

export interface Options {
  src?: string | string[]
  ignore?: Pattern[]
  minify?: boolean
  sourcemap?: boolean
}

export default function (options?: Options): Plugin
