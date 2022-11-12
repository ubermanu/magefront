import path from 'path'
import fs from 'fs'
import memo from 'memoizee'

import { rootPath } from '../env'

export interface ComposerPackage {
  name: string
  type: string
  autoload?: {
    files?: string[]
  }
}

/**
 * Get the list of packages installed.
 *
 * @return {ComposerPackage[]}
 */
export const getPackages = memo(() => {
  const composerLock = path.join(rootPath, 'composer.lock')

  if (!fs.existsSync(composerLock)) {
    throw new Error(`composer.lock not found in ${rootPath}`)
  }

  /** @type {{packages: []}} */
  const lock = JSON.parse(fs.readFileSync(composerLock, 'utf8'))

  return lock.packages ?? []
})

/**
 * Return a list of registration files for the given composer package config.
 * FIXME: At one point this could be any file, not just `registration.php`.
 *
 * @param {ComposerPackage} pkg
 * @return {[]}
 */
export const getRegistrations = (pkg: ComposerPackage) => {
  return (pkg?.autoload?.files ?? []).filter((file: string) => file.endsWith('registration.php'))
}
