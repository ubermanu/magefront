import memo from 'memoizee'
import path from 'node:path'
import type { BuildConfig, MagefrontOptions, MagentoContext, MagentoTheme } from '../types/magefront'
import { transformPluginDefinition, transformPresetDefinition } from './config/resolver'
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
