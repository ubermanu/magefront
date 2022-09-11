import { test } from 'uvu'
import * as assert from 'uvu/assert'
import { preProcessor } from '../lib/magento-import-preprocessor'

test('Replace the `@magento_import` statement with the correct one', () => {
  const pp = new preProcessor(['Magento_Catalog'])
  assert.is(
    pp.process("//@magento_import 'source/_module.less';"),
    "@import (optional) '../../Magento_Catalog/web/css/source/_module.less';"
  )
})

test.run()
