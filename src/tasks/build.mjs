import gulp from 'gulp'
import fs from 'fs'
import less from '../../plugins/less/plugin.mjs'
import { getModules, getThemes } from '../magento.mjs'

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

// TODO: return default config if not defined
// TODO: get the correct root path
export const getThemeBuildConfig = async (name) => {
  const theme = getThemes()[name]
  let customConfig = {}

  const customConfigFile = `${process.cwd()}/${theme.src}/magefront.config.js`
  if (fs.existsSync(customConfigFile)) {
    const { default: defaults } = await import(customConfigFile)
    customConfig = defaults
  }

  const defaultConfig = {
    locales: ['en_US'],
    plugins: [less()]
  }

  const config = Object.assign({}, defaultConfig, customConfig)
  config.src = `var/view_preprocessed/magefront/${theme.dest}`
  config.dest = `pub/static/frontend/${name.replace('_', '/')}`

  return config
}
