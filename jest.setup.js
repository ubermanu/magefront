import dotenv from 'dotenv'
import fs from 'node:fs'
import process from 'node:process'

// Load test env file
dotenv.config({ path: '.env.test' })

const magentoPath = process.env.MAGEFRONT_TEST_MAGENTO_ROOT

if (!magentoPath) {
  throw new Error('MAGEFRONT_TEST_MAGENTO_ROOT env variable is not set')
}

if (!fs.existsSync(magentoPath)) {
  throw new Error(
    `MAGEFRONT_TEST_MAGENTO_ROOT env variable points to a non-existing directory: ${magentoPath}`
  )
}
