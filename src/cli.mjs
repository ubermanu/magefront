import { Command } from 'commander'
import winston from 'winston'

import { logger } from './env.mjs'
import { build } from './actions/build.mjs'
import { inheritance } from './actions/inheritance.mjs'
import { deploy } from './actions/deploy.mjs'
import { clean } from './actions/clean.mjs'
import { browserSync } from './actions/browser-sync.mjs'
import { watch } from './actions/watch.mjs'
import { list } from './actions/list.mjs'

const program = new Command()

program
  .name('magefront')
  .version('0', '-v, --version', 'Output the current version.')
  .helpOption('-h, --help', 'Show this command summary.')
  .addHelpCommand(false)

program
  .command('build')
  .description('Build the theme.')
  .requiredOption('-t, --theme <theme>', 'Theme name.')
  .argument('[locale]', 'Locale code.', 'en_US')
  .action(async (locale, { theme }) => {
    logger.info(`Building theme ${theme} for locale ${locale}`)
    await clean(theme)
    await inheritance(theme)
    await build(theme, locale)
    await deploy(theme, locale)
    logger.info('Done.')
  })

program
  .command('dev')
  .description('Run a browser-sync proxy instance.')
  .requiredOption('-t, --theme <theme>', 'Theme name.')
  .requiredOption('--url <url>', 'Url of your website.')
  .action(async ({ theme, url }) => {
    await browserSync(url)
    await watch(theme)
  })

program
  .command('watch')
  .description('Watch the source files of a theme, and rebuild on change.')
  .requiredOption('-t, --theme <theme>', 'Theme name.')
  .action(async ({ theme }) => {
    await watch(theme)
  })

program
  .command('list')
  .description('List the available themes.')
  .action(() => {
    list()
  })

// Set up the logger instance to go through console
logger.add(new winston.transports.Console({ silent: false }))

program.parse(process.argv)
