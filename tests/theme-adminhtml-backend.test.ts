import fs from 'fs-extra'
import path from 'path'

import { build } from '../src/actions/build'
import { clean } from '../src/actions/clean'
import { deploy } from '../src/actions/deploy'
import { inheritance } from '../src/actions/inheritance'
import { rootPath, tempPath } from '../src/env'

describe('Build and deploy the Magento/backend theme', () => {
  it('Clean up the generated files', async () => {
    await clean('Magento/backend')
    expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/adminhtml/Magento/backend'))).toBe(false)
    expect(fs.existsSync(path.join(rootPath, 'pub/static/adminhtml/Magento/backend'))).toBe(false)
  })

  it('Synchronize all the files', async () => {
    await inheritance('Magento/backend')
    expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/adminhtml/Magento/backend/css/styles.less'))).toBe(true)
    expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/adminhtml/Magento/backend/css/source/lib/_lib.less'))).toBe(true)
    expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/adminhtml/Magento/backend/jquery.js'))).toBe(true)
  }, 10000)

  it('Build the source files', async () => {
    await build('Magento/backend')
    expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/adminhtml/Magento/backend/css/styles.css'))).toBe(true)
    expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/adminhtml/Magento/backend/requirejs-config.js'))).toBe(true)
    expect(fs.existsSync(path.join(rootPath, tempPath, 'pub/static/adminhtml/Magento/backend/js-translation.json'))).toBe(true)
  }, 10000)

  it('Deploy the generated files', async () => {
    await deploy('Magento/backend')
    expect(fs.existsSync(path.join(rootPath, 'pub/static/adminhtml/Magento/backend/en_US/css/styles.css'))).toBe(true)
    expect(fs.existsSync(path.join(rootPath, 'pub/static/adminhtml/Magento/backend/en_US/requirejs-config.js'))).toBe(true)
    expect(fs.existsSync(path.join(rootPath, 'pub/static/adminhtml/Magento/backend/en_US/js-translation.json'))).toBe(true)
  })
})
