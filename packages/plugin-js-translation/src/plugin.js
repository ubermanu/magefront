import { parse } from 'csv-parse'
import glob from 'fast-glob'
import fs from 'node:fs'
import path from 'node:path'
import {
  REGEX_I18N_BINDING,
  REGEX_MAGE_TRANSLATE,
  REGEX_TRANSLATE_FUNCTION,
  REGEX_TRANSLATE_TAG_OR_ATTR,
} from './parsers.js'

/**
 * Generates a `js-translation.json` file for the current locale.
 *
 * @returns {import('magefront').Plugin}
 */
export default () => ({
  name: 'js-translation',

  async build(context) {
    const { locale } = context
    const { languages, modules, rootPath } = context.magento

    const phrases = new Set()

    /**
     * Extract the phrases from the given data.
     *
     * @param {RegExp} regex
     * @param {string} data
     * @param {number} expectedGroupsCount
     * @param {number} valueGroupIndex
     */
    function extractPhrases(regex, data, expectedGroupsCount, valueGroupIndex) {
      const results = []
      let match

      while ((match = regex.exec(data)) !== null) {
        results.push(match)
      }

      for (let i = 0; i < results.length; i++) {
        if (
          results[i].length === expectedGroupsCount &&
          results[i][valueGroupIndex]
        ) {
          phrases.add(results[i][valueGroupIndex])
        }
      }
    }

    // Extract the phrases from the preprocessed JS files
    const jsFiles = await glob('**/*.js', {
      cwd: context.cwd,
      ignore: ['**/node_modules/**'],
      onlyFiles: true,
    })

    await Promise.all(
      jsFiles.map(async (file) => {
        const content = await fs.promises.readFile(path.join(context.cwd, file))
        extractPhrases(REGEX_MAGE_TRANSLATE, content.toString(), 3, 2)
        extractPhrases(REGEX_TRANSLATE_FUNCTION, content.toString(), 3, 2)
      })
    )

    // Extract the phrases from the preprocessed HTML files
    const htmlFiles = await glob('**/*.html', {
      cwd: context.cwd,
      ignore: ['**/node_modules/**'],
      onlyFiles: true,
    })

    await Promise.all(
      htmlFiles.map(async (file) => {
        const content = await fs.promises.readFile(path.join(context.cwd, file))
        extractPhrases(REGEX_I18N_BINDING, content.toString(), 2, 1)
        extractPhrases(REGEX_TRANSLATE_TAG_OR_ATTR, content.toString(), 3, 2)
        extractPhrases(REGEX_TRANSLATE_FUNCTION, content.toString(), 3, 2)
      })
    )

    const translationFilename = locale + '.csv'
    const files = []

    // Get the translation files from the language packs
    languages.forEach((lang) => {
      if (lang.code !== locale) {
        return
      }

      const translationFile = path.join(rootPath, lang.src, translationFilename)
      if (fs.existsSync(translationFile)) {
        files.push(translationFile)
      }
    })

    // Get the translation files from the modules
    modules.forEach((mod) => {
      if (!mod.enabled || !mod.src) {
        return
      }

      const translationFile = path.join(
        rootPath,
        mod.src,
        'i18n',
        translationFilename
      )
      if (fs.existsSync(translationFile)) {
        files.push(translationFile)
      }
    })

    // Get the translation file from the theme (and its parents)
    for (const theme of context.themeDependencyTree) {
      const themeTranslationFile = path.join(
        path.join(rootPath, theme.src),
        'i18n',
        translationFilename
      )
      if (fs.existsSync(themeTranslationFile)) {
        files.push(themeTranslationFile)
      }
    }

    /** @type {Record<string, string>} */
    let records = {}

    const parser = parse({
      delimiter: ',',
      escape: '"',
      columns: false,
      skipEmptyLines: true,
      skipRecordsWithError: true,
    })

    // Only output the translation targeted to `lib`
    parser.on('readable', () => {
      let record
      while ((record = parser.read()) !== null) {
        if (phrases.has(record[0])) {
          records[record[0]] = record[1]
        }
      }
    })

    parser.on('end', () => {
      const file = path.join(context.dest, 'js-translation.json')
      // Sort the records by key
      records = Object.fromEntries(Object.entries(records).sort())
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
  },
})
