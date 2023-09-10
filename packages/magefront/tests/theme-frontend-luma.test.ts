import fs from 'fs-extra'
import path from 'node:path'
import { build } from '../src/actions/build'
import { clean } from '../src/actions/clean'
import { deploy } from '../src/actions/deploy'
import { inheritance } from '../src/actions/inheritance'
import type { ActionContext } from '../types/magefront'
import { testActionContext } from './helpers'

describe('Build and deploy the Magento/luma theme', () => {
  let context: ActionContext
  let rootPath: string
  let tempPath: string

  beforeAll(async () => {
    context = await testActionContext({ theme: 'Magento/luma' })
    rootPath = context.magento.rootPath
    tempPath = context.magento.tempPath
  })

  it('Clean up the generated files', async () => {
    await clean(context)
    expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/luma'))).toBe(false)
    expect(fs.existsSync(path.join(rootPath, 'pub/static/frontend/Magento/luma'))).toBe(false)
  })

  it('Synchronize all the files', async () => {
    await inheritance(context)
    expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/luma/css/styles-m.less'))).toBe(true)
    expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/luma/css/styles-l.less'))).toBe(true)
    expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/luma/css/source/lib/_lib.less'))).toBe(true)
    expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/luma/jquery.js'))).toBe(true)
  }, 10000)

  it('Build the source files', async () => {
    await build(context)
    expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/luma/css/styles-m.css'))).toBe(true)
    expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/luma/css/styles-l.css'))).toBe(true)
    expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/luma/css/print.css'))).toBe(true)
    expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/luma/requirejs-config.js'))).toBe(true)
    expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/luma/js-translation.json'))).toBe(true)
  }, 10000)

  it('Deploy the generated files', async () => {
    await deploy(context)
    expect(fs.existsSync(path.join(rootPath, 'pub/static/frontend/Magento/luma/en_US/css/styles-m.css'))).toBe(true)
    expect(fs.existsSync(path.join(rootPath, 'pub/static/frontend/Magento/luma/en_US/css/styles-l.css'))).toBe(true)
    expect(fs.existsSync(path.join(rootPath, 'pub/static/frontend/Magento/luma/en_US/css/print.css'))).toBe(true)
    expect(fs.existsSync(path.join(rootPath, 'pub/static/frontend/Magento/luma/en_US/requirejs-config.js'))).toBe(true)
    expect(fs.existsSync(path.join(rootPath, 'pub/static/frontend/Magento/luma/en_US/js-translation.json'))).toBe(true)
  })
})
