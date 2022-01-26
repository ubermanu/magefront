import fs from 'fs'
import path from 'path'
import { getEnabledModuleNames } from '../magento.mjs'
import { getConfigForTheme } from '../config.mjs'
import logger from '../logger.mjs'

/**
 * Build the theme.
 * If a configuration file is found, it will be used.
 * TODO: Use a `-c` param to specify a configuration file.
 *
 * @param themeName
 * @param clean
 * @return {Promise<void>}
 */
export const build = async (themeName, clean = true) => {
  const themeConfig = await getConfigForTheme(themeName)
  const modules = getEnabledModuleNames()

  // Clean up the destination dir
  if (clean) {
    fs.rmSync(themeConfig.dest, { recursive: true }, (err) => {
      if (err) {
        console.error(err)
      }
    })
  }

  // Execute all the tasks for each locale
  // The destination dir gets the locale appended to it
  for (const locale of themeConfig.locales) {
    const dest = path.join(themeConfig.dest, locale)
    for (const plugin of themeConfig.plugins) {
      try {
        plugin({ ...themeConfig, dest, locale, modules })
      } catch (e) {
        // TODO: Add new transport to the logger
        console.error(e)
        logger.error(e)
      }
    }
  }
}
