import { createActionContextTest } from './helpers'

test('Get all the modules from Magento source code', async () => {
  const { modules } = await createActionContextTest('Magento/backend')

  const catalog = modules.find((m) => m.name === 'Magento_Catalog')
  expect(catalog).not.toBe(undefined)

  if (catalog) {
    expect(catalog.name).toEqual('Magento_Catalog')
    expect(catalog.src).toEqual('vendor/magento/module-catalog')
    expect(catalog.enabled).toEqual(true)
  }

  const twoFactorAuth = modules.find((m) => m.name === 'Magento_TwoFactorAuth')
  expect(twoFactorAuth).not.toBe(undefined)

  if (twoFactorAuth) {
    expect(twoFactorAuth.name).toEqual('Magento_TwoFactorAuth')
    expect(twoFactorAuth.src).toEqual('vendor/magento/module-two-factor-auth')
    expect(twoFactorAuth.enabled).toEqual(false)
  }
})

test('Get all the themes from Magento source code', async () => {
  const { themes } = await createActionContextTest('Magento/backend')

  const blank = themes.find((t) => t.name === 'Magento/blank')
  expect(blank).not.toBe(undefined)

  if (blank) {
    expect(blank.src).toEqual('vendor/magento/theme-frontend-blank')
    expect(blank.dest).toEqual('pub/static/frontend/Magento/blank')
    expect(blank.area).toEqual('frontend')
    expect(blank.parent).toBeNull()
  }

  const luma = themes.find((t) => t.name === 'Magento/luma')
  expect(luma).not.toBe(undefined)

  if (luma) {
    expect(luma.src).toEqual('vendor/magento/theme-frontend-luma')
    expect(luma.dest).toEqual('pub/static/frontend/Magento/luma')
    expect(luma.area).toEqual('frontend')
    expect(luma.parent?.name).toEqual('Magento/blank')
  }

  const backend = themes.find((t) => t.name === 'Magento/backend')
  expect(backend).not.toBe(undefined)

  if (backend) {
    expect(backend.src).toEqual('vendor/magento/theme-adminhtml-backend')
    expect(backend.dest).toEqual('pub/static/adminhtml/Magento/backend')
    expect(backend.area).toEqual('adminhtml')
    expect(backend.parent).toBeNull()
  }
})

test('Get all the languages from Magento source code', async () => {
  const { languages } = await createActionContextTest('Magento/backend')

  const enUs = languages.find((l) => l.code === 'en_US')
  expect(enUs).not.toBe(undefined)

  if (enUs) {
    expect(enUs.code).toEqual('en_US')
    expect(enUs.src).toEqual('vendor/magento/language-en_us')
    expect(enUs.enabled).toBe(true)
  }

  const codes = languages.map((l) => l.code)

  expect(codes.includes('en_US')).toBe(true)
  expect(codes.includes('fr_FR')).toBe(true)
  expect(codes.includes('es_ES')).toBe(true)
  expect(codes.includes('de_DE')).toBe(true)
  expect(codes.includes('nl_NL')).toBe(true)
  expect(codes.includes('pt_BR')).toBe(true)
  expect(codes.includes('zh_Hans_CN')).toBe(true)
})
