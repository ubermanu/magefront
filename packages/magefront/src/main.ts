// Main module entry point if the package is installed as dependency.
// Gives quick access to the magento related functions from the package.

import type { Config } from './types'

export type { Config, MagefrontOptions, MagentoLanguage, MagentoModule, MagentoTheme, Plugin, PluginContext, Preset } from './types'

export { magefront } from './magefront'

// Auxiliary function for defining the configuration object.
export function defineConfig<T extends Config>(options: T): T {
  return options
}
