import { expect, test } from 'bun:test'
import { testActionContext } from './helpers'

test('Empty configuration returns the default plugins', async () => {
  const context = await testActionContext()
  expect(context.buildConfig.plugins).toHaveLength(3)
})

test('If presets is defined, the default one is skipped', async () => {
  const context = await testActionContext({
    theme: 'Magento/blank',
    presets: [],
  })
  expect(context.buildConfig.plugins).toHaveLength(0)
})

test('If plugins is defined, the default ones are skipped', async () => {
  const context = await testActionContext({
    theme: 'Magento/blank',
    plugins: [],
  })
  expect(context.buildConfig.plugins).toHaveLength(0)
})
