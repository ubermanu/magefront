import { MagefrontOptions, MagentoContext } from '../types'
import { getPackages } from './composer'

export const createMagentoContext = (opts: MagefrontOptions): MagentoContext => {
  return {
    packages: getPackages(opts.magento?.rootPath || process.cwd()),
    rootPath: opts?.magento?.rootPath || process.cwd(),
    tempPath: 'var/view_preprocessed/magefront',
  }
}
