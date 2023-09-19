import { getBuildConfig } from '../config.js'
import { createLogger } from '../logger.js'
import { createMagentoContext } from '../magento/context.js'
import { getLanguages } from '../magento/language.js'
import { getModules } from '../magento/module.js'
import { getThemes } from '../magento/theme.js'

/**
 * Creates an ActionContext object to be passed to the build process.
 *
 * @param {import('types').MagefrontOptions} opts
 * @param {import('winston').Logger} [logger]
 * @returns {Promise<import('types').ActionContext>}
 */
export async function createActionContext(opts, logger) {
  const magentoContext = createMagentoContext(opts)
  const themes = getThemes(magentoContext)
  const modules = getModules(magentoContext)
  const languages = getLanguages(magentoContext)

  // Assign a default logger if none is provided
  logger ??= createLogger()

  const theme = themes.find((t) => t.name === opts.theme)

  if (!theme) {
    // TODO: Should be critical error thrown to the logger
    throw new Error(`Theme "${opts.theme}" not found.`)
  }

  // Normalize the build config (merge the presets and plugins)
  const buildConfig = await getBuildConfig(opts, magentoContext)

  return {
    theme,
    locale: opts?.locale || 'en_US',
    logger,
    buildConfig,
    magento: {
      rootPath: magentoContext.rootPath,
      tempPath: magentoContext.tempPath,
      modules,
      languages,
      themes,
    },
  }
}
