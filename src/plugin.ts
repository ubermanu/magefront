import { ThemeConfig } from './config'
import { MagentoModule } from './magento/module'
import { MagentoLanguage } from './magento/language'

/**
 * Extends the themeConfig with additional values to be passed
 * to the plugin when it's running.
 */
export interface PluginContext extends ThemeConfig {
  locale: string
  modules: string[]
  moduleList: MagentoModule[]
  languageList: MagentoLanguage[]
}

/**
 * The plugin interface.
 */
export interface Plugin extends Function {
  (context: PluginContext): Promise<void>
}
