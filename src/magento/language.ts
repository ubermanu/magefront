import memo from 'memoizee'
import fs from 'node:fs'
import path from 'node:path'

import { rootPath } from '../env'
import type { ComposerPackage } from './composer'
import { getPackages, getRegistrations } from './composer'
import type { MagentoModule } from './module'

export interface MagentoLanguage extends MagentoModule {
  code: string | false
}

/**
 * Get all the languages loaded from the `composer.lock` file.
 *
 * @returns MagentoLanguage[]
 */
export const getLanguages = memo(() => {
  const list: { [name: string]: MagentoLanguage } = {}

  // Get the list of languages in the vendor directory.
  // For each package, get the subpackages according to the `registration.php` file.
  const packages: ComposerPackage[] = getPackages().filter((pkg: ComposerPackage) => pkg.type === 'magento2-language')

  packages.forEach((pkg: ComposerPackage) => {
    getRegistrations(pkg).forEach((registration) => {
      const src = path.join('vendor', pkg.name, path.dirname(registration))
      const name = pkg.name
      const code = getCodeFromLanguageXml(path.join(rootPath, src, 'language.xml'))

      list[name] = {
        name,
        code,
        src,
        enabled: true,
      }
    })
  })

  return Object.values(list)
})

/**
 * Get the locale code of a language pkg from its `language.xml` file.
 *
 * @param {string} file
 * @returns {string | false}
 */
function getCodeFromLanguageXml(file: string) {
  const languageXml = fs.readFileSync(file).toString()
  const match = languageXml.match(/<code>(.*)<\/code>/)
  return match ? match[1].trim() : false
}
