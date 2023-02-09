import path from 'path'
import sade from 'sade'
import winston from 'winston'
import k from 'kleur'
import { performance } from 'perf_hooks'
import prettyMilliseconds from 'pretty-ms'

import { version } from '../package.json' assert { type: 'json' }
import { logger } from './env'
import { setConfigFilename, setUseConfigFile } from './config'
import { build } from './actions/build'
import { inheritance } from './actions/inheritance'
import { deploy } from './actions/deploy'
import { clean } from './actions/clean'
import { browserSync } from './actions/browser-sync'
import { watch } from './actions/watch'

// TODO: Implement an option to list all available themes
const program = sade('magefront', true)

program
  .version(version)
  .option('-t, --theme <theme>', 'Theme identifier')
  .option('-c, --config <config>', 'Path to the configuration file')
  .option('-w, --watch', 'Watch the source files of a theme, and rebuild on change', false)
  .option('-d, --dev <url>', 'Run a browser-sync proxy instance')

program.example('-t Magento/blank')
program.example('-t Magento/blank -c -w')
program.example('-t Magento/blank -c --dev https://magento.ddev.site')

program.action(async (opts) => {
  const { theme, _: locales, watch: watchMode, dev: devMode, config } = opts

  if (!theme) {
    logger.error('You must provide a theme name.')
    return
  }

  if (devMode && !devMode.length) {
    logger.error('The dev mode requires a URL to proxy.')
    return
  }

  if (config) {
    setUseConfigFile(true)
    if (typeof config === 'string' && config.length > 0) {
      logger.info(`Using configuration file: ${config}`)
      setConfigFilename(path.resolve(process.cwd(), config))
    }
  }

  // Use the default `en_US` locale if none is provided
  // TODO: Add support for multiple locales (when building)
  const locale = locales[0] || 'en_US'

  try {
    const now = performance.now()
    logger.info(`Gathering files for ${k.bold(theme)}...`)
    await clean(theme)
    await inheritance(theme)
    logger.info(`Building ${k.bold(theme)} for locale ${k.bold(locale)}...`)
    await build(theme, locale)
    await deploy(theme, locale)
    logger.info(`Done in ${prettyMilliseconds(performance.now() - now)}`)
  } catch (error) {
    logger.error(error)
    process.exit(1)
  }

  if (devMode) {
    logger.info('Starting browser-sync proxy...')
    await browserSync(devMode)
  }

  if (devMode || watchMode) {
    await watch(theme, locale)
  }
})

// Set up the logger instance to go through console
logger.add(new winston.transports.Console({ silent: false }))

program.parse(process.argv)
