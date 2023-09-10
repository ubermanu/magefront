import k from 'kleur'
import { performance } from 'node:perf_hooks'
import prettyMilliseconds from 'pretty-ms'
import type { Logger } from 'winston'
import type { MagefrontOptions } from '../types/magefront'
import { build } from './actions/build'
import { clean } from './actions/clean'
import { createActionContext } from './actions/context'
import { deploy } from './actions/deploy'
import { inheritance } from './actions/inheritance'

/** Builds a Magento 2 theme. */
// TODO: Remove the logger argument and implement it in the options
export const magefront = async (opts: MagefrontOptions, logger?: Logger): Promise<void> => {
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
