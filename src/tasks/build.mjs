import path from 'path'
import gulp from 'gulp'
import { getEnabledModuleNames } from '../magento.mjs'
import { getConfigForTheme } from '../config.mjs'

/**
 * Build the theme.
 * If a configuration file is found, it will be used.
 * TODO: Use a `-c` param to specify a configuration file.
 *
 * @param themeName
 * @return {Promise<void>}
 */
export const build = async (themeName) => {
  const themeConfig = await getConfigForTheme(themeName)
  const tasks = []
  const modules = getEnabledModuleNames()

  // Execute all the tasks for each locales
  // The destination dir gets the locale appended to it
  for (const locale of themeConfig.locales) {
    for (const plugin of themeConfig.plugins) {
      tasks.push(() =>
        plugin({
          ...themeConfig,
          dest: path.join(themeConfig.dest, locale),
          locale,
          modules
        })
      )
    }
  }

  if (tasks.length > 0) {
    gulp.series(...tasks)()
  }
}
