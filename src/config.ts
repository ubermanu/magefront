import path from 'path'
import glob from 'fast-glob'

import { getThemes, MagentoTheme } from './magento/theme'
import { Plugin } from './plugin'
import { rootPath, tempPath } from './env'

/**
 * The configuration filename.
 * TODO: Add as an option '-c' to specify the config file
 *
 * @type {string}
 */
export let configFilename = 'magefront.config.{js,mjs,cjs}'

/**
 * The configuration object.
 */
export interface ThemeConfig {
  theme: string
  dest: string
  src: string
  plugins: Plugin[]
}

/**
 * Get the configuration for the given theme name.
 * The theme config is passed to the plugins.
 * TODO: Rename to getThemeConfig
 *
 * @param {string} themeName
 * @return {Promise<ThemeConfig>}
 */
export const getConfigForTheme = async (themeName: string) => {
  const theme: MagentoTheme | undefined = getThemes().find((t: MagentoTheme) => t.name === themeName)

  if (!theme) {
    throw new Error(`Theme '${themeName}' not found.`)
  }

  const files = await glob(configFilename, { cwd: rootPath })
  let customConfig = {}

  if (files.length) {
    let { default: config } = await import(path.join(rootPath, files[0]))

    // Add support for array into the config file
    if (!Array.isArray(config)) {
      config = [config]
    }

    // Look for the theme name in the array of objects
    customConfig = config.filter((entry: ThemeConfig) => entry.theme === themeName).shift() || {}
  }

  const themeDest = path.join('pub/static', theme.area + '/' + theme.name)

  const defaultConfig = {
    theme: themeName,
    plugins: ['magefront-plugin-less', 'magefront-plugin-requirejs-config', 'magefront-plugin-js-translation'],
    src: path.join(rootPath, tempPath, themeDest),
    dest: path.join(rootPath, themeDest)
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
 * @param {any} plugin
 * @return {function}
 */
const transformPlugin = async (plugin: any) => {
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
