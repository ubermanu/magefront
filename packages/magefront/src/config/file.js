import glob from 'fast-glob'
import path from 'node:path'
import * as u from '../utils.js'
import { validateConfig } from './schema.js'

/**
 * Resolve the configuration filename and return the path to the file. Takes the
 * config option from the CLI and the root path of the project.
 *
 * Throws an error if the file is not found.
 *
 * @param {string | boolean} str
 * @param {string} [rootPath]
 * @returns {Promise<string>}
 * @throws {string}
 */
export async function resolveConfigFilename(str, rootPath) {
  const filename =
    typeof str === 'string' && str.length > 0
      ? str
      : 'magefront.config.{js,mjs,cjs}'

  const files = await glob(filename, {
    onlyFiles: true,
    cwd: rootPath,
  })

  if (files.length === 0) {
    throw `Configuration file not found: ${filename}`
  }

  return path.join(rootPath ?? '', files[0])
}

/**
 * Load the configuration file and update the CLI entries with the new user
 * configuration.
 *
 * @param {string} filename
 * @param {import('types').MagefrontOptions[]} entries
 * @returns {Promise<import('types').MagefrontOptions[]>}
 * @throws {string | import('joi').ValidationError}
 */
export async function loadConfigFile(filename, entries) {
  const mod = await import(filename)
  const config = mod.default

  validateConfig(config)

  if (Array.isArray(config)) {
    entries = entries.map((entry) => {
      const additionalEntry = config.find(
        (/** @type {import('types').MagefrontOptions} */ o) =>
          o.theme === entry.theme
      )
      return additionalEntry ? { ...additionalEntry, ...entry } : entry
    })
  }

  if (u.isObject(config)) {
    const additionalEntry = config

    // If the theme is specified in the config file, apply the config to the matching theme
    if (additionalEntry.theme) {
      entries = entries.map((entry) => {
        return entry.theme === additionalEntry.theme
          ? { ...config, ...entry }
          : entry
      })
    } else {
      // Otherwise, apply the config to all the themes
      entries = entries.map((entry) => {
        return { ...config, ...entry }
      })
    }
  }

  // Add config filename to the entries
  entries.forEach((entry) => {
    entry.configFilename = 'file://' + filename
  })

  return entries
}
