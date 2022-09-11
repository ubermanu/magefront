import fs from 'fs'
import path from 'path'

import { ComposerPackage, getPackages, getRegistrations } from './composer'
import { MagentoModule } from './magentoModule'
import { rootPath } from '../env'

export class Language {
  code: string | false = false
  name: string = ''
  src: string = ''
}

/**
 * Get all the languages loaded from the `composer.lock` file.
 *
 * @return MagentoModule[]
 */
export const getLanguages = () => {
  const list = {}

  // Get the list of languages in the vendor directory.
  // For each package, get the subpackages according to the `registration.php` file.
  const packages = getPackages().filter((pkg: ComposerPackage) => pkg.type === 'magento2-language')

  packages.forEach((pkg: ComposerPackage) => {
    getRegistrations(pkg).forEach((registration) => {
      const src = path.join('vendor', pkg.name, path.dirname(registration))
      const name = pkg.name
      const code = getCodeFromLanguageXml(path.join(rootPath, src, 'language.xml'))

      const lang = new Language()
      lang.name = name
      lang.code = code
      lang.src = src

      list[name] = lang
    })
  })

  return Object.values(list)
}

/**
 * Get the locale code of a language pkg from its `language.xml` file.
 *
 * @param {string} file
 * @return {string|false}
 */
function getCodeFromLanguageXml(file: string) {
  const languageXml = fs.readFileSync(file, 'utf8')
  const match = languageXml.match(/<code>(.*)<\/code>/)
  return match ? match[1].trim() : false
}
