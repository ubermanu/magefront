import path from 'path'

import { getConfigForTheme } from '../config.mjs'
import { getModules } from '../magento/module.mjs'
import { getLanguages } from '../magento/language.mjs'
import { logger } from '../env.mjs'

/**
 * Build the theme.
 * If a configuration file is found, it will be used.
 * TODO: Use a `-c` param to specify a configuration file.
 *
 * @param {string} themeName
 * @param {string} locale
 * @return {Promise<void>}
 */
export const build = async (themeName, locale = 'en_US') => {
  const themeConfig = await getConfigForTheme(themeName)

  const moduleList = getModules()
  const modules = moduleList.filter((mod) => mod.enabled && mod.src).map((mod) => mod.name)

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
