import { Command } from 'commander'
// FIXME: build the cli using rollup
// import { version } from '../package.json'
import { build } from './tasks/build.mjs'
import { inheritance } from './tasks/inheritance.mjs'

const program = new Command()

program
  .name('magefront')
  .version('0', '-v, --version', 'Output the current version.')
  .helpOption('-h, --help', 'Show this command summary.')
  .addHelpCommand(false)

program
  .command('build')
  .description('Build the theme.')
  .requiredOption('--theme <theme>', 'Theme name.')
  .action(async ({ theme }) => {
    await inheritance(theme)
    await build(theme)
  })

program
  .command('inheritance')
  .description('Create the inheritance symlinks in the cache.')
  .requiredOption('--theme <theme>', 'Theme name.')
  .action(async ({ theme }) => await inheritance(theme))

program.parse(process.argv)
