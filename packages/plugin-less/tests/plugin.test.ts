import magefront from 'magefront'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import less from '../src/plugin'

const rootPath = process.env.MAGEFRONT_TEST_MAGENTO_ROOT!

test('Parses less files without any options', async () => {
  await magefront({
    theme: 'Magento/blank',
    plugins: [less()],
    magento: { rootPath },
  })

  expect(fs.existsSync(path.join(rootPath, 'pub/static/frontend/Magento/blank/en_US/css/styles-m.css'))).toBe(true)
  expect(fs.existsSync(path.join(rootPath, 'pub/static/frontend/Magento/blank/en_US/css/styles-l.css'))).toBe(true)
  expect(fs.existsSync(path.join(rootPath, 'pub/static/frontend/Magento/blank/en_US/css/email.css'))).toBe(true)
  expect(fs.existsSync(path.join(rootPath, 'pub/static/frontend/Magento/blank/en_US/css/email-inline.css'))).toBe(true)
  expect(fs.existsSync(path.join(rootPath, 'pub/static/frontend/Magento/blank/en_US/css/print.css'))).toBe(true)
}, 10000)

test('Parses less files with sourcemaps', async () => {
  await magefront({
    theme: 'Magento/blank',
    plugins: [less({ sourcemaps: true })],
    magento: { rootPath },
  })

  expect(fs.existsSync(path.join(rootPath, 'pub/static/frontend/Magento/blank/en_US/css/styles-m.css'))).toBe(true)
  expect(fs.existsSync(path.join(rootPath, 'pub/static/frontend/Magento/blank/en_US/css/styles-m.css.map'))).toBe(true)
  expect(fs.existsSync(path.join(rootPath, 'pub/static/frontend/Magento/blank/en_US/css/styles-l.css'))).toBe(true)
  expect(fs.existsSync(path.join(rootPath, 'pub/static/frontend/Magento/blank/en_US/css/styles-l.css.map'))).toBe(true)
  expect(fs.existsSync(path.join(rootPath, 'pub/static/frontend/Magento/blank/en_US/css/email.css'))).toBe(true)
  expect(fs.existsSync(path.join(rootPath, 'pub/static/frontend/Magento/blank/en_US/css/email.css.map'))).toBe(true)
  expect(fs.existsSync(path.join(rootPath, 'pub/static/frontend/Magento/blank/en_US/css/email-inline.css'))).toBe(true)
  expect(fs.existsSync(path.join(rootPath, 'pub/static/frontend/Magento/blank/en_US/css/email-inline.css.map'))).toBe(true)
  expect(fs.existsSync(path.join(rootPath, 'pub/static/frontend/Magento/blank/en_US/css/print.css'))).toBe(true)
  expect(fs.existsSync(path.join(rootPath, 'pub/static/frontend/Magento/blank/en_US/css/print.css.map'))).toBe(true)
}, 10000)
