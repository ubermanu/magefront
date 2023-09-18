import { Plugin } from 'magefront'

interface Options {
  dest?: string
}

declare const _default: (options?: Options) => Plugin

export { _default as default, type Options }
