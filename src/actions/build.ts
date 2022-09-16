import path from 'path'

import { getConfigForTheme } from '../config'
import { getModules, MagentoModule } from '../magento/module'
import { getLanguages } from '../magento/language'
import { getThemes } from '../magento/theme'
import { PluginContext } from '../plugin'
import { logger } from '../env'

/**
 * Build the theme.
 * If a configuration file is found, it will be used.
 * TODO: Use a `-c` param to specify a configuration file.
 *
 * @param {string} themeName
 * @param {string} locale
 * @return {Promise<void>}
 */
export const build = async (themeName: string, locale = 'en_US') => {
  const themeConfig = await getConfigForTheme(themeName)

  const moduleList = getModules().filter((m) => m.enabled && m.src)
  const modules: string[] = moduleList.map((m: MagentoModule) => m.name)

  const languageList = getLanguages()
  const themeList = getThemes()

  // Execute all the tasks for each locale
  // The destination dir gets the locale appended to it
  const dest = path.join(themeConfig.dest, locale)
  for (const plugin of themeConfig.plugins) {
    try {
      // @ts-ignore
      await plugin({ ...themeConfig, dest, locale, modules, moduleList, languageList, themeList } as PluginContext)
    } catch (e) {
      logger.error(e)
    }
  }
}
