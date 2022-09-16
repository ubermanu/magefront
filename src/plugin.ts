import { ThemeConfig } from './config'
import { MagentoModule } from './magento/module'
import { MagentoLanguage } from './magento/language'
import { MagentoTheme } from './magento/theme'

/**
 * Extends the themeConfig with additional values to be passed
 * to the plugin when it's running.
 */
export interface PluginContext extends ThemeConfig {
  locale: string
  modules: string[]
  moduleList: MagentoModule[]
  languageList: MagentoLanguage[]
  themeList: MagentoTheme[]
}

/**
 * The plugin interface.
 */
export interface Plugin extends Function {
  (context: PluginContext): Promise<void>
}
