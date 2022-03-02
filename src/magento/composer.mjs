import path from 'path'
import fs from 'fs'

/**
 * Get the list of packages installed.
 *
 * @param projectRoot
 * @return {[]}
 */
export const getPackages = (projectRoot = process.cwd()) => {
  const composerLock = path.join(projectRoot, 'composer.lock')

  if (!fs.existsSync(composerLock)) {
    throw new Error(`composer.lock not found in ${projectRoot}`)
  }

  /** @type {{packages: []}} */
  const lock = JSON.parse(fs.readFileSync(composerLock, 'utf8'))

  return lock.packages ?? []
}

/**
 * Return a list of registration files for the given composer package config.
 * FIXME: At one point this could be any file, not just `registration.php`.
 *
 * @param {{autoload?}} pkg
 * @return {[]}
 */
export const getRegistrations = (pkg) => {
  return (pkg?.autoload?.files || []).filter((file) => file.endsWith('registration.php'))
}
