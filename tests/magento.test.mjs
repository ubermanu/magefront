import { test } from 'uvu'
import * as assert from 'uvu/assert'
import { getModules } from '../src/magento/module.mjs'
import { getThemes } from '../src/magento/theme.mjs'

function find(modules, name) {
  return modules.find((module) => module.name === name)
}

test('Get all the modules from Magento source code', () => {
  const modules = getModules('tests/_fixtures')
  assert.is(find(modules, 'Andromeda_Test').src, 'app/code/Andromeda/Test')
  assert.is(find(modules, 'Gemini_A').src, 'vendor/gemini/module-a')
  assert.is(find(modules, 'Orion_Mod1').src, 'vendor/orion/module-packaged/src/mod1')
  assert.is(find(modules, 'Orion_Mod2').src, 'vendor/orion/module-packaged/src/mod2')
})

test('Get all the themes from Magento source code', () => {
  const themes = getThemes('tests/_fixtures')
  assert.is(find(themes, 'Andromeda/blank').src, 'app/design/frontend/Andromeda/blank')
  assert.is(find(themes, 'Orion/blank').src, 'vendor/orion/theme-frontend-blank/src')
  assert.is(find(themes, 'Sirius/parent').src, 'vendor/sirius/theme-frontend-parent')
  assert.is(find(themes, 'Sirius/child').src, 'vendor/sirius/theme-frontend-child')
  assert.is(find(themes, 'Orion/blank').parent, false)
  assert.is(find(themes, 'Sirius/parent').parent, false)
  assert.is(find(themes, 'Sirius/child').parent, 'Sirius/parent')
})

test.run()
