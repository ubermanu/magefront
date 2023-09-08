import fs from 'fs-extra'
import path from 'node:path'
import process from 'node:process'
import { magefront } from '../src/magefront'

test('Can be called programmatically', async () => {
  const rootPath = process.env.MAGEFRONT_TEST_MAGENTO_ROOT!
  await magefront({ theme: 'Magento/blank', magento: { rootPath } })
  expect(fs.existsSync(path.join(rootPath, 'pub/static/frontend/Magento/blank/en_US/css/styles-m.css'))).toBe(true)
  expect(fs.existsSync(path.join(rootPath, 'pub/static/frontend/Magento/blank/en_US/css/styles-l.css'))).toBe(true)
  expect(fs.existsSync(path.join(rootPath, 'pub/static/frontend/Magento/blank/en_US/css/print.css'))).toBe(true)
  expect(fs.existsSync(path.join(rootPath, 'pub/static/frontend/Magento/blank/en_US/requirejs-config.js'))).toBe(true)
  expect(fs.existsSync(path.join(rootPath, 'pub/static/frontend/Magento/blank/en_US/js-translation.json'))).toBe(true)
})
