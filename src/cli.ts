import sade from 'sade'
import winston from 'winston'
import { version } from '../package.json' assert { type: 'json' }
import { browserSync } from './actions/browser-sync'
import { createActionContext } from './actions/context'
import { list } from './actions/list'
import { watch } from './actions/watch'
import { magefront } from './magefront'
import { MagefrontOptions } from './types'
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

// const CONFIG_FILENAME: string = 'magefront.config.{js,mjs,cjs}'

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
  const magefrontOptions = transformCommandOptions(opts)
  const context = await createActionContext(magefrontOptions)
  const { logger } = context

  // Set up the logger instance to go through console
  logger.add(new winston.transports.Console({ silent: false }))

  if (opts.list) {
    list(context)
    return
  }

  const { theme, watch: watchMode, dev: devMode, config } = opts

  if (!theme) {
    logger.error('You must provide a theme name.')
    return
  }

  if (devMode && devMode.length === 0) {
    logger.error('The dev mode requires a URL to proxy.')
    return
  }

  if (config) {
    // TODO: Load the config file
  }

  try {
    await magefront(magefrontOptions)
  } catch (error) {
    logger.error(error)
    process.exit(1)
  }

  if (devMode) {
    logger.info('Starting browser-sync proxy...')
    await browserSync(devMode)
  }

  if (devMode || watchMode) {
    await watch(context)
  }
})

program.parse(process.argv)
