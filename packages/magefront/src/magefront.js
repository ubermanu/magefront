import k from 'kleur'
import { performance } from 'node:perf_hooks'
import prettyMilliseconds from 'pretty-ms'
import { build } from './actions/build'
import { clean } from './actions/clean'
import { createActionContext } from './actions/context'
import { deploy } from './actions/deploy'
import { inheritance } from './actions/inheritance'

/**
 * Builds a Magento 2 theme.
 *
 * @param {import('types').MagefrontOptions} opts
 * @param {import('winston').Logger} [logger]
 * @returns {Promise<void>}
 */
// TODO: Remove the logger argument and implement it in the options
export async function magefront(opts, logger) {
  const now = performance.now()

  const context = await createActionContext(opts, logger)
  const { theme, locale } = context

  context.logger.info(`Gathering files for ${k.bold(theme.name)}...`)
  await clean(context)
  await inheritance(context)

  context.logger.info(`Building ${k.bold(theme.name)} for locale ${k.bold(locale)}...`)
  await build(context)
  await deploy(context)

  context.logger.info(`Done in ${prettyMilliseconds(performance.now() - now)}`)
}
