import fs from 'fs'
import dotenv from 'dotenv'
import { setRootPath } from '../src/env.mjs'

// Load test env file
dotenv.config({ path: '.env.test' })

const magentoPath = process.env.MAGEFRONT_TEST_MAGENTO_ROOT

if (!magentoPath) {
  throw new Error('MAGENTO_ROOT_PATH env variable is not set')
}

if (!fs.existsSync(magentoPath)) {
  throw new Error(`MAGENTO_ROOT_PATH env variable points to a non-existing directory: ${magentoPath}`)
}

// Set the root path to the magento test instance.
setRootPath(magentoPath)
