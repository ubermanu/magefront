import type { Logger } from 'winston'
import type { MagentoLanguage } from './magento/language'
import type { MagentoModule } from './magento/module'
import type { MagentoTheme } from './magento/theme'

/** Extends the themeConfig with additional values to be passed to the plugin when it's running. */
export type PluginContext = {
  theme: string
  src: string
  dest: string
  locale: string
  modules: string[]
  moduleList: MagentoModule[]
  languageList: MagentoLanguage[]
  themeList: MagentoTheme[]
  themeDependencyTree: string[]
  cwd: string
  logger: Logger
}

/** The plugin interface. */
export type Plugin = (context: PluginContext) => Promise<void>
