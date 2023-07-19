import { parse } from 'csv-parse'
import type { Plugin } from 'magefront'
import fs from 'node:fs'
import path from 'node:path'

/** Generates a `js-translation.json` file for the current locale. */
export default (): Plugin => {
  return async (context) => {
    const files = []

    const { locale, moduleList, languageList } = context
    const translationFilename = locale + '.csv'

    // Get the translation files from the language packs
    languageList.forEach((lang) => {
      if (lang.code !== locale) {
        return
      }

      const translationFile = path.join(lang.src, translationFilename)
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

      const translationFile = path.join(mod.src, 'i18n', translationFilename)
      if (fs.existsSync(translationFile)) {
        files.push(translationFile)
      }
    })

    // Get the translation file from the theme
    // FIXME: Get the translations from the parent themes
    const themeTranslationFile = path.join(context.src, 'i18n', translationFilename)
    if (fs.existsSync(themeTranslationFile)) {
      files.push(themeTranslationFile)
    }

    let records: { [key: string]: string } = {}

    const parser = parse({
      delimiter: ',',
      escape: '"',
      columns: false,
      skipEmptyLines: true,
      skipRecordsWithError: true,
    })

    // Only output the translation targeted to `lib`
    // TODO: It might be nice to include all the translations with a priority system
    parser.on('readable', () => {
      let record
      while ((record = parser.read()) !== null) {
        if (record[2] === 'lib') {
          records[record[0]] = record[1]
        }
      }
    })

    parser.on('end', () => {
      const file = path.join(context.src, 'js-translation.json')
      fs.writeFileSync(file, JSON.stringify(records, null, 2))
    })

    // Merge the translation files into one giant string
    files.forEach((file) => {
      parser.write(fs.readFileSync(file).toString())
    })

    parser.end()

    await new Promise((resolve, reject) => {
      parser.on('error', reject)
      parser.on('finish', resolve)
    })
  }
}
