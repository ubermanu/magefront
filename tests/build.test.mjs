import fs from 'fs-extra'
import path from 'path'
import { test } from 'uvu'
import * as assert from 'uvu/assert'

import './setup.mjs'
import { clean } from '../src/actions/clean.mjs'
import { inheritance } from '../src/actions/inheritance.mjs'
import { build } from '../src/actions/build.mjs'
import { rootPath, tempPath } from '../src/env.mjs'

test('Build the Magento/blank theme', async () => {
  await clean('Magento/blank')
  await inheritance('Magento/blank')
  await build('Magento/blank')

  assert.ok(await fs.exists(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/blank/web/css/styles-m.css')))
  assert.ok(await fs.exists(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/blank/web/css/styles-l.css')))
  assert.ok(await fs.exists(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/blank/web/css/print.css')))
  assert.ok(await fs.exists(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/blank/web/requirejs-config.js')))
  assert.ok(await fs.exists(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/blank/web/js-translation.json')))
})

test('Build the Magento/luma theme', async () => {
  await clean('Magento/luma')
  await inheritance('Magento/luma')
  await build('Magento/luma')

  assert.ok(await fs.exists(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/luma/web/css/styles-m.css')))
  assert.ok(await fs.exists(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/luma/web/css/styles-l.css')))
  assert.ok(await fs.exists(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/luma/web/css/print.css')))
  assert.ok(await fs.exists(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/luma/web/requirejs-config.js')))
  assert.ok(await fs.exists(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/luma/web/js-translation.json')))
})

test.run()
