import fs from 'fs-extra'
import path from 'path'
import { test } from 'uvu'
import * as assert from 'uvu/assert'

import './setup.mjs'
import { clean } from '../src/actions/clean.mjs'
import { inheritance } from '../src/actions/inheritance.mjs'
import { build } from '../src/actions/build.mjs'
import { deploy } from '../src/actions/deploy.mjs'
import { rootPath } from '../src/env.mjs'

test('Build and deploy the Magento/blank theme', async () => {
  await clean('Magento/blank')
  await inheritance('Magento/blank')
  await build('Magento/blank')
  await deploy('Magento/blank')

  assert.ok(await fs.exists(path.join(rootPath, 'pub/static/frontend/Magento/blank/en_US/css/styles-m.css')))
  assert.ok(await fs.exists(path.join(rootPath, 'pub/static/frontend/Magento/blank/en_US/css/styles-l.css')))
  assert.ok(await fs.exists(path.join(rootPath, 'pub/static/frontend/Magento/blank/en_US/css/print.css')))
  assert.ok(await fs.exists(path.join(rootPath, 'pub/static/frontend/Magento/blank/en_US/requirejs-config.js')))
  assert.ok(await fs.exists(path.join(rootPath, 'pub/static/frontend/Magento/blank/en_US/js-translation.json')))
})

test('Build and deploy the Magento/luma theme', async () => {
  await clean('Magento/luma')
  await inheritance('Magento/luma')
  await build('Magento/luma')
  await deploy('Magento/luma')

  assert.ok(await fs.exists(path.join(rootPath, 'pub/static/frontend/Magento/luma/en_US/css/styles-m.css')))
  assert.ok(await fs.exists(path.join(rootPath, 'pub/static/frontend/Magento/luma/en_US/css/styles-l.css')))
  assert.ok(await fs.exists(path.join(rootPath, 'pub/static/frontend/Magento/luma/en_US/css/print.css')))
  assert.ok(await fs.exists(path.join(rootPath, 'pub/static/frontend/Magento/luma/en_US/requirejs-config.js')))
  assert.ok(await fs.exists(path.join(rootPath, 'pub/static/frontend/Magento/luma/en_US/js-translation.json')))
})

test.run()
