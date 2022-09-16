import { preProcessor } from '../lib/magento-import-preprocessor'

test('Replace the `@magento_import` statement with the correct one', () => {
  const pp = new preProcessor(['Magento_Catalog'])

  expect(pp.process("//@magento_import 'source/_module.less';")).toEqual("@import (optional) '../Magento_Catalog/css/source/_module.less';")
})
