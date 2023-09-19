import path from 'node:path'
import { build } from '../src/actions/build.js'
import { clean } from '../src/actions/clean.js'
import { deploy } from '../src/actions/deploy.js'
import { inheritance } from '../src/actions/inheritance.js'
import { expectPathsExist, testActionContext } from './helpers.js'

describe('Build and deploy the Magento/blank theme', () => {
  /** @type {import('types').ActionContext} */
  let context
  /** @type {string} */
  let rootPath
  /** @type {string} */
  let tempPath

  beforeAll(async () => {
    context = await testActionContext({ theme: 'Magento/blank' })
    rootPath = context.magento.rootPath
    tempPath = context.magento.tempPath
  })

  it('Clean up the generated files', async () => {
    await clean(context)

    await expectPathsExist(
      [
        path.join(rootPath, tempPath, 'pub/static/frontend/Magento/blank'),
        path.join(rootPath, 'pub/static/frontend/Magento/blank'),
      ],
      false
    )
  })

  it('Synchronize all the files', async () => {
    await inheritance(context)

    const tmpFiles = [
      'pub/static/frontend/Magento/blank/css/styles-m.less',
      'pub/static/frontend/Magento/blank/css/styles-l.less',
      'pub/static/frontend/Magento/blank/css/source/lib/_lib.less',
      'pub/static/frontend/Magento/blank/jquery.js',
    ]

    await expectPathsExist(
      tmpFiles.map((f) => path.join(rootPath, tempPath, f))
    )
  }, 10000)

  it('Build the source files', async () => {
    await build(context)

    const tmpFiles = [
      'pub/static/frontend/Magento/blank/css/styles-m.css',
      'pub/static/frontend/Magento/blank/css/styles-l.css',
      'pub/static/frontend/Magento/blank/css/print.css',
      'pub/static/frontend/Magento/blank/requirejs-config.js',
      'pub/static/frontend/Magento/blank/js-translation.json',
    ]

    await expectPathsExist(
      tmpFiles.map((f) => path.join(rootPath, tempPath, f))
    )
  }, 10000)

  it('Deploy the generated files', async () => {
    await deploy(context)

    const pubFiles = [
      'pub/static/frontend/Magento/blank/en_US/css/styles-m.css',
      'pub/static/frontend/Magento/blank/en_US/css/styles-l.css',
      'pub/static/frontend/Magento/blank/en_US/css/print.css',
      'pub/static/frontend/Magento/blank/en_US/requirejs-config.js',
      'pub/static/frontend/Magento/blank/en_US/js-translation.json',
    ]

    await expectPathsExist(pubFiles.map((f) => path.join(rootPath, f)))
  })
})
