import winston from 'winston'
import { getBuildConfig } from '../config'
import { createMagentoContext } from '../magento/context'
import { getLanguages } from '../magento/language'
import { getModules } from '../magento/module'
import { getThemes } from '../magento/theme'
import { ActionContext, MagefrontOptions } from '../types'

// Creates an ActionContext object to be passed to the build process.
export const createActionContext = async (opts: MagefrontOptions): Promise<ActionContext> => {
  const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    transports: [new winston.transports.Console({ silent: true })],
  })

  // TODO: Get theme config for the given theme

  const magentoContext = createMagentoContext(opts)
  const themes = getThemes(magentoContext)
  const modules = getModules(magentoContext)
  const languages = getLanguages(magentoContext)

  const theme = themes.find((t) => t.name === opts.theme)

  if (!theme) {
    // TODO: Should be critical error thrown to the logger
    throw new Error(`Theme "${opts.theme}" not found.`)
  }

  const themeConfig = await getBuildConfig(opts, magentoContext)

  return {
    theme,
    locale: opts?.locale || 'en_US',
    logger,
    buildConfig: themeConfig,
    magento: {
      rootPath: magentoContext.rootPath,
      tempPath: magentoContext.tempPath,
      modules,
      languages,
      themes,
    },
  }
}
