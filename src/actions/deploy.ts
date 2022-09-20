import fs from 'fs-extra'
import path from 'path'
import glob from 'fast-glob'

import { getThemeConfig } from '../config'

/**
 * Deploy the built theme files from the temp directory to the `pub/static` dir.
 * This is the third step in the build process.
 *
 * @param {string} themeName
 * @param {string} locale
 * @returns {Promise<Awaited<unknown>[]>}
 */
export const deploy = async (themeName: string, locale: string = 'en_US') => {
  const themeConfig = await getThemeConfig(themeName)

  // Append the local to the destination dir
  const dest = path.join(themeConfig.dest, locale)

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

  // Copy all the files from the src (tmp) dir to the `pub/static` dir
  const files = await glob('**/*', { cwd: themeConfig.src, ignore: excludes })

  await Promise.all(
    files.map(async (file) => {
      const filePath = await fs.promises.realpath(path.join(themeConfig.src, file))
      const destPath = path.join(dest, file)
      return fs.copy(filePath, destPath)
    })
  )
}
