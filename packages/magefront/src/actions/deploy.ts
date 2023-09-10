import glob from 'fast-glob'
import fs from 'node:fs'
import path from 'node:path'
import type { Action } from '../../types/magefront'

/** Deploy the built theme files from the temp directory to the `pub/static` dir. This is the third step in the build process. */
export const deploy: Action = async (context) => {
  const { locale, buildConfig } = context

  // Append the local to the destination dir
  const dest = path.join(buildConfig.dest, locale)

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
    '**/*.vue',
    '**/*.postcss',
    '**/*.pcss',
  ]

  // Copy all the files from the src (tmp) dir to the `pub/static` dir
  const files = await glob('**/*', { cwd: buildConfig.tmp, ignore: excludes })

  await Promise.all(
    files.map(async (file) => {
      const filePath = await fs.promises.realpath(path.join(buildConfig.tmp, file))
      const destPath = path.join(dest, file)
      return fs.promises.cp(filePath, destPath, { recursive: true })
    })
  )
}
