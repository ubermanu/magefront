import memo from 'memoizee'
import path from 'node:path'
import type { BuildConfig, MagefrontOptions, MagentoContext, MagentoTheme, Plugin, Preset } from '../types/magefront'
import { getThemes } from './magento/theme'

/** Get the build configuration for the given options. */
export const getBuildConfig = memo(async (opts: MagefrontOptions, context: MagentoContext): Promise<BuildConfig> => {
  const { rootPath, tempPath } = context

  const themes = getThemes(context)
  const theme = themes.find((t: MagentoTheme) => t.name === opts.theme)

  if (!theme) {
    throw new Error(`Theme '${opts.theme}' not found.`)
  }

  // The path to the temporary directory where the theme will be built
  const tmp = path.join(rootPath, tempPath, theme.dest)

  // The path to the destination directory where the theme will be deployed (pub/static)
  const dest = path.join(rootPath, theme.dest)

  const all_presets: MagefrontOptions['presets'] = opts.presets || []
  const all_plugins: MagefrontOptions['plugins'] = []

  // Add the default preset if no preset or plugin is provided
  // The default preset contains the following plugins:
  // - magefront-plugin-less
  // - magefront-plugin-requirejs-config
  // - magefront-plugin-js-translation
  if (!opts.presets && !opts.plugins) {
    all_presets.push('magefront-preset-default')
  }

  // Add the preset plugins to the plugin list
  if (Array.isArray(all_presets) && all_presets.length > 0) {
    const presets = await Promise.all(all_presets.map(transformPresetDefinition))
    presets.forEach((preset) => {
      if (Array.isArray(preset.plugins)) {
        preset.plugins.forEach((plugin) => all_plugins.push(plugin))
      }
    })
  }

  // Add the user plugins to the plugin list
  if (Array.isArray(opts.plugins) && opts.plugins.length > 0) {
    opts.plugins.forEach((plugin) => all_plugins.push(plugin))
  }

  // Add support for multiple plugin formats
  // It can be 'string', 'object' or 'function'
  const plugins = await Promise.all(all_plugins.map(transformPluginDefinition))

  return { tmp, dest, plugins }
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
