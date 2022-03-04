import path from 'path'
import glob from 'fast-glob'
import { getThemes } from './main.mjs'

// Default configuration plugins
import lessPlugin from 'magefront-plugin-less'
import webCopyPlugin, { gulpWeb as gulpWebPlugin } from 'magefront-plugin-web'
import requirejsPlugin from 'magefront-plugin-requirejs'
import gulpPlugin from 'magefront-plugin-gulp'

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
    locales: ['en_US'],
    plugins: [lessPlugin()],
    copyWebDir: true,
    concatRequireJs: true,
    src: path.join(tempPath, theme.dest),
    dest: theme.dest
  }

  const finalConfig = Object.assign({}, defaultConfig, customConfig)

  if (finalConfig.copyWebDir) {
    finalConfig.plugins.push(webCopyPlugin())
  }

  if (finalConfig.concatRequireJs) {
    finalConfig.plugins.push(requirejsPlugin())
  }

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
 * If passed an object, use the object as `gulpPlugin` options.
 *
 * @param {{web?: boolean, any}|{}} plugin
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

  // If the `web` property is set to true, handles this in the web context
  if (typeof plugin === 'object' && !Array.isArray(plugin)) {
    return plugin.web ? gulpWebPlugin(plugin) : gulpPlugin(plugin)
  }

  throw new Error(`Invalid plugin type: ${typeof plugin}`)
}
