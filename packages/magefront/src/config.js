import memo from 'memoizee'
import path from 'node:path'
import { getThemes } from './magento/theme.js'

/**
 * Get the build configuration for the given options.
 *
 * @type {(
 *   opts: import('types').MagefrontOptions,
 *   context: import('types').MagentoContext
 * ) => Promise<import('types').BuildConfig>}
 */
export const getBuildConfig = memo(async (opts, context) => {
  const { rootPath, tempPath } = context

  const themes = getThemes(context)
  const theme = themes.find((t) => t.name === opts.theme)

  if (!theme) {
    throw new Error(`Theme '${opts.theme}' not found.`)
  }

  // The path to the temporary directory where the theme will be built
  const tmp = path.join(rootPath, tempPath, theme.dest)

  // The path to the destination directory where the theme will be deployed (pub/static)
  const dest = path.join(rootPath, theme.dest)

  /** @type {import('types').MagefrontOptions['presets']} */
  const all_presets = opts.presets || []

  /** @type {import('types').MagefrontOptions['plugins']} */
  const all_plugins = []

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
    const presets = await Promise.all(
      /** @type {import('types').Preset[]} */ all_presets.map(
        transformPresetDefinition
      )
    )
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
  const plugins = await Promise.all(
    /** @type {import('types').Plugin[]} */ all_plugins.map(
      transformPluginDefinition
    )
  )

  return { tmp, dest, plugins }
})

/**
 * Transform the plugin to a function if it is not already. If passed a string,
 * import the plugin and return the default export.
 *
 * @param {unknown} definition
 * @returns {Promise<import('types').Plugin>}
 */
async function transformPluginDefinition(definition) {
  // TODO: Validate the plugin definition
  if (typeof definition === 'object' && definition !== null) {
    return definition
  }

  if (typeof definition === 'string') {
    const { default: pluginModule } = await import(
      resolveModuleNameFromPluginStr(definition)
    )
    return pluginModule()
  }

  if (Array.isArray(definition)) {
    const [pluginName, options] = definition
    const { default: pluginModule } = await import(
      resolveModuleNameFromPluginStr(pluginName)
    )
    return pluginModule(options)
  }

  throw new Error(`Invalid plugin type: ${typeof definition}`)
}

/**
 * Return the full module name from the given plugin string.
 *
 * @param {string} str
 * @returns {string}
 */
function resolveModuleNameFromPluginStr(str) {
  if (str.startsWith('magefront-plugin-')) {
    return str
  }
  return `magefront-plugin-${str}`
}

/**
 * Transform the preset to a function if it is not already. If passed a string,
 * import the preset and return the default export.
 *
 * @param {unknown} definition
 * @returns {Promise<import('types').Preset>}
 */
async function transformPresetDefinition(definition) {
  if (typeof definition === 'string') {
    const { default: presetModule } = await import(
      resolveModuleNameFromPresetStr(definition)
    )
    return presetModule()
  }

  if (Array.isArray(definition)) {
    const [presetName, options] = definition
    const { default: presetModule } = await import(
      resolveModuleNameFromPresetStr(presetName)
    )
    return presetModule(options)
  }

  if (typeof definition === 'object' && definition !== null) {
    return definition
  }

  throw new Error(`Invalid plugin type: ${typeof definition}`)
}

/**
 * Return the full module name from the given preset string.
 *
 * @param {string} str
 * @returns {string}
 */
function resolveModuleNameFromPresetStr(str) {
  if (str.startsWith('magefront-preset-')) {
    return str
  }
  return `magefront-preset-${str}`
}
