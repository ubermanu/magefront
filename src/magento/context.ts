import { MagefrontOptions, MagentoContext } from '../types'
import { getPackages } from './composer'

export const createMagentoContext = (opts: MagefrontOptions): MagentoContext => {
  const rootPath = opts?.magento?.rootPath || process.cwd()

  return {
    packages: getPackages(rootPath),
    rootPath,
    tempPath: 'var/view_preprocessed/magefront',
  }
}
