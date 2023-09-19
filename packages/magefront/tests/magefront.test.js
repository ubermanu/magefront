import fs from 'node:fs'
import path from 'node:path'
import { magefront } from '../src/magefront.js'
import { rootPath } from './helpers.js'

test('Can be called programmatically', async () => {
  await magefront({ theme: 'Magento/blank', magento: { rootPath } })
  expect(fs.existsSync(path.join(rootPath, 'pub/static/frontend/Magento/blank/en_US/css/styles-m.css'))).toBe(true)
  expect(fs.existsSync(path.join(rootPath, 'pub/static/frontend/Magento/blank/en_US/css/styles-l.css'))).toBe(true)
  expect(fs.existsSync(path.join(rootPath, 'pub/static/frontend/Magento/blank/en_US/css/print.css'))).toBe(true)
  expect(fs.existsSync(path.join(rootPath, 'pub/static/frontend/Magento/blank/en_US/requirejs-config.js'))).toBe(true)
  expect(fs.existsSync(path.join(rootPath, 'pub/static/frontend/Magento/blank/en_US/js-translation.json'))).toBe(true)
}, 10000)
