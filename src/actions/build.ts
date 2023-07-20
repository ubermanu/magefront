import path from 'node:path'

import { getThemeConfig } from '../config'
import { logger, rootPath } from '../env'
import { getLanguages } from '../magento/language'
import type { MagentoModule } from '../magento/module'
import { getModules } from '../magento/module'
import { getThemeDependencyTree, getThemes } from '../magento/theme'

/**
 * Build the theme. If a configuration file is found, it will be used.
 *
 * @param {string} themeName
 * @param {string} locale
 * @returns {Promise<void>}
 */
export const build = async (themeName: string, locale = 'en_US') => {
  const themeConfig = await getThemeConfig(themeName)

  const moduleList = getModules().filter((m) => m.enabled && m.src)
  const modules: string[] = moduleList.map((m: MagentoModule) => m.name)

  const languageList = getLanguages()
  const themeList = getThemes()

  // Execute all the tasks for each locale
  // The destination dir gets the locale appended to it
  const dest = path.join(themeConfig.dest, locale)
  for (const plugin of themeConfig.plugins) {
    try {
      await plugin({
        theme: themeConfig.theme,
        src: themeConfig.src,
        dest,
        locale,
        modules,
        moduleList,
        languageList,
        themeList,
        themeDependencyTree: getThemeDependencyTree(themeName),
        cwd: rootPath,
        logger,
      })
    } catch (e) {
      logger.crit(e)
    }
  }
}
