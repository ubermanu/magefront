import path from 'node:path'
import { magefront } from '../src/magefront.js'
import { expectPathsExist, rootPath } from './helpers.js'

test('Can be called programmatically', async () => {
  await magefront({ theme: 'Magento/blank', magento: { rootPath } })

  const files = [
    'pub/static/frontend/Magento/blank/en_US/css/styles-m.css',
    'pub/static/frontend/Magento/blank/en_US/css/styles-l.css',
    'pub/static/frontend/Magento/blank/en_US/css/print.css',
    'pub/static/frontend/Magento/blank/en_US/requirejs-config.js',
    'pub/static/frontend/Magento/blank/en_US/js-translation.json',
  ]

  await expectPathsExist(files.map((f) => path.join(rootPath, f)))
}, 10000)
