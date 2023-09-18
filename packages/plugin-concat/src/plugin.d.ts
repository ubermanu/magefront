import { Pattern } from 'fast-glob'
import { Plugin } from 'magefront'

interface Options {
  src: string | string[]
  ignore?: Pattern[]
  dest: string
  remove?: boolean
}

declare const _default: (options?: Options) => Plugin

export { _default as default, type Options }
