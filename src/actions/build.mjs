import path from 'path'
import { getConfigForTheme } from '../config.mjs'
import { getModules } from '../main.mjs'
import { deploy } from './deploy.mjs'

/**
 * Build the theme.
 * If a configuration file is found, it will be used.
 * TODO: Use a `-c` param to specify a configuration file.
 *
 * @param themeName
 * @param locale
 * @return {Promise<void>}
 */
export const build = async (themeName, locale = 'en_US') => {
  const themeConfig = await getConfigForTheme(themeName)

  const modules = getModules()
    .filter((mod) => mod.enabled && mod.src)
    .map((mod) => mod.name)

  // Execute all the tasks for each locale
  // The destination dir gets the locale appended to it
  const dest = path.join(themeConfig.dest, locale)
  for (const plugin of themeConfig.plugins) {
    try {
      plugin({ ...themeConfig, dest, locale, modules })
    } catch (e) {
      // TODO: Add new transport to the logger
      console.error(e)
    }
  }

  await deploy(themeName, locale)
}
