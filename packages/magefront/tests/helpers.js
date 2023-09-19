import process from 'node:process'
import { createActionContext } from '../src/actions/context.js'

export const rootPath = process.env.MAGEFRONT_TEST_MAGENTO_ROOT ?? ''

/**
 * Create a context for testing purposes.
 *
 * @param {import('types').MagefrontOptions} [opts]
 * @returns {Promise<import('types').ActionContext>}
 */
export async function testActionContext(opts) {
  const theme = opts?.theme ?? 'Magento/blank'
  return await createActionContext({ theme, ...opts, magento: { rootPath } })
}
