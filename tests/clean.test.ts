import fs from 'fs-extra'
import path from 'path'

import { clean } from '../src/actions/clean'
import { rootPath, tempPath } from '../src/env'

test('Assert that the Magento/blank folders are cleaned', async () => {
  await clean('Magento/blank')

  expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/blank'))).toBe(false)
  expect(fs.existsSync(path.join(rootPath, 'pub/static/frontend/Magento/blank'))).toBe(false)
})

test('Assert that the Magento/luma folders are cleaned', async () => {
  await clean('Magento/luma')

  expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/luma'))).toBe(false)
  expect(fs.existsSync(path.join(rootPath, 'pub/static/frontend/Magento/luma'))).toBe(false)
})

test('Assert that the Magento/backend folders are cleaned', async () => {
  await clean('Magento/backend')

  expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/adminhtml/Magento/backend'))).toBe(false)
  expect(fs.existsSync(path.join(rootPath, 'pub/static/adminhtml/Magento/backend'))).toBe(false)
})
