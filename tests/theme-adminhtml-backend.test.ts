import fs from 'fs-extra'
import path from 'node:path'
import process from 'node:process'
import { build } from '../src/actions/build'
import { clean } from '../src/actions/clean'
import { createActionContext } from '../src/actions/context'
import { deploy } from '../src/actions/deploy'
import { inheritance } from '../src/actions/inheritance'

describe('Build and deploy the Magento/backend theme', () => {
  it('Clean up the generated files', async () => {
    const context = await createActionContext({ theme: 'Magento/backend', magento: { rootPath: process.env.MAGEFRONT_TEST_MAGENTO_ROOT } })
    const { rootPath, tempPath } = context.magento
    await clean(context)
    expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/adminhtml/Magento/backend'))).toBe(false)
    expect(fs.existsSync(path.join(rootPath, 'pub/static/adminhtml/Magento/backend'))).toBe(false)
  })

  it('Synchronize all the files', async () => {
    const context = await createActionContext({ theme: 'Magento/backend', magento: { rootPath: process.env.MAGEFRONT_TEST_MAGENTO_ROOT } })
    const { rootPath, tempPath } = context.magento
    await inheritance(context)
    expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/adminhtml/Magento/backend/css/styles.less'))).toBe(true)
    expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/adminhtml/Magento/backend/css/source/lib/_lib.less'))).toBe(true)
    expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/adminhtml/Magento/backend/jquery.js'))).toBe(true)
  }, 10000)

  it('Build the source files', async () => {
    const context = await createActionContext({ theme: 'Magento/backend', magento: { rootPath: process.env.MAGEFRONT_TEST_MAGENTO_ROOT } })
    const { rootPath, tempPath } = context.magento
    await build(context)
    expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/adminhtml/Magento/backend/css/styles.css'))).toBe(true)
    expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/adminhtml/Magento/backend/requirejs-config.js'))).toBe(true)
    expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/adminhtml/Magento/backend/js-translation.json'))).toBe(true)
  }, 10000)

  it('Deploy the generated files', async () => {
    const context = await createActionContext({ theme: 'Magento/backend', magento: { rootPath: process.env.MAGEFRONT_TEST_MAGENTO_ROOT } })
    const { rootPath } = context.magento
    await deploy(context)
    expect(fs.existsSync(path.join(rootPath, 'pub/static/adminhtml/Magento/backend/en_US/css/styles.css'))).toBe(true)
    expect(fs.existsSync(path.join(rootPath, 'pub/static/adminhtml/Magento/backend/en_US/requirejs-config.js'))).toBe(true)
    expect(fs.existsSync(path.join(rootPath, 'pub/static/adminhtml/Magento/backend/en_US/js-translation.json'))).toBe(true)
  })
})
