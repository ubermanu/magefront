import path from 'path'

import { getThemeConfig } from '../config'
import { getModules } from '../magento/module'
import type { MagentoModule } from '../magento/module'
import { getLanguages } from '../magento/language'
import { getThemeDependencyTree, getThemes } from '../magento/theme'
import type { PluginContext } from '../plugin'
import { logger, rootPath } from '../env'

/**
 * Build the theme.
 * If a configuration file is found, it will be used.
 *
 * @param {string} themeName
 * @param {string} locale
 * @return {Promise<void>}
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
      // @ts-ignore
      await plugin({
        ...themeConfig,
        dest,
        locale,
        modules,
        moduleList,
        languageList,
        themeList,
        themeDependencyTree: getThemeDependencyTree(themeName),
        cwd: rootPath
      } as PluginContext)
    } catch (e) {
      logger.error(e)
    }
  }
}
