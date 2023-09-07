import fs from 'fs-extra'
import path from 'node:path'
import process from 'node:process'
import { build } from '../src/actions/build'
import { clean } from '../src/actions/clean'
import { createActionContext } from '../src/actions/context'
import { deploy } from '../src/actions/deploy'
import { inheritance } from '../src/actions/inheritance'

describe('Build and deploy the Magento/luma theme', () => {
  it('Clean up the generated files', async () => {
    const context = await createActionContext({ theme: 'Magento/luma', magento: { rootPath: process.env.MAGEFRONT_TEST_MAGENTO_ROOT } })
    const { rootPath, tempPath } = context.magento
    await clean(context)
    expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/luma'))).toBe(false)
    expect(fs.existsSync(path.join(rootPath, 'pub/static/frontend/Magento/luma'))).toBe(false)
  })

  it('Synchronize all the files', async () => {
    const context = await createActionContext({ theme: 'Magento/luma', magento: { rootPath: process.env.MAGEFRONT_TEST_MAGENTO_ROOT } })
    const { rootPath, tempPath } = context.magento
    await inheritance(context)
    expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/luma/css/styles-m.less'))).toBe(true)
    expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/luma/css/styles-l.less'))).toBe(true)
    expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/luma/css/source/lib/_lib.less'))).toBe(true)
    expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/luma/jquery.js'))).toBe(true)
  }, 10000)

  it('Build the source files', async () => {
    const context = await createActionContext({ theme: 'Magento/luma', magento: { rootPath: process.env.MAGEFRONT_TEST_MAGENTO_ROOT } })
    const { rootPath, tempPath } = context.magento
    await build(context)
    expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/luma/css/styles-m.css'))).toBe(true)
    expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/luma/css/styles-l.css'))).toBe(true)
    expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/luma/css/print.css'))).toBe(true)
    expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/luma/requirejs-config.js'))).toBe(true)
    expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/luma/js-translation.json'))).toBe(true)
  }, 10000)

  it('Deploy the generated files', async () => {
    const context = await createActionContext({ theme: 'Magento/luma', magento: { rootPath: process.env.MAGEFRONT_TEST_MAGENTO_ROOT } })
    const { rootPath } = context.magento
    await deploy(context)
    expect(fs.existsSync(path.join(rootPath, 'pub/static/frontend/Magento/luma/en_US/css/styles-m.css'))).toBe(true)
    expect(fs.existsSync(path.join(rootPath, 'pub/static/frontend/Magento/luma/en_US/css/styles-l.css'))).toBe(true)
    expect(fs.existsSync(path.join(rootPath, 'pub/static/frontend/Magento/luma/en_US/css/print.css'))).toBe(true)
    expect(fs.existsSync(path.join(rootPath, 'pub/static/frontend/Magento/luma/en_US/requirejs-config.js'))).toBe(true)
    expect(fs.existsSync(path.join(rootPath, 'pub/static/frontend/Magento/luma/en_US/js-translation.json'))).toBe(true)
  })
})
