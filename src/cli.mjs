import { Command } from 'commander'
import { build } from './actions/build.mjs'
import { inheritance } from './actions/inheritance.mjs'
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
    await inheritance(theme)
    await build(theme, locale)
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

program.parse(process.argv)
