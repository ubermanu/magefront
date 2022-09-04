import { getConfigForTheme } from '../config.mjs'
import fs from 'fs'
import path from 'path'
import glob from 'fast-glob'

export const deploy = async (themeName, locale = 'en_US', clean = true) => {
  const themeConfig = await getConfigForTheme(themeName)

  // Clean up the destination dir
  if (clean && fs.existsSync(themeConfig.dest)) {
    fs.rmSync(themeConfig.dest, { recursive: true })
  }

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
  glob(sources, { cwd: themeConfig.src, ignore: excludes }).then((files) => {
    return Promise.all(
      files.map((file) => {
        const filePath = fs.realpathSync(path.join(themeConfig.src, file), 'utf8')
        const destPath = path.join(dest, file.replace(/^(\w+_\w+\/)?(web\/)/, '$1'))
        fs.mkdirSync(path.dirname(destPath), { recursive: true })
        fs.copyFileSync(filePath, destPath)
      })
    )
  })
}
