import k from 'kleur'
import { performance } from 'node:perf_hooks'
import prettyMilliseconds from 'pretty-ms'
import { build } from './actions/build.js'
import { clean } from './actions/clean.js'
import { createActionContext } from './actions/context.js'
import { deploy } from './actions/deploy.js'
import { inheritance } from './actions/inheritance.js'
import { getThemeDependencyTree } from './magento/theme.js'

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

  const parents = getThemeDependencyTree(context.theme).reverse().slice(1)
  if (parents.length > 0) {
    context.logger.debug(
      `[${k.gray(theme.name)}] Parent: ${parents
        .map((p) => k.bold(p.name))
        .join(' ← ')}`
    )
  }

  context.logger.debug(
    `[${k.gray(theme.name)}] Plugins: ${context.buildConfig.plugins
      .map((p) => k.bold(p.name))
      .join(', ')}`
  )

  context.logger.info(`[${k.gray(theme.name)}] Gathering files...`)
  await clean(context)
  await inheritance(context)

  context.logger.info(
    `[${k.gray(theme.name)}] Building locale ${k.bold(locale)}`
  )

  await deploy(context)
  await build(context)

  context.logger.info(
    `[${k.gray(theme.name)}] Done in ${prettyMilliseconds(
      performance.now() - now
    )}`
  )
}
