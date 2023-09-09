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
import type { MagefrontOptions } from './types'
import * as u from './utils'

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
  let cli_options = transformCommandOptions(opts)
  const magento = createMagentoContext(cli_options)

  // Set up the logger instance to go through console
  const logger = createLogger()
  logger.add(new winston.transports.Console({ silent: false }))

  if (opts.list) {
    list(magento)
    return
  }

  const { theme, watch: watch_mode, dev: dev_mode, config } = opts

  if (!theme) {
    logger.error('You must provide a theme name.')
    return
  }

  if (dev_mode && dev_mode.length === 0) {
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

    const config_path = path.join(magento.rootPath, files[0])
    logger.info(`Loading configuration file: ${k.bold(files[0])}...`)

    try {
      const mod: { default: MagefrontOptions | MagefrontOptions[] } = await import(config_path)

      if (u.isArray(mod.default)) {
        const item = mod.default.find((opts) => opts.theme === theme)

        if (!item) {
          logger.error(`Theme '${theme}' not found in the configuration file: ${config_path}`)
          process.exit(1)
        }

        cli_options = u.assign(cli_options, item)
      } else if (u.isObject(mod.default)) {
        if (theme !== mod.default.theme) {
          logger.error(`Theme '${theme}' not found in the configuration file: ${config_path}`)
          process.exit(1)
        }

        cli_options = u.assign(cli_options, mod.default)
      } else {
        // TODO: Add configuration validation
        logger.error(`Invalid configuration file: ${config_path}`)
        process.exit(1)
      }
    } catch (e) {
      logger.error(`Failed to load configuration file: ${config_path}`)
      logger.error(e)
      process.exit(1)
    }
  }

  try {
    await magefront(cli_options, logger)
  } catch (error) {
    logger.error(error)
    process.exit(1)
  }

  if (dev_mode) {
    logger.info('Starting browser-sync proxy...')
    await browserSync(dev_mode)
  }

  if (dev_mode || watch_mode) {
    const context = await createActionContext(cli_options, logger)
    await watch(context)
  }
})

program.parse(process.argv)
