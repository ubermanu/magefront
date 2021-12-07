import { test } from 'uvu'
import * as assert from 'uvu/assert'
import { getModules, getThemes } from '../src/magento.mjs'

test('Get all the modules from Magento source code', () => {
  const modules = getModules('tests/_fixtures')
  assert.is(modules['Andromeda_Test'].src, 'app/code/Andromeda/Test')
  assert.is(modules['Gemini_A'].src, 'vendor/gemini/module-a')
  assert.is(modules['Orion_Mod1'].src, 'vendor/orion/module-packaged/src/mod1')
  assert.is(modules['Orion_Mod2'].src, 'vendor/orion/module-packaged/src/mod2')
})

test('Get all the themes from Magento source code', () => {
  const themes = getThemes('tests/_fixtures')
  assert.is(
    themes['Andromeda/blank'].src,
    'app/design/frontend/Andromeda/blank'
  )
  assert.is(
    themes['Orion/blank'].src,
    'vendor/orion/theme-frontend-orion-blank/src'
  )
  assert.is(
    themes['Sirius/parent'].src,
    'vendor/sirius/theme-frontend-sirius-parent'
  )
  assert.is(
    themes['Sirius/child'].src,
    'vendor/sirius/theme-frontend-sirius-child'
  )
  assert.is(themes['Orion/blank'].parent, false)
  assert.is(themes['Sirius/parent'].parent, false)
  assert.is(themes['Sirius/child'].parent, 'Sirius/parent')
})

test.run()
