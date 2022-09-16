import fs from 'fs-extra'
import path from 'path'

import { clean } from '../src/actions/clean'
import { inheritance } from '../src/actions/inheritance'
import { build } from '../src/actions/build'
import { rootPath, tempPath } from '../src/env'

test('Build the Magento/blank theme', async () => {
  await clean('Magento/blank')
  await inheritance('Magento/blank')
  await build('Magento/blank')

  expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/blank/web/css/styles-m.css'))).toBe(true)
  expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/blank/web/css/styles-l.css'))).toBe(true)
  expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/blank/web/css/print.css'))).toBe(true)
  expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/blank/web/requirejs-config.js'))).toBe(true)
  expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/blank/web/js-translation.json'))).toBe(true)
})

test('Build the Magento/luma theme', async () => {
  await clean('Magento/luma')
  await inheritance('Magento/luma')
  await build('Magento/luma')

  expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/luma/web/css/styles-m.css'))).toBe(true)
  expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/luma/web/css/styles-l.css'))).toBe(true)
  expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/luma/web/css/print.css'))).toBe(true)
  expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/luma/web/requirejs-config.js'))).toBe(true)
  expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/luma/web/js-translation.json'))).toBe(true)
})
