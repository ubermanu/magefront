import * as u from '../utils.js'
import { validateConfig } from './schema.js'

/**
 * Load the configuration file and return the options for the given theme.
 *
 * @param {string} filename
 * @param {string} theme
 * @returns {Promise<import('types').MagefrontOptions>}
 * @throws {string | import('joi').ValidationError}
 */
export async function loadConfigFile(filename, theme) {
  const mod = await import(filename)
  return resolveConfig(mod.default, theme)
}

/**
 * Get the MagefrontOptions for the given theme, in the given configuration.
 * Validate the configuration and throw an error if it's invalid.
 *
 * @param {any} config
 * @param {string} theme
 * @returns {Promise<import('types').MagefrontOptions>}
 * @throws {string | import('joi').ValidationError}
 */
export async function resolveConfig(config, theme) {
  validateConfig(config)

  if (u.isArray(config)) {
    /** @type {import('types').MagefrontOptions | undefined} */
    const item = config.find((opts) => opts.theme === theme)

    if (!item) {
      throw `Theme '${theme}' not found in the configuration`
    }

    return item
  }

  if (u.isObject(config)) {
    if (!config.theme || config.theme === theme) {
      return /** @type {import('types').MagefrontOptions} */ {
        ...config,
        theme,
      }
    }

    throw `The configuration is for the theme '${config.theme}' and not '${theme}'`
  }

  throw `The configuration is invalid`
}
