import type { Plugin } from 'magefront'

export interface Options {
  dest?: string
}

/** Merge JS files into multiple chunks. */
export default (options?: Options): Plugin => {
  // TODO: Implement this plugin using rollup?
  return async (context) => {
    throw new Error('Not implemented yet')
  }
}
