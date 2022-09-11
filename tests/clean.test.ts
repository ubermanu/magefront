import fs from 'fs-extra'
import path from 'path'
import { test } from 'uvu'
import * as assert from 'uvu/assert'

import './setup.mjs'
import { clean } from '../src/actions/clean'
import { rootPath, tempPath } from '../src/env'

test('Assert that the Magento/blank folders are cleaned', async () => {
  await clean('Magento/blank')

  assert.not.ok(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/blank')))
  assert.not.ok(fs.existsSync(path.join(rootPath, 'pub/static/frontend/Magento/blank')))
})

test.run()
