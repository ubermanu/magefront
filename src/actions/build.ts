import path from 'path'

import { getConfigForTheme } from '../config'
import { getModules, MagentoModule } from '../magento/magentoModule'
import { getLanguages } from '../magento/language'
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

  const moduleList = getModules()
  const modules = moduleList.filter((mod: MagentoModule) => mod.enabled && mod.src).map((mod) => mod.name)

  const languageList = getLanguages()

  // Execute all the tasks for each locale
  // The destination dir gets the locale appended to it
  const dest = path.join(themeConfig.dest, locale)
  for (const plugin of themeConfig.plugins) {
    try {
      await plugin({ ...themeConfig, dest, locale, modules, moduleList, languageList })
    } catch (e) {
      logger.error(e)
    }
  }
}
