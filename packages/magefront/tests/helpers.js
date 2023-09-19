import fs from 'node:fs/promises'
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

/**
 * @param {string} path
 * @returns {Promise<boolean>}
 */
async function exists(path) {
  return !!(await fs.stat(path).catch((_) => false))
}

/**
 * Expect the given paths to exist or not exist.
 *
 * @param {string[]} paths
 * @param {boolean} [toBe]
 * @returns {Promise<void>}
 */
export async function expectPathsExist(paths, toBe = true) {
  await Promise.all(
    paths.map(async (path) => {
      expect(await exists(path)).toBe(toBe)
    })
  )
}
