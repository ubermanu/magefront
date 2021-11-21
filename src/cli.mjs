import { Command } from 'commander'
import pkg from '../package.json'
import { build } from './tasks/build.mjs'

const program = new Command()

program
  .name('magefront')
  .version(pkg.version, '-v, --version', 'Output the current version.')
  .helpOption('-h, --help', 'Show this command summary.')
  .addHelpCommand(false)

program
  .command('build')
  .description('Generate optimization configuration based on given page URLs.')
  .requiredOption('--theme <theme>', 'CMS page URL.')
  .action(({ theme }) => build(theme))

program.parse(process.argv)
