import process from 'node:process'
import { createActionContext } from '../src/actions/context'
import type { ActionContext, MagefrontOptions } from '../types/magefront'

export const rootPath = process.env.MAGEFRONT_TEST_MAGENTO_ROOT!

/** Create a context for testing purposes. */
export const testActionContext = async (opts?: MagefrontOptions): Promise<ActionContext> => {
  const theme = opts?.theme ?? 'Magento/blank'
  return await createActionContext({ theme, ...opts, magento: { rootPath } })
}
