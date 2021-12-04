import gulp from 'gulp'
import { getThemeBuildConfig } from '../theme.mjs'
import { getModules } from '../modules.mjs'

// TODO: get config from the theme
// TODO: Add support for multiple themes at once?
export const build = async (theme) => {
  const themeConfig = await getThemeBuildConfig(theme)
  const tasks = []
  const modules = Object.values(getModules())
    .filter((m) => m.enabled && m.src)
    .map((m) => m.name)

  // Execute all the tasks for each locales
  for (const locale of themeConfig.locales) {
    const localeDir = `${themeConfig.dest}/${locale}`
    for (const plugin of themeConfig.plugins) {
      tasks.push(() =>
        plugin({ ...themeConfig, dest: localeDir, locale, modules })
      )
    }
  }

  if (tasks.length > 0) {
    gulp.series(...tasks)()
  }
}
