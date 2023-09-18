import fs from 'node:fs'
import path from 'node:path'
import { build } from '../src/actions/build'
import { clean } from '../src/actions/clean'
import { deploy } from '../src/actions/deploy'
import { inheritance } from '../src/actions/inheritance'
import { testActionContext } from './helpers'

describe('Build and deploy the Magento/backend theme', () => {
  /** @type {import('types').ActionContext} */
  let context
  /** @type {string} */
  let rootPath
  /** @type {string} */
  let tempPath

  beforeAll(async () => {
    context = await testActionContext({ theme: 'Magento/backend' })
    rootPath = context.magento.rootPath
    tempPath = context.magento.tempPath
  })

  it('Clean up the generated files', async () => {
    await clean(context)
    expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/adminhtml/Magento/backend'))).toBe(false)
    expect(fs.existsSync(path.join(rootPath, 'pub/static/adminhtml/Magento/backend'))).toBe(false)
  })

  it('Synchronize all the files', async () => {
    await inheritance(context)
    expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/adminhtml/Magento/backend/css/styles.less'))).toBe(true)
    expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/adminhtml/Magento/backend/css/source/lib/_lib.less'))).toBe(true)
    expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/adminhtml/Magento/backend/jquery.js'))).toBe(true)
  }, 10000)

  it('Build the source files', async () => {
    await build(context)
    expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/adminhtml/Magento/backend/css/styles.css'))).toBe(true)
    expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/adminhtml/Magento/backend/requirejs-config.js'))).toBe(true)
    expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/adminhtml/Magento/backend/js-translation.json'))).toBe(true)
  }, 10000)

  it('Deploy the generated files', async () => {
    await deploy(context)
    expect(fs.existsSync(path.join(rootPath, 'pub/static/adminhtml/Magento/backend/en_US/css/styles.css'))).toBe(true)
    expect(fs.existsSync(path.join(rootPath, 'pub/static/adminhtml/Magento/backend/en_US/requirejs-config.js'))).toBe(true)
    expect(fs.existsSync(path.join(rootPath, 'pub/static/adminhtml/Magento/backend/en_US/js-translation.json'))).toBe(true)
  })
})
