import process from 'node:process'
import { createActionContext } from '../src/actions/context'

export const createActionContextTest = async (theme: string) => {
  const context = await createActionContext({ theme, magento: { rootPath: process.env.MAGEFRONT_TEST_MAGENTO_ROOT } })
  return { context, ...context.magento }
}
