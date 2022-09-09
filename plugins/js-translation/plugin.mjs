import path from 'path'
import fs from 'fs'
import csv from 'csv'

/**
 * Generate a `js-translation.json` file for the current locale.
 *
 * @param {{src?: string, dest?: string}} options
 * @return {(function(*): void)|*}
 */
export default (options = {}) => {
  const { src, dest } = options

  return (themeConfig) => {
    const files = []
    let packed = ''

    const { locale, moduleList, languageList } = themeConfig
    const translationFilename = locale + '.csv'

    // Get the translation files from the language packs
    languageList.forEach((lang) => {
      const translationFile = path.join(lang.src, src || 'i18n', translationFilename)
      if (fs.existsSync(translationFile)) {
        files.push(translationFile)
      }
    })

    // Get the translation files from the modules
    // TODO: Sort the modules by dependencies tree
    moduleList.forEach((mod) => {
      if (!mod.enabled || !mod.src) {
        return
      }

      const translationFile = path.join(mod.src, src || 'i18n', translationFilename)
      if (fs.existsSync(translationFile)) {
        files.push(translationFile)
      }
    })

    // Get the translation file from the theme
    const themeTranslationFile = path.join(themeConfig.src, src || 'i18n', translationFilename)
    if (fs.existsSync(themeTranslationFile)) {
      files.push(themeTranslationFile)
    }

    // Merge the translation files into one giant string
    files.forEach((file) => {
      packed += `${fs.readFileSync(file, 'utf8')}\n`
    })

    const file = path.join(themeConfig.src, dest || 'js-translation.json')
    fs.mkdirSync(path.dirname(file), { recursive: true })

    // Parse the CSV file and generate the JSON file
    csv.parse(packed, { columns: true }, (err, data) => {
      if (err) {
        throw err
      }

      fs.writeFileSync(file, JSON.stringify(data))
    })
  }
}
