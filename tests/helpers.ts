import process from 'node:process'
import { createActionContext } from '../src/actions/context'
import type { MagefrontOptions } from '../src/types'

export const rootPath = process.env.MAGEFRONT_TEST_MAGENTO_ROOT!

/** Create a context for testing purposes. */
export const testActionContext = async (opts?: MagefrontOptions) => {
  const theme = opts?.theme ?? 'Magento/blank'
  return await createActionContext({ theme, ...opts, magento: { rootPath } })
}
