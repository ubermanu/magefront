import memo from 'memoizee'
import fs from 'node:fs'
import path from 'node:path'
import { getRegistrations } from './composer.js'

/**
 * Get all the languages loaded from the `composer.lock` file.
 *
 * @type {(
 *   context: import('types').MagentoContext
 * ) => import('types').MagentoLanguage[]}
 */
export const getLanguages = memo((context) => {
  const { rootPath } = context

  /** @type {Map<string, import('types').MagentoLanguage>} */
  const languages = new Map()

  // Get the list of languages in the app/i18n directory.
  const i18nPath = path.join(rootPath, 'app/i18n')
  if (fs.existsSync(i18nPath)) {
    fs.readdirSync(i18nPath).forEach((vendor) => {
      const vendorPath = path.join(i18nPath, vendor)
      fs.readdirSync(vendorPath).forEach((language) => {
        const languagePath = path.join(vendorPath, language)
        const code = getCodeFromLanguageXml(
          path.join(languagePath, 'language.xml')
        )

        if (!code) {
          return
        }

        languages.set(`${vendor}/${language}`, {
          name: `${vendor}/${language}`,
          code,
          src: path.relative(rootPath, languagePath),
          enabled: true,
        })
      })
    })
  }

  // Get the list of languages in the vendor directory.
  // For each package, get the subpackages according to the `registration.php` file.
  const packages = context.packages.filter(
    (pkg) => pkg.type === 'magento2-language'
  )

  packages.forEach((pkg) => {
    getRegistrations(pkg).forEach((registration) => {
      const src = path.join('vendor', pkg.name, path.dirname(registration))
      const name = pkg.name
      const code = getCodeFromLanguageXml(
        path.join(rootPath, src, 'language.xml')
      )

      if (!code) {
        // TODO: logger.warn(`Language code not found in ${cwd}/language.xml`)
        return
      }

      languages.set(name, {
        name,
        code,
        src,
        enabled: true,
      })
    })
  })

  return Array.from(languages.values())
})

/**
 * Get the locale code of a language pkg from its `language.xml` file.
 *
 * @param {string} file
 * @returns {string | false}
 */
function getCodeFromLanguageXml(file) {
  const languageXml = fs.readFileSync(file).toString()
  const match = languageXml.match(/<code>(.*)<\/code>/)
  return match ? match[1].trim() : false
}
