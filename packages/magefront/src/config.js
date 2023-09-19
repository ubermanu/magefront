import Joi from 'joi'
import memo from 'memoizee'
import path from 'node:path'
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

const pluginSchema = Joi.alternatives().try(
  Joi.string(),
  Joi.object({
    name: Joi.string().required(),
    build: Joi.func().required(),
  }),
  Joi.array().items(Joi.string(), Joi.any())
)

/**
 * Transform the plugin to a function if it is not already. If passed a string,
 * import the plugin and return the default export.
 *
 * @param {any} definition
 * @returns {Promise<import('types').Plugin>}
 */
async function transformPluginDefinition(definition) {
  const { error } = pluginSchema.validate(definition)

  if (error) {
    throw error
  }

  if (typeof definition === 'string') {
    const mod = await import(definition)
    return mod.default?.()
  }

  if (u.isArray(definition)) {
    const [pluginName, options] = definition
    const mod = await import(pluginName)
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

const presetSchema = Joi.alternatives().try(
  Joi.string(),
  Joi.object({
    plugins: Joi.array().items(pluginSchema).required(),
  }),
  Joi.array().items(Joi.string(), Joi.any())
)

/**
 * Transform the preset to a function if it is not already. If passed a string,
 * import the preset and return the default export.
 *
 * @param {unknown} definition
 * @returns {Promise<import('types').Preset>}
 */
async function transformPresetDefinition(definition) {
  const { error } = presetSchema.validate(definition)

  if (error) {
    throw error
  }

  if (typeof definition === 'string') {
    const mod = await import(definition)
    return mod.default?.()
  }

  if (u.isArray(definition)) {
    const [presetName, options] = definition
    const mod = await import(presetName)
    return mod.default?.(options)
  }

  if (u.isObject(definition)) {
    return {
      plugins: definition.plugins ?? [],
    }
  }

  throw new Error(`Invalid preset type: ${typeof definition}`)
}
