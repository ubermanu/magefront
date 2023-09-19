import path from 'node:path'
import { build } from '../src/actions/build.js'
import { clean } from '../src/actions/clean.js'
import { deploy } from '../src/actions/deploy.js'
import { inheritance } from '../src/actions/inheritance.js'
import { expectPathsExist, testActionContext } from './helpers.js'

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

    await expectPathsExist(
      [
        path.join(rootPath, tempPath, 'pub/static/adminhtml/Magento/backend'),
        path.join(rootPath, 'pub/static/adminhtml/Magento/backend'),
      ],
      false
    )
  })

  it('Synchronize all the files', async () => {
    await inheritance(context)

    const tmpFiles = [
      'pub/static/adminhtml/Magento/backend/css/styles.less',
      'pub/static/adminhtml/Magento/backend/css/source/lib/_lib.less',
      'pub/static/adminhtml/Magento/backend/jquery.js',
    ]

    await expectPathsExist(
      tmpFiles.map((f) => path.join(rootPath, tempPath, f))
    )
  }, 10000)

  it('Build the source files', async () => {
    await build(context)

    const tmpFiles = [
      'pub/static/adminhtml/Magento/backend/css/styles.css',
      'pub/static/adminhtml/Magento/backend/requirejs-config.js',
      'pub/static/adminhtml/Magento/backend/js-translation.json',
    ]

    await expectPathsExist(
      tmpFiles.map((f) => path.join(rootPath, tempPath, f))
    )
  }, 10000)

  it('Deploy the generated files', async () => {
    await deploy(context)

    const pubFiles = [
      'pub/static/adminhtml/Magento/backend/en_US/css/styles.css',
      'pub/static/adminhtml/Magento/backend/en_US/requirejs-config.js',
      'pub/static/adminhtml/Magento/backend/en_US/js-translation.json',
    ]

    await expectPathsExist(pubFiles.map((f) => path.join(rootPath, f)))
  })
})
