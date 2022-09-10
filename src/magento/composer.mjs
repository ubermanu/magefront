import path from 'path'
import fs from 'fs'
import { rootPath } from '../env.mjs'

/**
 * Get the list of packages installed.
 *
 * @return {[]}
 */
export const getPackages = () => {
  const composerLock = path.join(rootPath, 'composer.lock')

  if (!fs.existsSync(composerLock)) {
    throw new Error(`composer.lock not found in ${rootPath}`)
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
  return (pkg?.autoload?.files ?? []).filter((file) => file.endsWith('registration.php'))
}
