import fs from 'fs'
import path from 'path'
import glob from 'fast-glob'

import { getConfigForTheme } from '../config'

/**
 * Deploy the built theme files from the temp directory to the `pub/static` dir.
 * Only the files in the `web` directory are deployed.
 * This is the third step in the build process.
 *
 * @param {string} themeName
 * @param {string} locale
 * @returns {Promise<Awaited<unknown>[]>}
 */
export const deploy = async (themeName: string, locale: string = 'en_US') => {
  const themeConfig = await getConfigForTheme(themeName)

  // Append the local to the destination dir
  const dest = path.join(themeConfig.dest, locale)

  // Get the web directories
  const sources = ['web/**/*', '[A-Z]*_[A-Z]*/web/**/*']

  const excludes = [
    '**/node_modules',
    '**/*.less',
    '**/*.scss',
    '**/*.styl',
    '**/*.ts',
    '**/*.mts',
    '**/*.tsx',
    '**/*.jsx',
    '**/*.svelte',
    '**/*.vue'
  ]

  // Copy all the files from the src (tmp) dir to the dest dir
  // Remove the 'web' part from the path
  const files = await glob(sources, { cwd: themeConfig.src, ignore: excludes })

  return Promise.all(
    files.map(async (file) => {
      const filePath = await fs.promises.realpath(path.join(themeConfig.src, file))
      const destPath = path.join(dest, file.replace(/^(\w+_\w+\/)?(web\/)/, '$1'))
      await fs.promises.mkdir(path.dirname(destPath), { recursive: true })
      await fs.promises.copyFile(filePath, destPath)
    })
  )
}
