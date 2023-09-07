import glob from 'fast-glob'
import memo from 'memoizee'
import path from 'node:path'

import { rootPath, tempPath } from './env'
import { getThemes } from './magento/theme'
import type { MagentoTheme, Plugin, Preset } from './types'

/** The configuration filename. */
export let configFilename: string = 'magefront.config.{js,mjs,cjs}'

export const setConfigFilename = (newFilename: string): void => {
  configFilename = newFilename
}

/** If set to true, the configuration file will be loaded. */
export let useConfigFile: boolean = false

export const setUseConfigFile = (value: boolean): void => {
  useConfigFile = value
}

export type UserConfig = {
  theme?: string
  presets?: Array<Preset | string | [string, any]>
  plugins?: Array<Plugin | string | [string, any]>
}

/** The user configuration object, before it's parsed. Preset and plugins are transformed to functions. */
export type UserConfigFile = UserConfig | UserConfig[]

/** The configuration object that is passed as build context. The preset plugins are resolved and merged into the plugins array. */
export type ThemeConfig = {
  theme: string
  src: string
  dest: string
  plugins: Plugin[]
}

/** Get the `UserConfig` list from the configuration file. */
export const getConfigFromFile = async (): Promise<UserConfig[]> => {
  const files = await glob(configFilename, { cwd: rootPath })
  let fileConfig: UserConfigFile = []

  if (!files.length) {
    throw new Error(`No configuration file found. Searched for: ${configFilename}`)
  }

  if (files.length > 0) {
    let { default: config } = await import(path.join(rootPath, files[0]))
    fileConfig = config as UserConfigFile
    // TODO: Validate the config object
  }

  // Add support for array into the config file
  if (!Array.isArray(fileConfig)) {
    fileConfig = [fileConfig]
  }

  return fileConfig
}

/** Get the configuration for the given theme name. The theme config is passed to the plugins. Prepend `presets` plugins to the root plugins. */
export const getThemeConfig = memo(async (themeName: string): Promise<ThemeConfig> => {
  const theme: MagentoTheme | undefined = getThemes().find((t: MagentoTheme) => t.name === themeName)

  if (!theme) {
    throw new Error(`Theme '${themeName}' not found.`)
  }

  const src = path.join(rootPath, tempPath, theme.dest)
  const dest = path.join(rootPath, theme.dest)

  let userConfig: UserConfig | null = null

  // Override the themeConfig with the one from the config file
  if (useConfigFile) {
    const fileConfig = await getConfigFromFile()
    const itemConfig = fileConfig.find((config) => !config.theme || config.theme === themeName)
    if (itemConfig) {
      userConfig = itemConfig
    }
  }

  // Set the default config if not defined yet
  if (!userConfig) {
    userConfig = {
      presets: ['magefront-preset-default'],
    }
  }

  const pluginList: Array<Plugin | string | [string, any]> = []

  // Add the preset plugins to the plugin list
  if (userConfig.presets) {
    const presets = await Promise.all(userConfig.presets.map(transformPresetDefinition))
    presets.forEach((preset) => {
      if (Array.isArray(preset.plugins)) {
        preset.plugins.forEach((plugin) => pluginList.push(plugin))
      }
    })
  }

  // Add the user plugins to the plugin list
  if (userConfig.plugins) {
    userConfig.plugins.forEach((plugin) => pluginList.push(plugin))
  }

  // Add support for multiple plugin formats
  // It can be 'string', 'object' or 'function'
  const plugins = await Promise.all(pluginList.map(transformPluginDefinition))

  // TODO: Clean up the config object
  return { theme: themeName, src, dest, plugins } as ThemeConfig
})

/** Transform the plugin to a function if it is not already. If passed a string, import the plugin and return the default export. */
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

/** Return the full module name from the given plugin string. */
function resolveModuleNameFromPluginStr(str: string): string {
  if (str.startsWith('magefront-plugin-')) {
    return str
  }
  return `magefront-plugin-${str}`
}

/** Transform the preset to a function if it is not already. If passed a string, import the preset and return the default export. */
async function transformPresetDefinition(definition: any): Promise<Preset> {
  if (typeof definition === 'string') {
    const { default: presetModule } = await import(resolveModuleNameFromPresetStr(definition))
    return presetModule()
  }

  if (Array.isArray(definition)) {
    const [presetName, options] = definition
    const { default: presetModule } = await import(resolveModuleNameFromPresetStr(presetName))
    return presetModule(options)
  }

  if (typeof definition === 'object') {
    return definition
  }

  throw new Error(`Invalid plugin type: ${typeof definition}`)
}

/** Return the full module name from the given preset string. */
function resolveModuleNameFromPresetStr(str: string): string {
  if (str.startsWith('magefront-preset-')) {
    return str
  }
  return `magefront-preset-${str}`
}
