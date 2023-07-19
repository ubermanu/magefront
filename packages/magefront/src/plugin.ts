import type { ThemeConfig } from './config'
import type { MagentoLanguage } from './magento/language'
import type { MagentoModule } from './magento/module'
import type { MagentoTheme } from './magento/theme'

/** Extends the themeConfig with additional values to be passed to the plugin when it's running. */
export interface PluginContext extends ThemeConfig {
  locale: string
  modules: string[]
  moduleList: MagentoModule[]
  languageList: MagentoLanguage[]
  themeList: MagentoTheme[]
  themeDependencyTree: string[]
  cwd: string
}

/** The plugin interface. */
export type Plugin = (context: PluginContext) => Promise<void>
