import memo from 'memoizee'
import fs from 'node:fs'
import path from 'node:path'
import type { MagentoContext, MagentoLanguage } from '../types'
import { getRegistrations } from './composer'

/**
 * Get all the languages loaded from the `composer.lock` file.
 *
 * @returns MagentoLanguage[]
 */
export const getLanguages = memo((context: MagentoContext) => {
  const { rootPath } = context
  const list: { [name: string]: MagentoLanguage } = {}

  // Get the list of languages in the vendor directory.
  // For each package, get the subpackages according to the `registration.php` file.
  const packages = context.packages.filter((pkg) => pkg.type === 'magento2-language')

  packages.forEach((pkg) => {
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
