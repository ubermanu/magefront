import type { Plugin } from 'magefront'

export interface Options {
  dest?: string
}

/** Merge JS files into multiple chunks. */
export default (options?: Options): Plugin => ({
  name: 'js-bundle',
  async build(context) {
    throw new Error('Not implemented yet')
  },
})
