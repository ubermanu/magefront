import { Command } from 'commander'
// FIXME: build the cli using rollup
// import { version } from '../package.json'
import { build } from './tasks/build.mjs'

const program = new Command()

program
  .name('magefront')
  .version('0', '-v, --version', 'Output the current version.')
  .helpOption('-h, --help', 'Show this command summary.')
  .addHelpCommand(false)

program
  .command('build')
  .description('Generate optimization configuration based on given page URLs.')
  .requiredOption('--theme <theme>', 'CMS page URL.')
  .action(({ theme }) => build(theme))

program.parse(process.argv)
