// Main module entry point if the package is installed as dependency.
// Gives quick access to the magento related functions from the package.

import { MagefrontOptions } from './types'

export * from './config'
export * from './magento/composer'
export * from './magento/language'
export * from './magento/module'
export * from './magento/theme'
export * from './types'

export { magefront as default } from './magefront'

// Auxiliary function for defining the configuration object.
export function defineConfig<T extends MagefrontOptions | MagefrontOptions[]>(options: T): T {
  return options
}
