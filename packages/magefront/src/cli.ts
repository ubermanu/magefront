import glob from 'fast-glob'
import k from 'kleur'
import path from 'node:path'
import process from 'node:process'
import sade from 'sade'
import winston from 'winston'
import { version } from '../package.json' assert { type: 'json' }
import { browserSync } from './actions/browser-sync'
import { createActionContext } from './actions/context'
import { list } from './actions/list'
import { watch } from './actions/watch'
import { createLogger } from './logger'
import { magefront } from './magefront'
import { createMagentoContext } from './magento/context'
import type { MagefrontConfig, MagefrontOptions } from './types'

const program = sade('magefront', true)

program
  .version(version)
  .option('-t, --theme <theme>', 'Theme identifier')
  .option('-c, --config <config>', 'Path to the configuration file')
  .option('-w, --watch', 'Watch the source files of a theme, and rebuild on change', false)
  .option('-d, --dev <url>', 'Run a browser-sync proxy instance')
  .option('--list', 'List all available themes')

program.example('-t Magento/blank')
program.example('-t Magento/blank -c -w')
program.example('-t Magento/blank -c --dev https://magento.ddev.site')

function transformCommandOptions(opts: any): MagefrontOptions {
  const { theme, _: locales } = opts

  // Use the default `en_US` locale if none is provided
  // TODO: Add support for multiple locales (when building)
  const locale = locales[0] || 'en_US'

  return {
    theme,
    locale,
  }
}

program.action(async (opts) => {
  let magefrontOptions = transformCommandOptions(opts)
  const magento = createMagentoContext(magefrontOptions)

  // Set up the logger instance to go through console
  const logger = createLogger()
  logger.add(new winston.transports.Console({ silent: false }))

  if (opts.list) {
    list(magento)
    return
  }

  const { theme, watch: watchMode, dev: devMode, config } = opts

  if (devMode && devMode.length === 0) {
    logger.error('The dev mode requires a URL to proxy.')
    return
  }

  if (config) {
    const filename = config.length > 0 ? config : 'magefront.config.{js,mjs,cjs}'
    const files = await glob(filename, { onlyFiles: true, cwd: magento.rootPath })

    if (files.length === 0) {
      logger.error(`Configuration file not found: ${filename}`)
      process.exit(1)
    }

    const configPath = path.join(magento.rootPath, files[0])
    logger.info(`Loading configuration file: ${k.bold(files[0])}...`)

    try {
      const mod: { default: MagefrontConfig | MagefrontConfig[] } = await import(configPath)

      if (Array.isArray(mod.default)) {
        const item = mod.default.find((opts) => opts.theme === theme)

        // TODO: Handle the case where the theme is not specified in the configuration file (as array)
        if (!item) {
          logger.error(`Theme '${theme}' not found in the configuration file: ${configPath}`)
          process.exit(1)
        }

        magefrontOptions = Object.assign(magefrontOptions, item)
      } else if (typeof mod.default === 'object') {
        magefrontOptions = Object.assign(magefrontOptions, mod.default)
      } else {
        // TODO: Add configuration validation
        logger.error(`Invalid configuration file: ${configPath}`)
        process.exit(1)
      }
    } catch (e) {
      logger.error(`Failed to load configuration file: ${configPath}`)
      logger.error(e)
      process.exit(1)
    }
  }

  // Use the theme name from the arguments if provided
  if (theme) {
    magefrontOptions.theme = theme
  }

  if (!magefrontOptions.theme) {
    logger.error('You must provide a theme name either as an argument or in the configuration file.')
    return
  }

  try {
    await magefront(magefrontOptions, logger)
  } catch (error) {
    logger.error(error)
    process.exit(1)
  }

  if (devMode) {
    logger.info('Starting browser-sync proxy...')
    await browserSync(devMode)
  }

  if (devMode || watchMode) {
    const context = await createActionContext(magefrontOptions, logger)
    await watch(context)
  }
})

program.parse(process.argv)
