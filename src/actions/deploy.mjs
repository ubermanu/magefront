import { getConfigForTheme } from '../config.mjs'
import fs from 'fs'
import path from 'path'

export const deploy = async (themeName, locale = 'en_US', clean = true) => {
  const themeConfig = await getConfigForTheme(themeName)

  // Clean up the destination dir
  if (clean && fs.existsSync(themeConfig.dest)) {
    fs.rmSync(themeConfig.dest, { recursive: true })
  }

  // Append the local to the destination dir
  const dest = path.join(themeConfig.dest, locale)

  const excludes = [
    'node_modules',
    'vendor',
    '**/*.less',
    '**/*.scss',
    '**/*.styl',
    '**/*.ts',
    '**/*.tsx',
    '**/*.jsx',
    '**/*.svelte',
    '**/*.vue'
  ]

  // Copy all the files from the src (tmp) dir to the dest dir
  // TODO: Exclude files that are not needed
}
