import { Pattern } from 'fast-glob'
import { Plugin } from 'magefront'

export interface Options {
  src?: string | string[]
  ignore?: Pattern[]
  dest?: string
  plugins?: import('imagemin').Plugin[]
}

export default function (options?: Options): Plugin
