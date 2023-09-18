import { magefront } from 'magefront'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import jsTranslation from '../src/plugin'

const rootPath = process.env.MAGEFRONT_TEST_MAGENTO_ROOT

test('Generate js-translation.json', async () => {
  await magefront({
    theme: 'Magento/blank',
    locale: 'en_US',
    plugins: [jsTranslation()],
    magento: { rootPath },
  })

  expect(fs.existsSync(path.join(rootPath, 'pub/static/frontend/Magento/blank/en_US/js-translation.json'))).toBe(true)
}, 5000)
