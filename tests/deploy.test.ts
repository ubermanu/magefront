import fs from 'fs-extra'
import path from 'path'

import { clean } from '../src/actions/clean'
import { inheritance } from '../src/actions/inheritance'
import { build } from '../src/actions/build'
import { deploy } from '../src/actions/deploy'
import { rootPath } from '../src/env'

test('Build and deploy the Magento/blank theme', async () => {
  await clean('Magento/blank')
  await inheritance('Magento/blank')
  await build('Magento/blank')
  await deploy('Magento/blank')

  expect(fs.existsSync(path.join(rootPath, 'pub/static/frontend/Magento/blank/en_US/css/styles-m.css'))).toBe(true)
  expect(fs.existsSync(path.join(rootPath, 'pub/static/frontend/Magento/blank/en_US/css/styles-l.css'))).toBe(true)
  expect(fs.existsSync(path.join(rootPath, 'pub/static/frontend/Magento/blank/en_US/css/print.css'))).toBe(true)
  expect(fs.existsSync(path.join(rootPath, 'pub/static/frontend/Magento/blank/en_US/requirejs-config.js'))).toBe(true)
  expect(fs.existsSync(path.join(rootPath, 'pub/static/frontend/Magento/blank/en_US/js-translation.json'))).toBe(true)
}, 30000)

test('Build and deploy the Magento/luma theme', async () => {
  await clean('Magento/luma')
  await inheritance('Magento/luma')
  await build('Magento/luma')
  await deploy('Magento/luma')

  expect(fs.existsSync(path.join(rootPath, 'pub/static/frontend/Magento/luma/en_US/css/styles-m.css'))).toBe(true)
  expect(fs.existsSync(path.join(rootPath, 'pub/static/frontend/Magento/luma/en_US/css/styles-l.css'))).toBe(true)
  expect(fs.existsSync(path.join(rootPath, 'pub/static/frontend/Magento/luma/en_US/css/print.css'))).toBe(true)
  expect(fs.existsSync(path.join(rootPath, 'pub/static/frontend/Magento/luma/en_US/requirejs-config.js'))).toBe(true)
  expect(fs.existsSync(path.join(rootPath, 'pub/static/frontend/Magento/luma/en_US/js-translation.json'))).toBe(true)
}, 30000)

test('Build and deploy the Magento/backend theme', async () => {
  await clean('Magento/backend')
  await inheritance('Magento/backend')
  await build('Magento/backend')
  await deploy('Magento/backend')

  expect(fs.existsSync(path.join(rootPath, 'pub/static/adminhtml/Magento/backend/en_US/css/styles.css'))).toBe(true)
  expect(fs.existsSync(path.join(rootPath, 'pub/static/adminhtml/Magento/backend/en_US/requirejs-config.js'))).toBe(true)
  expect(fs.existsSync(path.join(rootPath, 'pub/static/adminhtml/Magento/backend/en_US/js-translation.json'))).toBe(true)
}, 30000)
