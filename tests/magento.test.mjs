import { test } from 'uvu'
import * as assert from 'uvu/assert'

import './setup.mjs'
import { getModules } from '../src/magento/module.mjs'
import { getThemes } from '../src/magento/theme.mjs'

test('Get all the modules from Magento source code', () => {
  const modules = getModules()

  const catalog = modules.find((m) => m.name === 'Magento_Catalog')
  assert.equal(catalog.name, 'Magento_Catalog')
  assert.equal(catalog.src, 'vendor/magento/module-catalog')
  assert.equal(catalog.enabled, true)

  const twoFactorAuth = modules.find((m) => m.name === 'Magento_TwoFactorAuth')
  assert.equal(twoFactorAuth.name, 'Magento_TwoFactorAuth')
  assert.equal(twoFactorAuth.src, 'vendor/magento/module-two-factor-auth')
  assert.equal(twoFactorAuth.enabled, false)
})

test('Get all the themes from Magento source code', () => {
  const themes = getThemes()

  const blank = themes.find((t) => t.name === 'Magento/blank')
  assert.is(blank.src, 'vendor/magento/theme-frontend-blank')
  assert.is(blank.dest, 'pub/static/frontend/Magento/blank')
  assert.is(blank.area, 'frontend')
  assert.is(blank.parent, false)

  const luma = themes.find((t) => t.name === 'Magento/luma')
  assert.is(luma.src, 'vendor/magento/theme-frontend-luma')
  assert.is(luma.dest, 'pub/static/frontend/Magento/luma')
  assert.is(luma.area, 'frontend')
  assert.is(luma.parent, 'Magento/blank')

  const backend = themes.find((t) => t.name === 'Magento/backend')
  assert.is(backend.src, 'vendor/magento/theme-adminhtml-backend')
  assert.is(backend.dest, 'pub/static/adminhtml/Magento/backend')
  assert.is(backend.area, 'adminhtml')
  assert.is(backend.parent, false)
})

test.run()
