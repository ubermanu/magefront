import fs from 'fs-extra'
import path from 'path'
import { test } from 'uvu'
import * as assert from 'uvu/assert'

import './setup.mjs'
import { clean } from '../src/actions/clean'
import { inheritance } from '../src/actions/inheritance'
import { rootPath, tempPath } from '../src/env'

test('Gather the Magento/blank theme files', async () => {
  await clean('Magento/blank')
  await inheritance('Magento/blank')

  assert.ok(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/blank/web/css/styles-m.less')))
  assert.ok(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/blank/web/css/styles-l.less')))
  assert.ok(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/blank/web/css/source/lib/_lib.less')))
  assert.ok(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/blank/web/jquery.js')))
})

test.run()
