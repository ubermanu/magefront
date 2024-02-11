import { resolve } from 'import-meta-resolve'
import memo from 'memoizee'
import path from 'node:path'
import { pluginSchema, presetSchema } from './config/schema.js'
import { getThemes } from './magento/theme.js'
import * as u from './utils.js'

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

  /** @type {import('types').MagefrontOptions['presets'] | unknown[]} */
  const all_presets = opts.presets || []

  /** @type {import('types').MagefrontOptions['plugins'] | unknown[]} */
  const all_plugins = []

  // Add the default preset if no preset or plugin is provided
  // The default preset contains the following plugins:
  // - magefront-plugin-less
  // - magefront-plugin-requirejs-config
  // - magefront-plugin-js-translation
  if (!opts.presets && !opts.plugins) {
    all_presets.push('magefront-preset-default')
  }

  // The import source (for the resolve function)
  // If no config file is loaded, use the current file as the parent
  const parent = opts.configFilename ?? import.meta.url

  // Add the preset plugins to the plugin list
  if (Array.isArray(all_presets) && all_presets.length > 0) {
    const presets = await Promise.all(
      all_presets.map((preset) => transformPresetDefinition(preset, parent))
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
    all_plugins.map((plugin) => transformPluginDefinition(plugin, parent))
  )

  return { tmp, dest, plugins }
})

/**
 * Transform the plugin to a function if it is not already. If passed a string,
 * import the plugin and return the default export.
 *
 * @param {unknown} definition
 * @param {string} [parent]
 * @returns {Promise<import('types').Plugin>}
 */
async function transformPluginDefinition(definition, parent) {
  const { error } = pluginSchema.validate(definition)

  if (error) {
    throw error
  }

  if (typeof definition === 'string') {
    const mod = await import(resolve(definition, parent))
    return mod.default?.()
  }

  if (u.isArray(definition)) {
    const [pluginName, options] = definition
    const mod = await import(resolve(pluginName, parent))
    return mod.default?.(options)
  }

  if (u.isObject(definition)) {
    return {
      name: definition.name,
      build: definition.build,
    }
  }

  throw new Error(`Invalid plugin type: ${typeof definition}`)
}

/**
 * Transform the preset to a function if it is not already. If passed a string,
 * import the preset and return the default export.
 *
 * @param {unknown} definition
 * @param {string} [parent]
 * @returns {Promise<import('types').Preset>}
 */
async function transformPresetDefinition(definition, parent) {
  const { error } = presetSchema.validate(definition)

  if (error) {
    throw error
  }

  if (typeof definition === 'string') {
    const mod = await import(resolve(definition, parent))
    return mod.default?.()
  }

  if (u.isArray(definition)) {
    const [presetName, options] = definition
    const mod = await import(resolve(presetName, parent))
    return mod.default?.(options)
  }

  if (u.isObject(definition)) {
    return {
      plugins: definition.plugins ?? [],
    }
  }

  throw new Error(`Invalid preset type: ${typeof definition}`)
}
