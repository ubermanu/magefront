import fs from 'fs-extra'
import path from 'node:path'
import { build } from '../src/actions/build'
import { clean } from '../src/actions/clean'
import { deploy } from '../src/actions/deploy'
import { inheritance } from '../src/actions/inheritance'
import { createActionContextTest } from './helpers'

describe('Build and deploy the Magento/blank theme', () => {
  it('Clean up the generated files', async () => {
    const { context, rootPath, tempPath } = await createActionContextTest('Magento/blank')
    await clean(context)
    expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/blank'))).toBe(false)
    expect(fs.existsSync(path.join(rootPath, 'pub/static/frontend/Magento/blank'))).toBe(false)
  })

  it('Synchronize all the files', async () => {
    const { context, rootPath, tempPath } = await createActionContextTest('Magento/blank')
    await inheritance(context)
    expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/blank/css/styles-m.less'))).toBe(true)
    expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/blank/css/styles-l.less'))).toBe(true)
    expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/blank/css/source/lib/_lib.less'))).toBe(true)
    expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/blank/jquery.js'))).toBe(true)
  }, 10000)

  it('Build the source files', async () => {
    const { context, rootPath, tempPath } = await createActionContextTest('Magento/blank')
    await build(context)
    expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/blank/css/styles-m.css'))).toBe(true)
    expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/blank/css/styles-l.css'))).toBe(true)
    expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/blank/css/print.css'))).toBe(true)
    expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/blank/requirejs-config.js'))).toBe(true)
    expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/frontend/Magento/blank/js-translation.json'))).toBe(true)
  }, 10000)

  it('Deploy the generated files', async () => {
    const { context, rootPath } = await createActionContextTest('Magento/blank')
    await deploy(context)
    expect(fs.existsSync(path.join(rootPath, 'pub/static/frontend/Magento/blank/en_US/css/styles-m.css'))).toBe(true)
    expect(fs.existsSync(path.join(rootPath, 'pub/static/frontend/Magento/blank/en_US/css/styles-l.css'))).toBe(true)
    expect(fs.existsSync(path.join(rootPath, 'pub/static/frontend/Magento/blank/en_US/css/print.css'))).toBe(true)
    expect(fs.existsSync(path.join(rootPath, 'pub/static/frontend/Magento/blank/en_US/requirejs-config.js'))).toBe(true)
    expect(fs.existsSync(path.join(rootPath, 'pub/static/frontend/Magento/blank/en_US/js-translation.json'))).toBe(true)
  })
})
