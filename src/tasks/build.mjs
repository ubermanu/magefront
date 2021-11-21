import gulp from 'gulp'
import { getThemeConfig } from '../theme.mjs'

// TODO: get config from the theme
// TODO: Add support for multiple themes at once?
export const build = async (theme) => {
  const themeConfig = await getThemeConfig(theme)
  const tasks = []

  for (const plugin of themeConfig.plugins) {
    tasks.push(() => plugin(themeConfig))
  }

  return gulp.series(...tasks)()
}
