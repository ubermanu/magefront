import fs from 'fs'
import { execSync } from 'child_process'
import { setRootPath } from '../src/env.mjs'

function createEnvironment() {
  // Check for composer
  const composer = execSync('which composer').toString().trim()
  if (!composer) {
    console.error('Composer is not installed. Please install it first.')
    process.exit(1)
  }

  // Install Magento
  execSync(
    `${composer} create-project --ignore-platform-reqs --repository-url=https://repo.magento.com/ magento/project-community-edition .test-magento`,
    { stdio: 'inherit' }
  )

  // Copy config.php file (so we don't have to `setup:upgrade`)
  fs.copyFileSync('tests/_fixtures/config.php.dist', '.test-magento/app/etc/config.php')
}

// Check if the environment is already created
// If not, create it
if (!fs.existsSync('.test-magento')) {
  createEnvironment()
}

// Set the root path to the magento test instance.
setRootPath('.test-magento')
