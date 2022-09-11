import fs from 'fs-extra'
import path from 'path'

import './setup'
import { clean } from '../src/actions/clean'
import { rootPath, tempPath } from '../src/env'

test('Assert that the Magento/blank folders are cleaned', async () => {
  await clean('Magento/blank')

  expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/blank'))).toBe(false)
  expect(fs.existsSync(path.join(rootPath, 'pub/static/frontend/Magento/blank'))).toBe(false)
})
