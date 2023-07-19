export interface Options {
  dest: string
}

/**
 * Merge files into one.
 *
 * @param {Options} options
 * @returns {(function( any ): Promise<void>)| any}
 */
export default (options: Options) => {
  // @ts-ignore
  return async (buildContext) => {
    throw new Error('Not implemented yet')
  }
}
