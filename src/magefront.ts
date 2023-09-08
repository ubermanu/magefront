import k from 'kleur'
import { performance } from 'node:perf_hooks'
import prettyMilliseconds from 'pretty-ms'
import { build } from './actions/build'
import { clean } from './actions/clean'
import { createActionContext } from './actions/context'
import { deploy } from './actions/deploy'
import { inheritance } from './actions/inheritance'
import type { MagefrontOptions } from './types'

/** Builds a Magento 2 theme. */
export const magefront = async (opts: MagefrontOptions): Promise<void> => {
  const now = performance.now()

  const context = await createActionContext(opts)
  const { theme, locale, logger } = context

  logger.info(`Gathering files for ${k.bold(theme.name)}...`)
  await clean(context)
  await inheritance(context)

  logger.info(`Building ${k.bold(theme.name)} for locale ${k.bold(locale)}...`)
  await build(context)
  await deploy(context)

  logger.info(`Done in ${prettyMilliseconds(performance.now() - now)}`)
}
