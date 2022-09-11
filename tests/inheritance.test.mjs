import fs from 'fs-extra'
import path from 'path'
import { test } from 'uvu'
import * as assert from 'uvu/assert'

import './setup.mjs'
import { inheritance } from '../src/actions/inheritance.mjs'
import { rootPath, tempPath } from '../src/env.mjs'

test('Gather the Magento/blank theme files', async () => {
  await inheritance('Magento/blank')

  assert.ok(await fs.exists(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/blank/web/css/styles-m.less')))
  assert.ok(await fs.exists(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/blank/web/css/styles-l.less')))
  assert.ok(await fs.exists(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/blank/web/css/source/lib/_lib.less')))
  assert.ok(await fs.exists(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/blank/web/jquery.js')))
})

test.run()
