import k from 'kleur'
import path from 'node:path'
import process from 'node:process'
import { loadConfigFile, resolveConfigFilename } from '../config/file.js'
import { createMagentoContext } from '../magento/context.js'
import { getThemes } from '../magento/theme.js'

/**
 * Generate the entries from the CLI options. Used in the `build` and `dev`
 * commands.
 *
 * @param {any} opts
 * @param {string} rootPath
 * @param {import('winston').Logger} logger
 * @returns {Promise<import('types').MagefrontOptions[]>}
 */
export async function generateEntries(opts, rootPath, logger) {
  const { theme, config, debug, _: locales } = opts
  const locale = locales[0] || 'en_US'

  if (debug) {
    logger.level = 'debug'
  }

  const magentoContext = createMagentoContext({ magento: { rootPath } })

  /** @type {import('types').MagefrontOptions[]} */
  let entries = []

  // Add all the existing entries to the array
  getThemes(magentoContext).forEach((theme) => {
    entries.push({
      theme: theme.name,
      locale: locale,
    })
  })

  // Load the configuration file
  if (config) {
    const filename = await resolveConfigFilename(config)
    logger.info(`Loading configuration file: ${k.bold(filename)}...`)

    // Add the entries from the configuration file
    entries = await loadConfigFile(path.join(rootPath, filename), entries)
  }

  // Filter the entries to only keep the ones that match the theme options
  if (Array.isArray(theme)) {
    entries = entries.filter((entry) => theme.includes(entry.theme))
  } else if (typeof theme === 'string') {
    entries = entries.filter((entry) => entry.theme === theme)
  }

  if (entries.length === 0) {
    logger.error(
      typeof theme === 'string'
        ? `Theme ${k.bold(theme)} not found.`
        : 'No theme found.'
    )
    process.exit(1)
  }

  const themes = entries.map((entry) => k.bold(entry.theme)).join(', ')
  logger.info(`Target ${themes} for locale ${k.bold(locale)}...`)

  return entries
}
