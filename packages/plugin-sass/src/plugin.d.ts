import { Pattern } from 'fast-glob'
import { Plugin } from 'magefront'
import { Options as SassOptions } from 'sass'

export interface Options {
  src?: string | string[]
  ignore?: Pattern[]
  sourcemaps?: boolean
  compilerOptions?: SassOptions<'async'>
}

export default function (options?: Options): Plugin
