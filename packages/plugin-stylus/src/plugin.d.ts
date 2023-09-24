import { Pattern } from 'fast-glob'
import { Plugin } from 'magefront'
import { RenderOptions } from 'stylus'

export interface Options {
  src?: string | string[]
  ignore?: Pattern[]
  sourcemaps?: boolean
  compilerOptions?: RenderOptions
}

export default function (options?: Options): Plugin
