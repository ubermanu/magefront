import { testActionContext } from './helpers.js'

test('Get all the modules from Magento source code', async () => {
  const context = await testActionContext()
  const { modules } = context.magento

  /** @type {import('types').MagentoModule | undefined} */
  const catalog = modules.find((m) => m.name === 'Magento_Catalog')
  expect(catalog).not.toBe(undefined)

  if (catalog) {
    expect(catalog.name).toEqual('Magento_Catalog')
    expect([
      'vendor/magento/module-catalog',
      'app/code/Magento/Catalog',
    ]).toContain(catalog.src)
    expect(catalog.enabled).toEqual(true)
  }

  /** @type {import('types').MagentoModule | undefined} */
  const twoFactorAuth = modules.find((m) => m.name === 'Magento_TwoFactorAuth')
  expect(twoFactorAuth).not.toBe(undefined)

  if (twoFactorAuth?.src) {
    expect(twoFactorAuth.name).toEqual('Magento_TwoFactorAuth')
    expect([
      'vendor/magento/module-two-factor-auth',
      'app/code/Magento/TwoFactorAuth',
    ]).toContain(twoFactorAuth.src)
    expect(twoFactorAuth.enabled).toEqual(false)
  }
})

test('Get all the themes from Magento source code', async () => {
  const context = await testActionContext()
  const { themes } = context.magento

  /** @type {import('types').MagentoTheme | undefined} */
  const blank = themes.find((t) => t.name === 'Magento/blank')
  expect(blank).not.toBe(undefined)

  if (blank) {
    expect([
      'vendor/magento/theme-frontend-blank',
      'app/design/frontend/Magento/blank',
    ]).toContain(blank.src)
    expect(blank.dest).toEqual('pub/static/frontend/Magento/blank')
    expect(blank.area).toEqual('frontend')
    expect(blank.parent).toBeNull()
  }

  /** @type {import('types').MagentoTheme | undefined} */
  const luma = themes.find((t) => t.name === 'Magento/luma')
  expect(luma).not.toBe(undefined)

  if (luma) {
    expect([
      'vendor/magento/theme-frontend-luma',
      'app/design/frontend/Magento/luma',
    ]).toContain(luma.src)
    expect(luma.dest).toEqual('pub/static/frontend/Magento/luma')
    expect(luma.area).toEqual('frontend')
    expect(luma.parent?.name).toEqual('Magento/blank')
  }

  /** @type {import('types').MagentoTheme | undefined} */
  const backend = themes.find((t) => t.name === 'Magento/backend')
  expect(backend).not.toBe(undefined)

  if (backend) {
    expect([
      'vendor/magento/theme-adminhtml-backend',
      'app/design/adminhtml/Magento/backend',
    ]).toContain(backend.src)
    expect(backend.dest).toEqual('pub/static/adminhtml/Magento/backend')
    expect(backend.area).toEqual('adminhtml')
    expect(backend.parent).toBeNull()
  }
})

test('Get all the languages from Magento source code', async () => {
  const context = await testActionContext()
  const { languages } = context.magento

  /** @type {import('types').MagentoLanguage | undefined} */
  const enUs = languages.find((l) => l.code === 'en_US')
  expect(enUs).not.toBe(undefined)

  if (enUs) {
    expect(enUs.code).toEqual('en_US')
    expect([
      'vendor/magento/language-en_us',
      'app/i18n/Magento/en_US',
    ]).toContain(enUs.src)
    expect(enUs.enabled).toBe(true)
  }

  /** @type {string[]} */
  const codes = languages.map((l) => l.code)

  expect(codes.includes('en_US')).toBe(true)
  expect(codes.includes('fr_FR')).toBe(true)
  expect(codes.includes('es_ES')).toBe(true)
  expect(codes.includes('de_DE')).toBe(true)
  expect(codes.includes('nl_NL')).toBe(true)
  expect(codes.includes('pt_BR')).toBe(true)
  expect(codes.includes('zh_Hans_CN')).toBe(true)
})
