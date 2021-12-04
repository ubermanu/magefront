import gulp from 'gulp'
import { getThemeBuildConfig } from '../theme.mjs'

// TODO: get config from the theme
// TODO: Add support for multiple themes at once?
export const build = async (theme) => {
  const themeConfig = await getThemeBuildConfig(theme)
  const tasks = []

  for (const plugin of themeConfig.plugins) {
    tasks.push(() => plugin(themeConfig))
  }

  if (tasks.length > 0) {
    return gulp.series(...tasks)
  }
}
