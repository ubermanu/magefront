import type { Logger } from 'winston'
import { getBuildConfig } from '../config'
import { createLogger } from '../logger'
import { createMagentoContext } from '../magento/context'
import { getLanguages } from '../magento/language'
import { getModules } from '../magento/module'
import { getThemes } from '../magento/theme'
import { ActionContext, MagefrontOptions } from '../types'

// Creates an ActionContext object to be passed to the build process.
export const createActionContext = async (opts: MagefrontOptions, logger?: Logger): Promise<ActionContext> => {
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
