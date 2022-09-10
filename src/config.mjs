import path from 'path'
import glob from 'fast-glob'
import { getThemes } from './main.mjs'

// This tool is meant to be run at root level of the project
export const projectPath = process.cwd()
export const tempPath = path.join(projectPath, 'var/view_preprocessed/magefront')

/**
 * Get the configuration for the given theme name.
 * The theme config is passed to the plugins.
 *
 * @param themeName
 * @return {Promise<{locales, plugins, src, dest}>}
 */
export const getConfigForTheme = async (themeName) => {
  const theme = getThemes().find((t) => t.name === themeName)

  // TODO: Add as an option '-c' to specify the config file
  const files = glob.sync('magefront.config.{js,mjs,cjs}', { cwd: projectPath })
  let customConfig = {}

  if (files.length) {
    let { default: config } = await import(path.join(projectPath, files[0]))

    // Add support for array into the config file
    if (!Array.isArray(config)) {
      config = [config]
    }

    // Look for the theme name in the array of objects
    customConfig = config.filter((entry) => entry.theme === themeName).shift() || {}
  }

  const defaultConfig = {
    theme: themeName,
    plugins: ['magefront-plugin-less', 'magefront-plugin-requirejs-config', 'magefront-plugin-js-translation'],
    src: path.join(tempPath, theme.dest),
    dest: theme.dest
  }

  const finalConfig = Object.assign({}, defaultConfig, customConfig)

  // Add support for multiple plugin formats
  // It can be 'string', 'object' or 'function'
  await Promise.all(finalConfig.plugins.map(transformPlugin)).then((plugins) => {
    finalConfig.plugins = plugins
  })

  return finalConfig
}

/**
 * Transform the plugin to a function if it is not already.
 * If passed a string, import the plugin and return the default export.
 *
 * @param {*} plugin
 * @return {function}
 */
const transformPlugin = async (plugin) => {
  if (typeof plugin === 'function') {
    return plugin
  }

  if (typeof plugin === 'string') {
    const { default: pluginModule } = await import(plugin)
    return pluginModule()
  }

  if (Array.isArray(plugin)) {
    const [pluginName, options] = plugin
    const { default: pluginModule } = await import(pluginName)
    return pluginModule(options)
  }

  throw new Error(`Invalid plugin type: ${typeof plugin}`)
}
