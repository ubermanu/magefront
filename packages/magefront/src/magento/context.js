import { getPackages } from './composer'

/**
 * Create a Magento context.
 *
 * @param {import('types').MagefrontOptions} opts
 * @returns {import('types').MagentoContext}
 */
export function createMagentoContext(opts) {
  const rootPath = opts?.magento?.rootPath || process.cwd()

  return {
    packages: getPackages(rootPath),
    rootPath,
    tempPath: 'var/view_preprocessed/magefront',
  }
}