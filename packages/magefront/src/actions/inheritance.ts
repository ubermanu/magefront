import glob, { Pattern } from 'fast-glob'
import fs from 'fs-extra'
import path from 'node:path'
import { getThemeDependencyTree } from '../magento/theme'
import type { Action } from '../types'

/** Gather all the theme files and copy them to the temporary directory. When this is done, the `build` task should be run afterwards. */
export const inheritance: Action = async (context) => {
  const { rootPath } = context.magento
  const { tmp } = context.buildConfig

  // Copy the files from the src to the destination directory.
  async function generateCopies(src: string, dest: string, ignore: Pattern[] = []) {
    const files = await glob(src + '/**', {
      cwd: rootPath,
      ignore: ignore.map((pattern) => path.join(src, pattern)),
      onlyFiles: true,
    })
    await Promise.all(
      files.map(async (srcPath) => {
        const destPath = path.join(dest, srcPath.replace(src + '/', '/'))
        await fs.rm(destPath, { recursive: true, force: true })
        return fs.copy(path.join(rootPath, srcPath), destPath)
      })
    )
  }

  // Clean destination dir
  fs.removeSync(tmp)

  // Add the Magento core lib resources as a dependency for everyone
  // Ignore the css docs and txt files
  await generateCopies(path.join('lib', 'web'), tmp, ['css/docs', '**/*.txt', 'i18n'])

  // For each enabled modules, copy the web resources into the theme temp dir
  const modules = context.magento.modules.filter((m) => m.enabled && m.src)
  const ignore = ['**/node_modules/**']

  await Promise.all(
    modules.map(async (m) => {
      // Resolve the "base" area as well (common to frontend and adminhtml)
      await generateCopies(path.join(m.src, 'view', 'base', 'web'), path.join(tmp, m.name), ignore)
      await generateCopies(path.join(m.src, 'view', context.theme.area, 'web'), path.join(tmp, m.name), ignore)
    })
  )

  // Copy the files from the themes
  for (const theme of getThemeDependencyTree(context.theme)) {
    // TODO: Implement custom ignore property in the theme config
    // TODO: Add support for a `.magefrontignore` file?
    await generateCopies(path.join(theme.src, 'web'), tmp, ignore)

    // Add the submodule source files (ex: `Magento_Catalog/web`)
    await Promise.all(
      modules.map((m) => {
        return generateCopies(path.join(theme.src, m.name, 'web'), path.join(tmp, m.name), ignore)
      })
    )
  }
}