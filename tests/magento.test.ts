import './setup'
import { getModules } from '../src/magento/module'
import { getThemes } from '../src/magento/theme'

test('Get all the modules from Magento source code', () => {
  const modules = getModules()

  const catalog = modules.find((m) => m.name === 'Magento_Catalog')
  expect(catalog).not.toBe(undefined)

  if (catalog) {
    expect(catalog.name).toEqual('Magento_Catalog')
    expect(catalog.src).toEqual('vendor/magento/module-catalog')
    expect(catalog.enabled).toEqual(true)
  }

  const twoFactorAuth = modules.find((m) => m.name === 'Magento_TwoFactorAuth')
  expect(catalog).not.toBe(undefined)

  if (twoFactorAuth) {
    expect(twoFactorAuth.name).toEqual('Magento_TwoFactorAuth')
    expect(twoFactorAuth.src).toEqual('vendor/magento/module-two-factor-auth')
    expect(twoFactorAuth.enabled).toEqual(false)
  }
})

test('Get all the themes from Magento source code', () => {
  const themes = getThemes()

  const blank = themes.find((t) => t.name === 'Magento/blank')
  expect(blank).not.toBe(undefined)

  if (blank) {
    expect(blank.src).toEqual('vendor/magento/theme-frontend-blank')
    expect(blank.dest).toEqual('pub/static/frontend/Magento/blank')
    expect(blank.area).toEqual('frontend')
    expect(blank.parent).toEqual(false)
  }

  const luma = themes.find((t) => t.name === 'Magento/luma')
  expect(luma).not.toBe(undefined)

  if (luma) {
    expect(luma.src).toEqual('vendor/magento/theme-frontend-luma')
    expect(luma.dest).toEqual('pub/static/frontend/Magento/luma')
    expect(luma.area).toEqual('frontend')
    expect(luma.parent).toEqual('Magento/blank')
  }

  const backend = themes.find((t) => t.name === 'Magento/backend')
  expect(backend).not.toBe(undefined)

  if (backend) {
    expect(backend.src).toEqual('vendor/magento/theme-adminhtml-backend')
    expect(backend.dest).toEqual('pub/static/adminhtml/Magento/backend')
    expect(backend.area).toEqual('adminhtml')
    expect(backend.parent).toEqual(false)
  }
})
