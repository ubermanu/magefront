import { Pattern } from 'fast-glob'
import { Plugin } from 'magefront'
import { AcceptedPlugin } from 'postcss'

export interface Options {
  src?: string | string[]
  ignore?: Pattern[]
  plugins?: AcceptedPlugin[]
}

export default function (options?: Options): Plugin
