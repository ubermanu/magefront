import path from 'path'
import glob from 'fast-glob'

import { getThemes, MagentoTheme } from './magento/theme'
import { Plugin } from './plugin'
import { rootPath, tempPath } from './env'

/**
 * The configuration filename.
 * @type {string}
 */
export let configFilename = 'magefront.config.{js,mjs,cjs}'

/**
 * If set to true, the configuration file will be loaded.
 * TODO: Implement the `-c` option in the CLI.
 */
export let useConfigFile = true

/**
 * The configuration object.
 */
export interface ThemeConfig {
  theme: string
  dest: string
  src: string
  plugins: Plugin[] | string[]
}

/**
 * Get the `ThemeConfig` list from the configuration file.
 *
 * @return {Promise<ThemeConfig[]>}
 */
export const getConfigFromFile = async () => {
  const files = await glob(configFilename, { cwd: rootPath })
  let fileConfig = []

  if (files.length > 0) {
    let { default: config } = await import(path.join(rootPath, files[0]))
    fileConfig = config
  }

  // Add support for array into the config file
  if (!Array.isArray(fileConfig)) {
    fileConfig = [fileConfig]
  }

  return fileConfig
}

/**
 * Get the configuration for the given theme name.
 * The theme config is passed to the plugins.
 *
 * @param {string} themeName
 * @return {Promise<ThemeConfig>}
 */
export const getThemeConfig = async (themeName: string) => {
  const theme: MagentoTheme | undefined = getThemes().find((t: MagentoTheme) => t.name === themeName)

  if (!theme) {
    throw new Error(`Theme '${themeName}' not found.`)
  }

  let themeConfig: ThemeConfig = {
    theme: themeName,
    plugins: ['magefront-plugin-less', 'magefront-plugin-requirejs-config', 'magefront-plugin-js-translation'],
    src: path.join(rootPath, tempPath, theme.dest),
    dest: path.join(rootPath, theme.dest)
  }

  // Override the themeConfig with the one from the
  // configuration file, if the flag is set
  if (useConfigFile) {
    const fileConfig = await getConfigFromFile()
    const itemConfig = fileConfig.find((config) => !config.theme || config.theme === themeName)
    if (itemConfig) {
      themeConfig = Object.assign({}, themeConfig, itemConfig)
    }
  }

  // Add support for multiple plugin formats
  // It can be 'string', 'object' or 'function'
  themeConfig.plugins = await Promise.all(themeConfig.plugins.map(transformPluginDefinition))

  return themeConfig
}

/**
 * Transform the plugin to a function if it is not already.
 * If passed a string, import the plugin and return the default export.
 *
 * @param {any} definition
 * @return {Promise<Plugin>}
 */
async function transformPluginDefinition(definition: any): Promise<Plugin> {
  if (typeof definition === 'function') {
    return definition
  }

  if (typeof definition === 'string') {
    const { default: pluginModule } = await import(resolveModuleNameFromPluginStr(definition))
    return pluginModule()
  }

  if (Array.isArray(definition)) {
    const [pluginName, options] = definition
    const { default: pluginModule } = await import(resolveModuleNameFromPluginStr(pluginName))
    return pluginModule(options)
  }

  throw new Error(`Invalid plugin type: ${typeof definition}`)
}

/**
 * Return the full module name from the given plugin string.
 *
 * @param {string} str
 * @return {string}
 */
function resolveModuleNameFromPluginStr(str: string): string {
  if (str.startsWith('magefront-plugin-')) {
    return str
  }
  return `magefront-plugin-${str}`
}
