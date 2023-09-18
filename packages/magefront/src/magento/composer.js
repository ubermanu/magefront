import memo from 'memoizee'
import fs from 'node:fs'
import path from 'node:path'

/**
 * Get the list of packages installed.
 *
 * @type {(rootPath: string) => import('types').ComposerPackage[]}
 */
export const getPackages = memo((rootPath) => {
  const composerLock = path.join(rootPath, 'composer.lock')

  if (!fs.existsSync(composerLock)) {
    throw new Error(`composer.lock not found in ${rootPath}`)
  }

  /** @type {{ packages: [] } | undefined} */
  const lock = JSON.parse(fs.readFileSync(composerLock).toString())

  return lock?.packages ?? []
})

/**
 * Return a list of registration files for the given composer package config.
 *
 * @param {import('types').ComposerPackage} pkg
 * @returns {string[]}
 */
// FIXME: At one point this could be any file, not just `registration.php`.
export function getRegistrations(pkg) {
  return (pkg?.autoload?.files ?? []).filter((file) => file.endsWith('registration.php'))
}
