import fs from 'fs-extra'
import path from 'path'

import { clean } from '../src/actions/clean'
import { inheritance } from '../src/actions/inheritance'
import { rootPath, tempPath } from '../src/env'

test('Gather the Magento/blank theme files', async () => {
  await clean('Magento/blank')
  await inheritance('Magento/blank')

  expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/blank/css/styles-m.less'))).toBe(true)
  expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/blank/css/styles-l.less'))).toBe(true)
  expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/blank/css/source/lib/_lib.less'))).toBe(true)
  expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/blank/jquery.js'))).toBe(true)
}, 30000)

test('Gather the Magento/luma theme files', async () => {
  await clean('Magento/luma')
  await inheritance('Magento/luma')

  expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/luma/css/styles-m.less'))).toBe(true)
  expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/luma/css/styles-l.less'))).toBe(true)
  expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/luma/css/source/lib/_lib.less'))).toBe(true)
  expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/luma/jquery.js'))).toBe(true)
}, 30000)
