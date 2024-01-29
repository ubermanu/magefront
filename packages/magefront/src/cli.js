#!/usr/bin/env node
import process from 'node:process'
import sade from 'sade'
import winston from 'winston'
import pkg from '../package.json' assert { type: 'json' }
import { browserSync } from './actions/browser-sync.js'
import { createActionContext } from './actions/context.js'
import { list } from './actions/list.js'
import { watch } from './actions/watch.js'
import { generateEntries } from './cli/entries.js'
import { createLogger } from './logger.js'
import { magefront } from './magefront.js'
import { createMagentoContext } from './magento/context.js'

// Set up the logger instance to go through console
const logger = createLogger()
logger.add(new winston.transports.Console({ silent: false }))

// The root path of the project
const rootPath = process.cwd()

// The CLI program
const program = sade('magefront')

program
  .version(pkg.version)
  .option('-t, --theme <theme>', 'Theme identifier (e.g. Magento/blank)')
  .option('-c, --config <config>', 'Path to the configuration file')
  .option('--debug', 'Enable debug mode')

/**
 * The build command, gather all the theme files and build the theme into the
 * `pub/static` directory.
 *
 * @example
 *   magefront build -t Magento/blank
 *   magefront build -t Magento/blank -c
 *   magefront build -t Magento/blank -c -w
 */
program
  .command('build', 'Build a theme', { default: true })
  .option('-w, --watch', 'Watch the source files, and rebuild on change')
  .example('build -t Magento/blank')
  .example('build -t Magento/blank -c -w')
  .action(async (opts) => {
    const { theme, watch: watch_mode } = opts

    if ((Array.isArray(theme) || !theme) && watch_mode) {
      logger.error('You must provide only one theme name in watch mode.')
      process.exit(1)
    }

    const entries = await generateEntries(opts, rootPath, logger)

    // Build the themes
    for (const entry of entries) {
      await magefront(entry, logger)
    }

    if (watch_mode) {
      const actionContext = await createActionContext(entries[0], logger)
      await watch(actionContext)
    }
  })

/**
 * The list command, renders a table of available themes.
 *
 * @example
 *   magefront list
 *   magefront ls
 */
program
  .command('list', 'List all available themes', { alias: 'ls' })
  .action(async (opts) => {
    list(createMagentoContext(opts))
  })

/**
 * The dev command, starts a browser-sync proxy instance + watcher.
 *
 * @example
 *   magefront dev -t Magento/blank --url https://magento.ddev.site
 */
program
  .command('dev', 'Run a browser-sync proxy instance')
  .option('-u, --url <url>', 'URL to proxy')
  .example('dev -t Magento/blank --url https://magento.ddev.site')
  .action(async (opts) => {
    const { url, theme, _: locales } = opts

    if (!theme) {
      logger.error('You must provide a theme name.')
      process.exit(1)
    }

    if (Array.isArray(theme)) {
      logger.error('You must provide only one theme name.')
      process.exit(1)
    }

    if (Array.isArray(locales) && locales.length > 1) {
      logger.error('You must provide only one locale.')
      process.exit(1)
    }

    if (!url) {
      logger.error('You must provide a URL to proxy.')
      process.exit(1)
    }

    const entries = await generateEntries(opts, rootPath, logger)
    await magefront(entries[0], logger)

    logger.info('Starting browser-sync proxy...')
    await browserSync(url)

    const context = await createActionContext(entries[0], logger)
    await watch(context)
  })

program.parse(process.argv)
