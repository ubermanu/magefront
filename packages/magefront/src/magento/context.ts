import type { MagefrontOptions, MagentoContext } from '../../types/magefront'
import { getPackages } from './composer'

export const createMagentoContext = (opts: MagefrontOptions): MagentoContext => {
  const rootPath = opts?.magento?.rootPath || process.cwd()

  return {
    packages: getPackages(rootPath),
    rootPath,
    tempPath: 'var/view_preprocessed/magefront',
  }
}
