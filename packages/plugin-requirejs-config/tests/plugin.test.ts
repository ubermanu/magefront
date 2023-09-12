import { magefront } from 'magefront'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import requireJsConfig from '../src/plugin'

const rootPath = process.env.MAGEFRONT_TEST_MAGENTO_ROOT!

test('Generate a merged requirejs-config.js', async () => {
  await magefront({
    theme: 'Magento/blank',
    plugins: [requireJsConfig()],
    magento: { rootPath },
  })

  expect(fs.existsSync(path.join(rootPath, 'pub/static/frontend/Magento/blank/en_US/requirejs-config.js'))).toBe(true)

  const content = await fs.promises.readFile(path.join(rootPath, 'pub/static/frontend/Magento/blank/en_US/requirejs-config.js'), 'utf8')
  expect(content).toContain('var config = {')
  expect(content).toContain('require.config(config);')
}, 5000)
