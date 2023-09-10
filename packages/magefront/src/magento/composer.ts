import memo from 'memoizee'
import fs from 'node:fs'
import path from 'node:path'
import type { ComposerPackage } from '../../types/magefront'

/**
 * Get the list of packages installed.
 *
 * @returns {ComposerPackage[]}
 */
export const getPackages = memo((rootPath: string) => {
  const composerLock = path.join(rootPath, 'composer.lock')

  if (!fs.existsSync(composerLock)) {
    throw new Error(`composer.lock not found in ${rootPath}`)
  }

  const lock: { packages: [] } | undefined = JSON.parse(fs.readFileSync(composerLock, 'utf8'))

  return lock?.packages ?? []
})

/** Return a list of registration files for the given composer package config. */
// FIXME: At one point this could be any file, not just `registration.php`.
export const getRegistrations = (pkg: ComposerPackage): string[] => {
  return (pkg?.autoload?.files ?? []).filter((file: string) => file.endsWith('registration.php'))
}
