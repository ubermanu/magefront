import fs from 'fs-extra'
import path from 'path'
import { test } from 'uvu'
import * as assert from 'uvu/assert'

import './setup.mjs'
import { inheritance } from '../src/actions/inheritance.mjs'
import { build } from '../src/actions/build.mjs'
import { rootPath } from '../src/env.mjs'

test('Build the Magento/blank theme', async () => {
  await inheritance('Magento/blank')
  await build('Magento/blank')

  assert.ok(await fs.exists(path.join(rootPath, 'pub/static/frontend/Magento/blank/en_US/css/styles-m.css')))
  assert.ok(await fs.exists(path.join(rootPath, 'pub/static/frontend/Magento/blank/en_US/css/styles-l.css')))
  assert.ok(await fs.exists(path.join(rootPath, 'pub/static/frontend/Magento/blank/en_US/css/print.css')))
  assert.ok(await fs.exists(path.join(rootPath, 'pub/static/frontend/Magento/blank/en_US/requirejs-config.js')))
  assert.ok(await fs.exists(path.join(rootPath, 'pub/static/frontend/Magento/blank/en_US/js-translation.json')))
})

test('Build the Magento/luma theme', async () => {
  await inheritance('Magento/luma')
  await build('Magento/luma')

  assert.ok(await fs.exists(path.join(rootPath, 'pub/static/frontend/Magento/luma/en_US/css/styles-m.css')))
  assert.ok(await fs.exists(path.join(rootPath, 'pub/static/frontend/Magento/luma/en_US/css/styles-l.css')))
  assert.ok(await fs.exists(path.join(rootPath, 'pub/static/frontend/Magento/luma/en_US/css/print.css')))
  assert.ok(await fs.exists(path.join(rootPath, 'pub/static/frontend/Magento/luma/en_US/requirejs-config.js')))
  assert.ok(await fs.exists(path.join(rootPath, 'pub/static/frontend/Magento/luma/en_US/js-translation.json')))
})

test.run()
