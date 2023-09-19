import { preProcessor } from '../src/magento-import-preprocessor.js'

test('Replace the `@magento_import` statement with the correct one', () => {
  const pp = new preProcessor(['Magento_Catalog'])

  expect(pp.process("//@magento_import 'source/_module.less';")).toEqual(
    "@import (optional) '../Magento_Catalog/css/source/_module.less';"
  )
})

test('Preserves import parameters', () => {
  const pp = new preProcessor(['Magento_Catalog'])

  expect(
    pp.process("//@magento_import (reference) 'source/_module.less';")
  ).toEqual(
    "@import (optional, reference) '../Magento_Catalog/css/source/_module.less';"
  )

  expect(
    pp.process("//@magento_import (optional) 'source/_module.less';")
  ).toEqual("@import (optional) '../Magento_Catalog/css/source/_module.less';")

  expect(
    pp.process(
      "//@magento_import (multiple, less, inline) 'source/_module.less';"
    )
  ).toEqual(
    "@import (optional, multiple, less, inline) '../Magento_Catalog/css/source/_module.less';"
  )
})
