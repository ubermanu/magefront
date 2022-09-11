import fs from 'fs-extra'
import path from 'path'

import './setup'
import { clean } from '../src/actions/clean'
import { inheritance } from '../src/actions/inheritance'
import { rootPath, tempPath } from '../src/env'

test('Gather the Magento/blank theme files', async () => {
  await clean('Magento/blank')
  await inheritance('Magento/blank')

  expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/blank/web/css/styles-m.less'))).toBe(true)
  expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/blank/web/css/styles-l.less'))).toBe(true)
  expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/blank/web/css/source/lib/_lib.less'))).toBe(true)
  expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/blank/web/jquery.js'))).toBe(true)
})
